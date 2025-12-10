from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from services_api_client import ApiClient

def main_menu_kb() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(text="📤 Отправить проблему"),
                KeyboardButton(text="📋 Список объявлений"),
            ],
            [
                KeyboardButton(text="👤 Мой профиль"),
                KeyboardButton(text="📞 Связь с администрацией"),
            ],
            [
                KeyboardButton(text="🔗 Привязать аккаунт"),
            ]
        ],
        resize_keyboard=True,
    )


async def pollution_type() -> ReplyKeyboardMarkup:
    api_client = ApiClient()
    try:
        types = await api_client.get_pollution_types()
        problem_types = [pt['name'] for pt in types]
    except Exception:
        problem_types = ["Нефтяное загрязнение", "Мусор"]  # Fallback
    
    return ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text=type)] for type in problem_types],
        resize_keyboard=True,
    )


def cancel_kb() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="❌ Отмена")]],
        resize_keyboard=True,
    )


def location_keyboard() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📍 Отправить геолокацию", request_location=True)],
            [KeyboardButton(text="❌ Отмена")],
        ],
        resize_keyboard=True,
        one_time_keyboard=True
    )


def announcements_list_kb(problems: list, page: int, has_next: bool) -> InlineKeyboardMarkup:
    """Создать inline клавиатуру со списком объявлений"""
    buttons = []
    
    # Кнопки для каждого объявления
    for problem in problems:
        problem_id = problem.get('id')
        pollution_type = problem.get('pollution_type', 'Неизвестно')
        buttons.append([
            InlineKeyboardButton(
                text=f"📌 #{problem_id} - {pollution_type}",
                callback_data=f"ann_view:{problem_id}"
            )
        ])
    
    # Кнопки пагинации
    nav_buttons = []
    if page > 1:
        nav_buttons.append(InlineKeyboardButton(text="⬅️ Назад", callback_data=f"ann_page:{page-1}"))
    if has_next:
        nav_buttons.append(InlineKeyboardButton(text="➡️ Далее", callback_data=f"ann_page:{page+1}"))
    
    if nav_buttons:
        buttons.append(nav_buttons)
    
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def announcement_actions_kb(announcement_id: int) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="✅ Беру в работу",
                    callback_data=f"ann_take:{announcement_id}",
                )
            ]
        ]
    )


def send_number_kb():
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="📞 Поделиться номером", request_contact=True)],
            [KeyboardButton(text="➡️ Пропустить")],
            [KeyboardButton(text="❌ Отмена")],
        ],
        resize_keyboard=True,
        one_time_keyboard=True
    )


def profile_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="📋 Мои работы",
                    callback_data="my_works:1"
                )
            ]
        ]
    )


def my_works_kb(problems: list, page: int, has_next: bool) -> InlineKeyboardMarkup:
    buttons = []
    
    for problem in problems:
        problem_id = problem.get('id')
        pollution_type = problem.get('pollution_type', 'Неизвестно')
        buttons.append([
            InlineKeyboardButton(
                text=f"📌 #{problem_id} - {pollution_type}",
                callback_data=f"my_work_view:{problem_id}"
            )
        ])
    
    nav_buttons = []
    if page > 1:
        nav_buttons.append(InlineKeyboardButton(text="⬅️ Назад", callback_data=f"my_works:{page-1}"))
    if has_next:
        nav_buttons.append(InlineKeyboardButton(text="➡️ Далее", callback_data=f"my_works:{page+1}"))
    
    if nav_buttons:
        buttons.append(nav_buttons)
    
    return InlineKeyboardMarkup(inline_keyboard=buttons)


def work_actions_kb(work_id: int) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="✅ Завершить",
                    callback_data=f"complete_work:{work_id}"
                ),
                InlineKeyboardButton(
                    text="❌ Отменить",
                    callback_data=f"cancel_work:{work_id}"
                )
            ]
        ]
    )


def admin_review_kb(pollution_id: int, user_id: int) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="✅ Одобрить",
                    callback_data=f"approve_work:{pollution_id}:{user_id}"
                ),
                InlineKeyboardButton(
                    text="❌ Отклонить",
                    callback_data=f"reject_work:{pollution_id}:{user_id}"
                )
            ]
        ]
    )

def admin_reply_kb(message_id: int) -> InlineKeyboardMarkup:
    """Клавиатура для ответа админа на сообщение пользователя"""
    return InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="💬 Ответить", callback_data=f"admin_reply:{message_id}")]
    ])