from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton


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
                KeyboardButton(text="🔗 Привязать аккаунт")
            ]
        ],
        resize_keyboard=True,
    )


def pollution_type() -> ReplyKeyboardMarkup:
    problem_types = ["Нефтяное загрязнение", "Мусор"] # Будет API запрос на получение ~6 типов загрязнений

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


def announcements_pagination_kb(page: int, has_next: bool) -> InlineKeyboardMarkup:
    buttons = []
    if page > 1:
        buttons.append(InlineKeyboardButton(text="⬅️ Назад", callback_data=f"ann_page:{page-1}"))
    if has_next:
        buttons.append(InlineKeyboardButton(text="➡️ Далее", callback_data=f"ann_page:{page+1}"))
    return InlineKeyboardMarkup(inline_keyboard=[buttons]) if buttons else InlineKeyboardMarkup(inline_keyboard=[])


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


