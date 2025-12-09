import asyncio
from services_api_client import ApiClient

api_client = ApiClient()

async def main():
    result = await api_client.list_markers()
    print(result)

if __name__ == "__main__":
    asyncio.run(main())