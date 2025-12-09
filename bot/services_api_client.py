from __future__ import annotations

from typing import Any, Dict, Optional
from urllib.parse import urlparse, urlunparse

import aiohttp
import uuid

from config import bot_config


class ApiClient:
    """
    Простой клиент для обращения к внешнему API.
    Здесь только заглушки под реальные вызовы.
    """

    def __init__(self, base_url: str | None = None) -> None:
        # Ожидаем, что base_url / API_BASE_URL указывает на корень backend,
        # например: http://localhost:8000
        # Добавляем /api в конец, как в frontend
        raw_base = (base_url or bot_config.api_base_url.rstrip("/"))
        
        # Автоматически добавляем протокол, если его нет
        if raw_base and not raw_base.startswith(("http://", "https://")):
            raw_base = f"http://{raw_base}"
        
        # Парсим URL для правильной обработки порта
        parsed = urlparse(raw_base)
        
        # Если порт не указан и это localhost/127.0.0.1, добавляем порт 8000
        if not parsed.port and parsed.hostname in ("localhost", "127.0.0.1"):
            parsed = parsed._replace(netloc=f"{parsed.hostname}:8000")
            raw_base = urlunparse(parsed)
        
        self.base_url = f"{raw_base}/api"

    async def get_pollution_types(self) -> list[Dict[str, Any]]:
        """Получить список всех типов загрязнений"""
        return await self._request("GET", "/pollution-types/")

    async def _request(
        self, 
        method: str, 
        path: str, 
        json: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Any:
        url = f"{self.base_url}/{path.lstrip('/')}"
        async with aiohttp.ClientSession() as session:
            async with session.request(method, url, json=json, params=params) as resp:
                if resp.status >= 400:
                    # Получаем детали ошибки перед raise_for_status
                    error_data = {}
                    try:
                        if resp.content_type and "application/json" in resp.content_type:
                            error_data = await resp.json()
                        else:
                            error_text = await resp.text()
                            error_data = {"error": error_text}
                    except Exception as parse_error:
                        error_data = {"error": f"HTTP {resp.status}", "parse_error": str(parse_error)}
                    
                    # Вызываем raise_for_status, но сначала сохраняем детали ошибки
                    try:
                        resp.raise_for_status()
                    except aiohttp.ClientResponseError as e:
                        # Добавляем детали ошибки к исключению
                        e.error_data = error_data
                        raise
                
                # Если статус OK, возвращаем данные
                if resp.content_type and "application/json" in resp.content_type:
                    return await resp.json()
                return await resp.text()
                
                if resp.content_type and "application/json" in resp.content_type:
                    return await resp.json()
                return await resp.text()

    async def register_user(self, username: str, password: str | None = None, telegram_id: int | None = None) -> Dict[str, Any]:
        payload: Dict[str, Any] = {
            "username": username,
            "password": password,
            "telegram_id": telegram_id
        }

        req = await self._request("POST", "/auth/link-telegram/", json=payload)

        return req

    async def get_user_info(self) -> Dict[str, Any]:
        return await self._request("GET", "/auth/profile/")

    async def list_markers(self, page: int = 1, page_size: int = 5) -> Any:
        params = {"page": page, "page_size": page_size}
        raw = await self._request("GET", "/pollutions/", params=params)
        return raw  # Возвращаем весь объект с пагинацией


    async def create_problem(
        self,
        telegram_id: int,
        photo_bytes: bytes,
        latitude: float,
        longitude: float,
        pollution_type: str,
        description: str,
        phone: str | None,
    ) -> Dict[str, Any]:
        url = f"{self.base_url}/pollutions/"
        fake_uuid = uuid.uuid4()
        
        data = aiohttp.FormData()
        data.add_field('telegram_id', str(telegram_id))
        data.add_field('latitude', str(latitude))
        data.add_field('longitude', str(longitude))
        data.add_field('description', description)
        data.add_field('pollution_type', pollution_type)
        if phone:
            data.add_field('phone_number', phone)
        data.add_field('image', photo_bytes, filename=f'photo_{str(fake_uuid)}.jpg', content_type='image/jpeg')
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=data) as resp:
                resp.raise_for_status()
                print(resp.status)
                print(resp.json())
                return await resp.json()

    async def get_marker_comments(self, marker_id: int) -> Any:
        return await self._request("GET", f"/markers/{marker_id}/comments/")

    async def add_marker_comment(self, marker_id: int, message: str) -> Any:
        return await self._request(
            "POST",
            f"/markers/{marker_id}/comments/",
            json={"message": message},
        )

    async def status_stats(self) -> Any:
        return await self._request("GET", "/markers/status-stats/")

    async def take_problem(self, telegram_id: int, problem_id: int) -> Dict[str, Any]:
        return await self._request(
            "POST",
            f"/pollutions/{problem_id}/assign/",
            json={"telegram_id": telegram_id},
        )

    async def list_problems(self, page: int = 1, page_size: int = 5) -> Dict[str, Any]:
        return await self.list_markers(page=page, page_size=page_size)

    async def get_pollution_detail(self, pollution_id: int) -> Dict[str, Any]:
        """Получить детальную информацию об одном загрязнении"""
        return await self._request("GET", f"/pollutions/{pollution_id}/")


