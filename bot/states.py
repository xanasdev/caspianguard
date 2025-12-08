from aiogram.fsm.state import StatesGroup, State


class ReportProblemState(StatesGroup):
    waiting_for_photo = State()
    waiting_for_type = State()
    waiting_for_description = State()
    waiting_for_location = State()
    waiting_for_phone = State()


class AdminChatState(StatesGroup):
    waiting_for_message = State()


class LinkTelegramState(StatesGroup):
    login = State()
    password = State()

