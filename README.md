## Каспийский страж — монорепа (бот + backend)

В этом репозитории два сервиса:
- `bot/` — телеграм‑бот на aiogram.
- Django + DRF backend в корне проекта.

### Структура

- `bot/` — код бота, свой `req.txt`.
- `main/` — Django приложение с моделями и API.
- `caspianguard/` — настройки Django проекта.
- `requirements.txt` — зависимости для Django backend.
- `Makefile` — единый файл для управления установкой и запуском обоих сервисов.

### Быстрый старт

Из корня репозитория:

```bash
# Установить оба окружения
make install

# Или установить по отдельности
make install-backend  # Установить виртуальное окружение и зависимости для бекенда
make install-bot      # Установить виртуальное окружение и зависимости для бота
```

### Бот: установка и запуск

Перед запуском создайте `bot/.env` на основе `bot/env.example`:

```bash
# Установка (из корня репозитория)
make install-bot

# Запуск
make run-bot
```

### Backend: установка и запуск

```bash
# Установка (из корня репозитория)
make install-backend  # Создаст виртуальное окружение, установит зависимости и выполнит миграции

# Запуск
make run-backend      # Запустит Django сервер на http://127.0.0.1:8000
```

При необходимости создайте суперпользователя:

```bash
# Активируйте виртуальное окружение и выполните команду
backend_venv/Scripts/python manage.py createsuperuser  # Windows
# или
backend_venv/bin/python manage.py createsuperuser     # Linux/Mac
```

### Совместный запуск бота и backend

1. Убедитесь, что backend запущен на `http://localhost:8000`:

```bash
make run-backend
```

2. Убедитесь, что в `bot/.env` переменная `API_BASE_URL` либо не задана, либо равна `http://localhost:8000` (по умолчанию берётся из `bot/config.py`).

3. Запустите бота в отдельном терминале:

```bash
make run-bot
```

Теперь бот будет обращаться к API backend по адресу `http://localhost:8000/api/...`.

### Доступные команды Makefile

```bash
make help            # Показать справку по командам
make install-backend # Установить виртуальное окружение и зависимости для бекенда
make install-bot     # Установить виртуальное окружение и зависимости для бота
make install         # Установить оба окружения
make run-backend     # Запустить Django сервер
make run-bot         # Запустить Telegram бота
make clean-backend   # Удалить виртуальное окружение бекенда
make clean-bot       # Удалить виртуальное окружение бота
make clean           # Удалить все виртуальные окружения
```

### API эндпоинты

- `GET /api/pollutions/` — список загрязнений (с пагинацией)
- `POST /api/pollutions/` — создать новое загрязнение (требует аутентификации)
- `GET /api/pollution-types/` — список всех типов загрязнений
- `POST /api/auth/register/` — регистрация пользователя
- `POST /api/auth/login/` — получение JWT токена
- `POST /api/auth/link-telegram/` — привязка Telegram аккаунта

