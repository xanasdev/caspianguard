.PHONY: help install-backend install-bot install-frontend run-backend run-bot run-frontend clean-backend clean-bot clean-frontend install run clean migrate-backend createsuperuser fake-pollutions db-up db-down db-restart db-logs db-reset

# Определение Python команды и путей (поддержка разных систем)
PYTHON := python3
ifeq ($(OS),Windows_NT)
	PYTHON := python
	VENV_BACKEND := backend_venv
	VENV_BOT := bot/bot_venv
	VENV_BIN := Scripts
	RM := rmdir /s /q
	MKDIR := if not exist
else
	VENV_BACKEND := backend_venv
	VENV_BOT := bot/bot_venv
	VENV_BIN := bin
	RM := rm -rf
	MKDIR := test ! -d
endif

help: ## Показать справку по командам
	@echo "Доступные команды:"
	@echo "  make install-backend  - Установить виртуальное окружение и зависимости для бекенда"
	@echo "  make install-bot      - Установить виртуальное окружение и зависимости для бота"
	@echo "  make install-frontend - Установить зависимости для фронтенда (npm)"
	@echo "  make install          - Установить все окружения (бекенд, бот, фронтенд)"
	@echo "  make migrate-backend  - Выполнить миграции базы данных (требует запущенной БД)"
	@echo "  make createsuperuser  - Создать суперпользователя Django (для доступа к админке)"
	@echo "  make fake-pollutions  - Создать тестовые данные загрязнений (13 записей)"
	@echo "  make run-backend      - Запустить Django сервер"
	@echo "  make run-bot          - Запустить Telegram бота"
	@echo "  make run-frontend     - Запустить Next.js dev сервер"
	@echo "  make clean-backend    - Удалить виртуальное окружение бекенда"
	@echo "  make clean-bot        - Удалить виртуальное окружение бота"
	@echo "  make clean-frontend   - Удалить node_modules фронтенда"
	@echo "  make clean            - Удалить все окружения"
	@echo ""
	@echo "Команды для базы данных (Docker Compose):"
	@echo "  make db-up            - Запустить PostgreSQL в Docker"
	@echo "  make db-down          - Остановить PostgreSQL"
	@echo "  make db-restart       - Перезапустить PostgreSQL"
	@echo "  make db-logs          - Показать логи PostgreSQL"
	@echo "  make db-reset         - Остановить и удалить данные PostgreSQL"

install-backend: ## Установить виртуальное окружение и зависимости для бекенда
	@echo "Установка виртуального окружения для бекенда..."
ifeq ($(OS),Windows_NT)
	@if not exist "$(VENV_BACKEND)" $(PYTHON) -m venv $(VENV_BACKEND)
else
	@test ! -d "$(VENV_BACKEND)" && $(PYTHON) -m venv $(VENV_BACKEND) || true
endif
	@echo "Установка зависимостей..."
	@$(VENV_BACKEND)/$(VENV_BIN)/python -m pip install --upgrade pip
	@$(VENV_BACKEND)/$(VENV_BIN)/pip install -r requirements.txt
	@echo "Бекенд готов к запуску!"
	@echo "Примечание: Для выполнения миграций используйте: make migrate-backend"

install-bot: ## Установить виртуальное окружение и зависимости для бота
	@echo "Установка виртуального окружения для бота..."
ifeq ($(OS),Windows_NT)
	@if not exist "$(VENV_BOT)" $(PYTHON) -m venv $(VENV_BOT)
else
	@test ! -d "$(VENV_BOT)" && $(PYTHON) -m venv $(VENV_BOT) || true
endif
	@echo "Установка зависимостей..."
	@$(VENV_BOT)/$(VENV_BIN)/python -m pip install --upgrade pip
	@$(VENV_BOT)/$(VENV_BIN)/pip install -r bot/req.txt
	@echo "Бот готов к запуску!"

install-frontend: ## Установить зависимости для фронтенда
	@echo "Установка зависимостей фронтенда..."
	@cd frontend && npm install --legacy-peer-deps
	@echo "Фронтенд готов к запуску!"
	@echo "Примечание: Убедитесь, что файл frontend/.env настроен правильно"

install: install-backend install-bot install-frontend ## Установить все окружения

migrate-backend: ## Выполнить миграции базы данных
ifeq ($(OS),Windows_NT)
	@if not exist "$(VENV_BACKEND)" (echo "Виртуальное окружение не найдено. Запустите: make install-backend" && exit /b 1)
else
	@test -d "$(VENV_BACKEND)" || (echo "Виртуальное окружение не найдено. Запустите: make install-backend" && exit 1)
endif
	@echo "Выполнение миграций..."
	@$(VENV_BACKEND)/$(VENV_BIN)/python manage.py migrate

createsuperuser: ## Создать суперпользователя Django
ifeq ($(OS),Windows_NT)
	@if not exist "$(VENV_BACKEND)" (echo "Виртуальное окружение не найдено. Запустите: make install-backend" && exit /b 1)
else
	@test -d "$(VENV_BACKEND)" || (echo "Виртуальное окружение не найдено. Запустите: make install-backend" && exit 1)
endif
	@echo "Создание суперпользователя..."
	@$(VENV_BACKEND)/$(VENV_BIN)/python manage.py createsuperuser

fake-pollutions: ## Создать тестовые данные загрязнений
ifeq ($(OS),Windows_NT)
	@if not exist "$(VENV_BACKEND)" (echo "Виртуальное окружение не найдено. Запустите: make install-backend" && exit /b 1)
else
	@test -d "$(VENV_BACKEND)" || (echo "Виртуальное окружение не найдено. Запустите: make install-backend" && exit 1)
endif
	@echo "Создание тестовых данных загрязнений..."
	@$(VENV_BACKEND)/$(VENV_BIN)/python manage.py pollutions_faking

run-backend: ## Запустить Django сервер
ifeq ($(OS),Windows_NT)
	@if not exist "$(VENV_BACKEND)" (echo "Виртуальное окружение не найдено. Запустите: make install-backend" && exit /b 1)
else
	@test -d "$(VENV_BACKEND)" || (echo "Виртуальное окружение не найдено. Запустите: make install-backend" && exit 1)
endif
	@echo "Запуск Django сервера..."
	@$(VENV_BACKEND)/$(VENV_BIN)/python manage.py runserver

run-bot: ## Запустить Telegram бота
ifeq ($(OS),Windows_NT)
	@if not exist "$(VENV_BOT)" (echo "Виртуальное окружение не найдено. Запустите: make install-bot" && exit /b 1)
else
	@test -d "$(VENV_BOT)" || (echo "Виртуальное окружение не найдено. Запустите: make install-bot" && exit 1)
endif
	@echo "Запуск Telegram бота..."
	@$(VENV_BOT)/$(VENV_BIN)/python bot/main.py

run-frontend: ## Запустить Next.js dev сервер
	@echo "Запуск Next.js сервера..."
	@cd frontend && npm run dev

clean-backend: ## Удалить виртуальное окружение бекенда
	@echo "Удаление виртуального окружения бекенда..."
ifeq ($(OS),Windows_NT)
	@if exist "$(VENV_BACKEND)" rmdir /s /q "$(VENV_BACKEND)"
else
	@$(RM) $(VENV_BACKEND)
endif
	@echo "Виртуальное окружение бекенда удалено"

clean-bot: ## Удалить виртуальное окружение бота
	@echo "Удаление виртуального окружения бота..."
ifeq ($(OS),Windows_NT)
	@if exist "$(VENV_BOT)" rmdir /s /q "$(VENV_BOT)"
else
	@$(RM) $(VENV_BOT)
endif
	@echo "Виртуальное окружение бота удалено"

clean-frontend: ## Удалить node_modules фронтенда
	@echo "Удаление node_modules фронтенда..."
ifeq ($(OS),Windows_NT)
	@if exist "frontend\node_modules" rmdir /s /q "frontend\node_modules"
	@if exist "frontend\.next" rmdir /s /q "frontend\.next"
else
	@$(RM) frontend/node_modules
	@$(RM) frontend/.next
endif
	@echo "node_modules фронтенда удалены"

clean: clean-backend clean-bot clean-frontend ## Удалить все окружения

db-up: ## Запустить PostgreSQL в Docker
	@echo "Запуск PostgreSQL..."
	@docker-compose up -d postgres
	@echo "PostgreSQL запущен. Ожидание готовности..."
ifeq ($(OS),Windows_NT)
	@timeout /t 5 >nul 2>&1
else
	@sleep 5
endif
	@echo "База данных готова к использованию!"

db-down: ## Остановить PostgreSQL
	@echo "Остановка PostgreSQL..."
	@docker-compose stop postgres
	@echo "PostgreSQL остановлен"

db-restart: ## Перезапустить PostgreSQL
	@echo "Перезапуск PostgreSQL..."
	@docker-compose restart postgres
	@echo "PostgreSQL перезапущен"

db-logs: ## Показать логи PostgreSQL
	@docker-compose logs -f postgres

db-reset: ## Остановить и удалить данные PostgreSQL
	@echo "Остановка и удаление данных PostgreSQL..."
	@docker-compose down -v postgres
	@echo "Данные PostgreSQL удалены"
