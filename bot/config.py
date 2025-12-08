import os
from dataclasses import dataclass
from typing import Optional

from dotenv import load_dotenv


load_dotenv()


@dataclass
class WebhookConfig:
    use_webhook: bool = os.getenv("USE_WEBHOOK", "false").lower() == "true"
    webhook_url: Optional[str] = os.getenv("WEBHOOK_URL")
    webapp_host: str = os.getenv("WEBAPP_HOST", "0.0.0.0")
    webapp_port: int = int(os.getenv("WEBAPP_PORT", "8000"))


@dataclass
class BotConfig:
    token: str = os.getenv("BOT_TOKEN", "")
    api_base_url: str = os.getenv("API_BASE_URL", "http://localhost:8000")


webhook_config = WebhookConfig()
bot_config = BotConfig()


