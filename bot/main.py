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
    
    # Проверяем есть ли deep link аргумент
    args = message.text.split(maxsplit=1)
    if len(args) > 1 and args[1].startswith('take_'):
        pollution_id = args[1].replace('take_', '')
        try:
            pollution_id = int(pollution_id)
            problem = await api_client.get_pollution_detail(pollution_id)
            await api_client.take_problem(message.from_user.id, pollution_id)
            
            pollution_type = problem.get('pollution_type', 'Неизвестно')
            latitude = problem.get('latitude', 0)
            longitude = problem.get('longitude', 0)
            
            await message.answer(
                f"✅ Вы успешно взяли в работу проблему #{pollution_id} - {pollution_type}. Спасибо за помощь!",
                reply_markup=main_menu_kb()
            )
            
            if latitude and longitude:
                try:
                    await message.answer_location(
                        latitude=float(latitude),
                        longitude=float(longitude)
                    )
                except Exception as loc_error:
                    logger.warning(f"Ошибка отправки геолокации: {loc_error}")
            return
        except aiohttp.ClientResponseError as e:
            if e.status == 401:
                await message.answer("⚠️ Необходимо авторизоваться. Используйте '🔗 Привязать аккаунт' для привязки аккаунта.", reply_markup=main_menu_kb())
            elif e.status == 403:
                error_data = getattr(e, 'error_data', {})
                error_msg = error_data.get('detail', 'У вас нет прав для взятия проблемы в работу.')
                await message.answer(f"⚠️ {error_msg}", reply_markup=main_menu_kb())
            else:
                await message.answer("⚠️ Не удалось взять проблему в работу.", reply_markup=main_menu_kb())
        except Exception as e:
            logger.exception("Ошибка при взятии проблемы: %s", e)
            await message.answer("⚠️ Не удалось взять проблему в работу.", reply_markup=main_menu_kb())
            return
    
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
        phone = None if phone_raw.lower() == "➡️ Пропустить" else phone_raw
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
        
        # Бекенд возвращает {"count": X, "next": "...", "previous": "...", "results": [...]}
        problems = response.get('results', [])
        has_next = bool(response.get('next'))
        
        if not problems:
            await bot.send_message(chat_id, "⚠️ Нет объявлений на этой странице.")
            return
        
        text = "📋 <b>Список объявлений</b>\n\nВыберите объявление для просмотра деталей:"
        
        await bot.send_message(
            chat_id,
            text,
            reply_markup=announcements_list_kb(problems, page, has_next)
        )
    except Exception as e:
        logger.exception("Ошибка при получении списка объявлений: %s", e)
        await bot.send_message(chat_id, "⚠️ Произошла ошибка при получении списка объявлений. Попробуйте позже.")


@dp.callback_query(F.data.startswith("ann_page:"))
async def cb_ann_page(callback: CallbackQuery) -> None:
    await callback.answer()
    _, page_str = callback.data.split(":", 1)
    page = int(page_str)
    # Удаляем старое сообщение и отправляем новое
    await callback.message.delete()
    await send_announcements_page(callback.message.chat.id, page=page)

@dp.callback_query(F.data.startswith("ann_view:"))
async def cb_ann_view(callback: CallbackQuery) -> None:
    await callback.answer()
    _, id_str = callback.data.split(":", 1)
    pollution_id = int(id_str)
    
    try:
        problem = await api_client.get_pollution_detail(pollution_id)
        logger.info(f"Получены детали объявления #{pollution_id}: {problem}")
        
        if not problem:
            await callback.message.answer("⚠️ Объявление не найдено.")
            return
        
        # Форматируем дату
        created_at = problem.get('created_at', '')
        if created_at:
            try:
                from datetime import datetime
                # Обрабатываем разные форматы даты
                if 'T' in created_at:
                    dt = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                else:
                    dt = datetime.strptime(created_at, '%Y-%m-%d %H:%M:%S')
                created_at = dt.strftime('%d.%m.%Y %H:%M')
            except Exception as date_error:
                logger.warning(f"Ошибка форматирования даты: {date_error}, исходная дата: {created_at}")
                created_at = str(created_at)[:16]  # Берем первые 16 символов
        
        # Получаем значения с безопасными fallback
        pollution_type = problem.get('pollution_type', 'Неизвестно')
        description = problem.get('description', '—') or '—'
        phone = problem.get('phone_number') or '—'
        latitude = problem.get('latitude', 0)
        longitude = problem.get('longitude', 0)
        
        text = (
            f"📌 <b>Объявление #{problem.get('id', '?')}</b>\n\n"
            f"📍 <b>Тип:</b> {pollution_type}\n"
            f"📝 <b>Описание:</b> {description}\n"
            f"📞 <b>Телефон:</b> {phone}\n"
            f"📍 <b>Координаты:</b> {latitude}, {longitude}\n"
            f"📅 <b>Дата:</b> {created_at or '—'}\n"
            f"✅ <b>Одобрено:</b> {'Да' if problem.get('is_approved') else 'Нет'}"
        )
        
        # Отправляем фото если есть
        image_url = problem.get('image_url')
        if image_url:
            try:
                await callback.message.answer_photo(
                    photo=image_url,
                    caption=text,
                    reply_markup=announcement_actions_kb(problem.get('id', pollution_id))
                )
            except Exception as photo_error:
                logger.warning(f"Ошибка отправки фото: {photo_error}")
                await callback.message.answer(text, reply_markup=announcement_actions_kb(problem.get('id', pollution_id)))
        else:
            await callback.message.answer(text, reply_markup=announcement_actions_kb(problem.get('id', pollution_id)))
        
        # Отправляем геолокацию если координаты валидны
        if latitude and longitude:
            try:
                await callback.message.answer_location(
                    latitude=float(latitude),
                    longitude=float(longitude)
                )
            except Exception as loc_error:
                logger.warning(f"Ошибка отправки геолокации: {loc_error}")
        
    except aiohttp.ClientResponseError as e:
        error_data = getattr(e, 'error_data', {})
        if e.status == 404:
            await callback.message.answer("⚠️ Объявление не найдено.")
        else:
            logger.exception("Ошибка API при получении деталей: %s", e)
            await callback.message.answer(f"⚠️ Ошибка при загрузке объявления. Код: {e.status}")
    except Exception as e:
        logger.exception("Ошибка при получении деталей объявления: %s", e)
        await callback.message.answer("⚠️ Не удалось загрузить детали объявления. Попробуйте позже.")


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
    except aiohttp.ClientResponseError as e:
        if e.status == 401:
            await callback.message.answer("⚠️ Необходимо авторизоваться. Используйте '🔗 Привязать аккаунт' для привязки аккаунта.")
        elif e.status == 403:
            error_data = getattr(e, 'error_data', {})
            error_msg = error_data.get('detail', 'У вас нет прав для взятия проблемы в работу.')
            await callback.message.answer(f"⚠️ {error_msg}")
        else:
            logger.exception("Ошибка API при взятии проблемы: %s", e)
            await callback.message.answer("⚠️ Не удалось обновить статус объявления. Попробуйте позже.")
    except Exception as e:
        logger.exception("Ошибка при взятии проблемы в работу: %s", e)
        await callback.message.answer("⚠️ Не удалось обновить статус объявления. Попробуйте позже.")


@dp.message(F.text == "👤 Мой профиль")
async def user_profile(message: Message) -> None:
    try:
        profile = await api_client.get_user_profile(message.from_user.id)
        
        username = profile.get('username', 'Не указан')
        tg_username = f"@{message.from_user.username}" if message.from_user.username else "—"
        first_name = profile.get('first_name', '')
        last_name = profile.get('last_name', '')
        full_name = f"{first_name} {last_name}".strip() or "Не указано"
        position = profile.get('position', 'Не указана')
        completed_count = profile.get('completed_count', 0)
        
        text = (
            f"👤 <b>Мой профиль</b>\n\n"
            f"👨‍💼 <b>Логин:</b> {username}\n"
            f"🔗 <b>Telegram:</b> {tg_username}\n"
            f"📝 <b>Имя:</b> {full_name}\n"
            f"🎭 <b>Роль:</b> {position}\n"
            f"✅ <b>Завершено работ:</b> {completed_count}"
        )
        
        await message.answer(text, reply_markup=profile_kb())
    except aiohttp.ClientResponseError as e:
        if e.status == 401:
            await message.answer("⚠️ Необходимо авторизоваться. Используйте '🔗 Привязать аккаунт' для привязки аккаунта.", reply_markup=main_menu_kb())
        else:
            await message.answer("⚠️ Ошибка получения профиля.", reply_markup=main_menu_kb())
    except Exception as e:
        logger.exception("Ошибка при получении профиля: %s", e)
        await message.answer("⚠️ Ошибка получения профиля.", reply_markup=main_menu_kb())


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


@dp.callback_query(F.data.startswith("my_works:"))
async def cb_my_works(callback: CallbackQuery) -> None:
    await callback.answer()
    _, page_str = callback.data.split(":", 1)
    page = int(page_str)
    
    try:
        response = await api_client.get_user_assigned_pollutions(callback.from_user.id, page=page)
        problems = response.get('results', [])
        has_next = bool(response.get('next'))
        
        if not problems:
            await callback.message.edit_text("⚠️ У вас нет взятых работ.")
            return
        
        text = f"📋 <b>Мои работы</b> (стр. {page})\n\nВыберите работу:"
        
        await callback.message.edit_text(
            text,
            reply_markup=my_works_kb(problems, page, has_next)
        )
    except aiohttp.ClientResponseError as e:
        if e.status == 401:
            await callback.message.edit_text("⚠️ Необходимо авторизоваться.")
        else:
            await callback.message.edit_text("⚠️ Ошибка получения списка работ.")
    except Exception as e:
        logger.exception("Ошибка при получении списка работ: %s", e)
        await callback.message.edit_text("⚠️ Ошибка получения списка работ.")


@dp.callback_query(F.data.startswith("my_work_view:"))
async def cb_my_work_view(callback: CallbackQuery) -> None:
    await callback.answer()
    _, id_str = callback.data.split(":", 1)
    pollution_id = int(id_str)
    
    try:
        problem = await api_client.get_pollution_detail(pollution_id)
        
        if not problem:
            await callback.message.answer("⚠️ Работа не найдена.")
            return
        
        pollution_type = problem.get('pollution_type', 'Неизвестно')
        description = problem.get('description', '—') or '—'
        latitude = problem.get('latitude', 0)
        longitude = problem.get('longitude', 0)
        
        text = (
            f"📌 <b>Моя работа #{problem.get('id', '?')}</b>\n\n"
            f"📍 <b>Тип:</b> {pollution_type}\n"
            f"📝 <b>Описание:</b> {description}\n"
            f"📍 <b>Координаты:</b> {latitude}, {longitude}"
        )
        
        await callback.message.answer(text, reply_markup=work_actions_kb(problem.get('id', pollution_id)))
        
        if latitude and longitude:
            try:
                await callback.message.answer_location(
                    latitude=float(latitude),
                    longitude=float(longitude)
                )
            except Exception as loc_error:
                logger.warning(f"Ошибка отправки геолокации: {loc_error}")
        
    except Exception as e:
        logger.exception("Ошибка при получении деталей работы: %s", e)
        await callback.message.answer("⚠️ Ошибка получения деталей работы.")


@dp.callback_query(F.data.startswith("cancel_work:"))
async def cb_cancel_work(callback: CallbackQuery) -> None:
    await callback.answer()
    _, id_str = callback.data.split(":", 1)
    pollution_id = int(id_str)
    
    try:
        await api_client.unassign_pollution(callback.from_user.id, pollution_id)
        await callback.message.edit_text(f"❌ Вы отменили взятие работы #{pollution_id}.")
    except Exception as e:
        logger.exception("Ошибка при отмене работы: %s", e)
        await callback.message.answer("⚠️ Ошибка отмены работы.")


@dp.callback_query(F.data.startswith("complete_work:"))
async def cb_complete_work(callback: CallbackQuery, state: FSMContext) -> None:
    await callback.answer()
    _, id_str = callback.data.split(":", 1)
    pollution_id = int(id_str)
    
    await state.update_data(completing_work_id=pollution_id)
    await callback.message.answer(
        "📷 Отправьте фото завершенной работы или нажмите 'Пропустить' для завершения без фото:",
        reply_markup=ReplyKeyboardMarkup(
            keyboard=[
                [KeyboardButton(text="➡️ Пропустить")],
                [KeyboardButton(text="❌ Отмена")]
            ],
            resize_keyboard=True,
            one_time_keyboard=True
        )
    )


@dp.message(F.photo)
async def handle_completion_photo(message: Message, state: FSMContext) -> None:
    data = await state.get_data()
    pollution_id = data.get('completing_work_id')
    
    if not pollution_id:
        return
    
    try:
        photo = message.photo[-1]
        file = await bot.get_file(photo.file_id)
        photo_bytes = await bot.download_file(file.file_path)
        
        result = await api_client.complete_pollution(message.from_user.id, pollution_id, photo_bytes.read())
        
        # Уведомляем админов
        try:
            admin_data = await api_client.notify_admins(
                result.get('pollution_id'),
                result.get('user_id'),
                result.get('username'),
                result.get('has_photo', False)
            )
            
            for admin_telegram_id in admin_data.get('admin_telegram_ids', []):
                try:
                    await bot.send_message(admin_telegram_id, admin_data.get('message'))
                except Exception as send_error:
                    logger.warning(f"Ошибка отправки админу {admin_telegram_id}: {send_error}")
        except Exception as notify_error:
            logger.warning(f"Ошибка уведомления админов: {notify_error}")
        
        await state.clear()
        await message.answer(
            "✅ Заявка на завершение работы отправлена на проверку администрации.",
            reply_markup=main_menu_kb()
        )
    except Exception as e:
        logger.exception("Ошибка при завершении работы: %s", e)
        await state.clear()
        await message.answer("⚠️ Ошибка завершения работы.", reply_markup=main_menu_kb())


@dp.message(F.text == "➡️ Пропустить")
async def handle_completion_skip(message: Message, state: FSMContext) -> None:
    data = await state.get_data()
    pollution_id = data.get('completing_work_id')
    
    if not pollution_id:
        return
    
    try:
        result = await api_client.complete_pollution(message.from_user.id, pollution_id)
        
        # Уведомляем админов
        try:
            admin_data = await api_client.notify_admins(
                result.get('pollution_id'),
                result.get('user_id'),
                result.get('username'),
                result.get('has_photo', False)
            )
            
            for admin_telegram_id in admin_data.get('admin_telegram_ids', []):
                try:
                    await bot.send_message(admin_telegram_id, admin_data.get('message'))
                except Exception as send_error:
                    logger.warning(f"Ошибка отправки админу {admin_telegram_id}: {send_error}")
        except Exception as notify_error:
            logger.warning(f"Ошибка уведомления админов: {notify_error}")
        
        await state.clear()
        await message.answer(
            "✅ Заявка на завершение работы отправлена на проверку администрации.",
            reply_markup=main_menu_kb()
        )
    except Exception as e:
        logger.exception("Ошибка при завершении работы: %s", e)
        await state.clear()
        await message.answer("⚠️ Ошибка завершения работы.", reply_markup=main_menu_kb())


async def on_startup() -> None:
    from aiogram.types import BotCommand, MenuButtonWebApp, WebAppInfo
    
    # Устанавливаем команды бота
    await bot.set_my_commands([
        BotCommand(command="start", description="Главное меню"),
    ])
    
    # Устанавливаем кнопку меню с Web App
    await bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(
            text="Открыть карту",
            web_app=WebAppInfo(url="https://caspianguard.vercel.app")
        )
    )
    
    if webhook_config.use_webhook:
        if not webhook_config.webhook_url:
            raise RuntimeError("WEBHOOK_URL не задан, но USE_WEBHOOK=true")
        await bot.set_webhook(webhook_config.webhook_url)
        logger.info("Webhook установлен: %s", webhook_config.webhook_url)


async def on_shutdown() -> None:
    await bot.session.close()


async def run_polling() -> None:
    await on_startup()
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


