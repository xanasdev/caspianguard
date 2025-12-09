from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model

User = get_user_model()


class TelegramAuthentication(BaseAuthentication):
    def authenticate(self, request):
        telegram_id = request.data.get('telegram_id') or request.query_params.get('telegram_id')
        
        if not telegram_id:
            return None
        
        try:
            user = User.objects.get(telegram_id=telegram_id)
            return (user, None)
        except User.DoesNotExist:
            raise AuthenticationFailed('Необходимо авторизоваться. Используйте "🔗 Привязать аккаунт" для привязки аккаунта.')
