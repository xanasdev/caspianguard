from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from .permissions import *


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class LinkTelegramView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        telegram_id = request.data.get('telegram_id')

        if not username or not password or not telegram_id:
            return Response({'error': 'Необходимо указать username, password и telegram_id'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response({'error': 'Неверный логин или пароль'}, status=status.HTTP_401_UNAUTHORIZED)

        user.telegram_id = telegram_id
        user.save()

        return Response({'success': 'Telegram аккаунт успешно привязан'}, status=status.HTTP_200_OK)
