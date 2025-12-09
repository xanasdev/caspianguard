import asyncio
import logging

from aiogram import Bot, Dispatcher, F
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.types import (
    Message,
    CallbackQuery,
    ReplyKeyboardRemove,
    Location,
)
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application
from aiohttp import web
import aiohttp

from config import bot_config, webhook_config
from keyboards import *
from services_api_client import ApiClient
from states import ReportProblemState, AdminChatState, LinkTelegramState


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


bot = Bot(
    token=bot_config.token,
    default=DefaultBotProperties(parse_mode=ParseMode.HTML),
)
dp = Dispatcher()
api_client = ApiClient()


@dp.message(CommandStart())
async def cmd_start(message: Message, state: FSMContext) -> None:
    await state.clear()

    text = (
        "👋 <b>Каспийский страж</b> на связи!\n\n"
        "С помощью этого бота вы можете сообщить о загрязнении побережья Каспийского моря, "
        "а волонтёры смогут оперативно откликнуться и помочь.\n\n"
        "Выберите нужный пункт в меню ниже."
    )
    await message.answer(text, reply_markup=main_menu_kb())


@dp.message(F.text == "❌ Отмена")
async def cancel(message: Message, state: FSMContext) -> None:
    await state.clear()
    await message.answer("Действие отменено.", reply_markup=main_menu_kb())


@dp.message(F.text == "📤 Отправить проблему")
async def start_report(message: Message, state: FSMContext) -> None:
    await state.set_state(ReportProblemState.waiting_for_photo)
    await message.answer("📷 Пришлите, пожалуйста, <b>фото</b> проблемы.", reply_markup=cancel_kb())


@dp.message(ReportProblemState.waiting_for_photo, F.photo)
async def report_photo(message: Message, state: FSMContext) -> None:
    photo = message.photo[-1]
    await state.update_data(photo_file_id=photo.file_id)
    await state.set_state(ReportProblemState.waiting_for_type)
    await message.answer("🔎 Укажите тип проблемы", reply_markup=await pollution_type())


@dp.message(ReportProblemState.waiting_for_photo)
async def report_photo_invalid(message: Message) -> None:
    await message.answer("Нужно прислать именно <b>фото</b>. Попробуйте ещё раз.")


@dp.message(ReportProblemState.waiting_for_type)
async def report_type(message: Message, state: FSMContext) -> None:
    await state.update_data(problem_type=message.text.strip())
    await state.set_state(ReportProblemState.waiting_for_description)
    await message.answer("✏️ Опишите, пожалуйста, проблему подробнее.", reply_markup=ReplyKeyboardRemove())


@dp.message(ReportProblemState.waiting_for_description)
async def report_description(message: Message, state: FSMContext) -> None:
    await state.update_data(description=message.text.strip())
    await state.set_state(ReportProblemState.waiting_for_location)
    await message.answer("📍 Отправьте, пожалуйста, вашу <b>геолокацию</b> (кнопкой «Отправить геопозицию»).", reply_markup=location_keyboard())


@dp.message(ReportProblemState.waiting_for_location, F.location)
async def report_location(message: Message, state: FSMContext) -> None:
    loc: Location = message.location
    await state.update_data(latitude=loc.latitude, longitude=loc.longitude)
    await state.set_state(ReportProblemState.waiting_for_phone)
    await message.answer(
        "📞 Если хотите, отправьте номер телефона (текстом или контакт‑карточкой).\n"
        "Если не хотите оставлять номер — просто отправьте «Пропустить».", reply_markup=send_number_kb()
    )


@dp.message(ReportProblemState.waiting_for_location)
async def report_location_invalid(message: Message) -> None:
    await message.answer("Нужно отправить <b>геолокацию</b>, а не текст. Попробуйте ещё раз.")


@dp.message(ReportProblemState.waiting_for_phone)
async def report_phone(message: Message, state: FSMContext) -> None:
    # Проверяем контакт (карточку номера)
    if message.contact:
        phone = message.contact.phone_number
    elif message.text:
        phone_raw = message.text.strip()
        phone = None if phone_raw.lower() == "пропустить" else phone_raw
    else:
        phone = None

    data = await state.get_data()
    await state.clear()

    try:
        file = await bot.get_file(data["photo_file_id"])
        photo_bytes = await bot.download_file(file.file_path)

        await api_client.create_problem(
            telegram_id=message.from_user.id,
            photo_bytes=photo_bytes.read(),
            pollution_type=data["problem_type"],
            description=data["description"],
            latitude=data["latitude"],
            longitude=data["longitude"],
            phone=phone,
        )
        await message.answer("✅ Спасибо! Заявка отправлена администрации и волонтёрам.", reply_markup=main_menu_kb())
    except Exception as e:
        logger.exception("Ошибка при создании проблемы: %s", e)
        await message.answer(
            "⚠️ Произошла ошибка при сохранении вашей заявки. Попробуйте позже.",
            reply_markup=main_menu_kb(),
        )


@dp.message(F.text == "📋 Список объявлений")
async def list_announcements(message: Message) -> None:
    await send_announcements_page(message.chat.id, page=1)


async def send_announcements_page(chat_id: int, page: int) -> None:
    try:
        response = await api_client.list_problems(page=page, page_size=5)
        problems = response.get('items', []) if isinstance(response, dict) else response
        
        if not problems:
            await bot.send_message(chat_id, "⚠️ Нет объявлений на этой странице.")
            return

        for problem in problems:
            text = (
                f"📌 <b>Объявление #{problem['id']}</b>\n\n"
                f"📍 <b>Тип:</b> {problem['pollution_type']}\n"
                f"📝 <b>Описание:</b> {problem['description']}\n"
                f"📞 <b>Телефон:</b> {problem.get('phone_number') or '—'}\n"
                f"📍 <b>Координаты:</b> {problem['latitude']}, {problem['longitude']}"
            )
            
            if problem.get('image_url'):
                await bot.send_photo(
                    chat_id, 
                    photo=problem['image_url'], 
                    caption=text,
                    reply_markup=announcement_actions_kb(problem["id"])
                )
            else:
                await bot.send_message(chat_id, text, reply_markup=announcement_actions_kb(problem["id"]))
            
            await bot.send_location(chat_id, latitude=problem['latitude'], longitude=problem['longitude'])
    except Exception as e:
        logger.exception("Ошибка при получении списка объявлений: %s", e)
        await bot.send_message(chat_id, "⚠️ Произошла ошибка при получении списка объявлений. Попробуйте позже.")


@dp.callback_query(F.data.startswith("ann_page:"))
async def cb_ann_page(callback: CallbackQuery) -> None:
    await callback.answer()
    _, page_str = callback.data.split(":", 1)
    page = int(page_str)
    await send_announcements_page(callback.message.chat.id, page=page)


@dp.callback_query(F.data.startswith("ann_take:"))
async def cb_ann_take(callback: CallbackQuery) -> None:
    await callback.answer()
    _, id_str = callback.data.split(":", 1)
    problem_id = int(id_str)
    try:
        await api_client.take_problem(callback.from_user.id, problem_id)
        await callback.message.answer(
            f"✅ Вы взяли в работу объявление #{problem_id}. Спасибо за помощь!",
        )
    except Exception as e:
        logger.exception("Ошибка при взятии проблемы в работу: %s", e)
        await callback.message.answer("⚠️ Не удалось обновить статус объявления. Попробуйте позже.")


@dp.message(F.text == "👤 Мой профиль")
async def user_profile(message: Message) -> None:
    # Пока авторизация в backend не завязана на бота, показываем
    # только информацию из Telegram-профиля пользователя.
    tg_full_name = message.from_user.full_name
    tg_username = f"@{message.from_user.username}" if message.from_user.username else "—"
    role = "пользователь (без привязки к аккаунту в системе)"

    text = (
        f"👤 <b>Профиль пользователя</b>\n\n"
        f"🧾 <b>Инфо:</b> {tg_full_name}\n"
        f"🔗 <b>Юзернейм:</b> {tg_username}\n"
        f"🎭 <b>Роль:</b> {role}\n"
    )
    await message.answer(text)


@dp.message(F.text == "📞 Связь с администрацией")
async def contact_admin(message: Message, state: FSMContext) -> None:
    await state.set_state(AdminChatState.waiting_for_message)
    await message.answer(
        "✉️ Напишите сообщение для администрации. После отправки администратор сможет ответить вам.",
        reply_markup=ReplyKeyboardRemove(),
    )


@dp.message(AdminChatState.waiting_for_message)
async def admin_chat_message(message: Message, state: FSMContext) -> None:
    await state.clear()
    await message.answer(
        "✅ Ваше сообщение отправлено администрации. Ожидайте ответа.",
        reply_markup=main_menu_kb(),
    )


@dp.message(F.text == "🔗 Привязать аккаунт")
async def link_account(message: Message, state: FSMContext) -> None:
    await state.set_state(LinkTelegramState.login)
    await message.answer("Введите логин аккаунта", reply_markup=cancel_kb())


@dp.message(LinkTelegramState.login)
async def link_account_password(message: Message, state: FSMContext) -> None:
    await state.update_data(login=message.text)
    await state.set_state(LinkTelegramState.password)
    await message.answer("Введите пароль", reply_markup=cancel_kb())


@dp.message(LinkTelegramState.password)
async def link_account_finish(message: Message, state: FSMContext) -> None:
    data = await state.get_data()

    await api_client.register_user(
        username=data.get("login"),
        password=message.text,
        telegram_id=message.from_user.id,
    )
    await state.clear()
    await message.answer("Аккаунт успешно привязан", reply_markup=main_menu_kb())


async def on_startup() -> None:
    if webhook_config.use_webhook:
        if not webhook_config.webhook_url:
            raise RuntimeError("WEBHOOK_URL не задан, но USE_WEBHOOK=true")
        await bot.set_webhook(webhook_config.webhook_url)
        logger.info("Webhook установлен: %s", webhook_config.webhook_url)


async def on_shutdown() -> None:
    await bot.session.close()


async def run_polling() -> None:
    await dp.start_polling(bot)


async def run_webhook() -> None:
    app = web.Application()
    SimpleRequestHandler(dispatcher=dp, bot=bot).register(app, path="/webhook")
    setup_application(app, dp, bot=bot)
    app.on_startup.append(lambda _: on_startup())
    app.on_shutdown.append(lambda _: on_shutdown())

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, webhook_config.webapp_host, webhook_config.webapp_port)
    logger.info(
        "Запуск webhook-сервера на %s:%s",
        webhook_config.webapp_host,
        webhook_config.webapp_port,
    )
    await site.start()

    try:
        while True:
            await asyncio.sleep(3600)
    finally:
        await runner.cleanup()


if __name__ == "__main__":
    if not bot_config.token:
        raise RuntimeError("BOT_TOKEN не задан в переменных окружения")

    if webhook_config.use_webhook:
        asyncio.run(run_webhook())
    else:
        asyncio.run(run_polling())


