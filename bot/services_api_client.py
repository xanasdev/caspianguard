from __future__ import annotations

from typing import Any, Dict, Optional

import aiohttp

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
        self.base_url = f"{raw_base}/api"

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
                resp.raise_for_status()
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

        print(req)

        return req

    async def get_user_info(self) -> Dict[str, Any]:
        return await self._request("GET", "/auth/profile/")

    async def list_markers(self, page: int = 1, page_size: int = 5) -> Any:
        # Как в frontend: передаем query params через params, а не в URL
        params = {"page": page, "page_size": page_size} if page or page_size else {}
        raw = await self._request("GET", "/markers/", params=params)

        # Нормализуем ответ под формат, удобный боту:
        # - если backend вернул список (как в frontend), превращаем в dict с items + total
        # - если вернул paginated dict (DRF pagination), вытаскиваем results/count
        if isinstance(raw, list):
            return {"items": raw, "total": len(raw)}

        results = raw.get("results") or raw.get("items") or []
        total = raw.get("count", raw.get("total", len(results)))
        return {"items": results, "total": total}

    async def create_problem(
        self,
        user_id: int,
        photo_file_id: str,
        problem_type: str,
        description: str,
        latitude: float,
        longitude: float,
        phone: str | None,
    ) -> Dict[str, Any]:
        # Как в frontend: используем pollution_type_name (строка)
        payload: Dict[str, Any] = {
            "latitude": str(latitude),
            "longitude": str(longitude),
            "description": description,
            "pollution_type_name": problem_type,
        }
        return await self._request("POST", "/markers/", json=payload)

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

    async def take_problem(self, user_id: int, problem_id: int) -> Dict[str, Any]:
        # Как в frontend: PATCH с JSON payload
        return await self._request(
            "PATCH",
            f"/markers/{problem_id}/",
            json={"status": "in_progress"},
        )

    async def list_problems(self, page: int = 1, page_size: int = 5) -> Dict[str, Any]:
        return await self.list_markers(page=page, page_size=page_size)


