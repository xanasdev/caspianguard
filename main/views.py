from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import RegisterSerializer, PollutionSerializer, PollutionTypeSerializer
from .models import Pollutions, PollutionType
from .permissions import *
from .authentication import TelegramAuthentication


@method_decorator(csrf_exempt, name='dispatch')
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


@method_decorator(csrf_exempt, name='dispatch')
class LinkTelegramView(APIView):
    authentication_classes = []
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


class PollutionPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


@method_decorator(csrf_exempt, name='dispatch')
class PollutionListCreateView(generics.ListCreateAPIView):
    queryset = Pollutions.objects.all().order_by('-created_at')
    serializer_class = PollutionSerializer
    authentication_classes = [TelegramAuthentication]
    pagination_class = PollutionPagination

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

@method_decorator(csrf_exempt, name='dispatch')
class PollutionTypeListView(generics.ListAPIView):
    queryset = PollutionType.objects.all().order_by('name')
    serializer_class = PollutionTypeSerializer
    permission_classes = [permissions.AllowAny]

@method_decorator(csrf_exempt, name='dispatch')
class PollutionDetailView(generics.RetrieveAPIView):
    queryset = Pollutions.objects.all()
    serializer_class = PollutionSerializer
    permission_classes = [permissions.AllowAny]

@method_decorator(csrf_exempt, name='dispatch')
class AssignPollutionView(APIView):
    authentication_classes = [TelegramAuthentication]
    permission_classes = [CanAssignPollution]

    def post(self, request, pk):
        try:
            pollution = Pollutions.objects.get(pk=pk)
            pollution.assigned_to.add(request.user)
            return Response({'success': 'Вы взяли проблему в работу'}, status=status.HTTP_200_OK)
        except Pollutions.DoesNotExist:
            return Response({'error': 'Проблема не найдена'}, status=status.HTTP_404_NOT_FOUND)


@method_decorator(csrf_exempt, name='dispatch')
class UserProfileView(APIView):
    authentication_classes = [TelegramAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        position_name = user.position.name if user.position else 'Не указана'
        
        return Response({
            'username': user.username,
            'telegram_username': f'@{user.username}' if user.username else 'Не указан',
            'first_name': user.first_name or '',
            'last_name': user.last_name or '',
            'position': position_name,
            'completed_count': user.completed_count,
        }, status=status.HTTP_200_OK)


class UserPollutionsPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'
    max_page_size = 10


@method_decorator(csrf_exempt, name='dispatch')
class UserAssignedPollutionsView(generics.ListAPIView):
    serializer_class = PollutionSerializer
    authentication_classes = [TelegramAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = UserPollutionsPagination

    def get_queryset(self):
        return Pollutions.objects.filter(assigned_to=self.request.user, is_completed=False).order_by('-created_at')


@method_decorator(csrf_exempt, name='dispatch')
class UnassignPollutionView(APIView):
    authentication_classes = [TelegramAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            pollution = Pollutions.objects.get(pk=pk)
            if request.user in pollution.assigned_to.all():
                pollution.assigned_to.remove(request.user)
                return Response({'success': 'Вы отменили взятие проблемы'}, status=status.HTTP_200_OK)
            return Response({'error': 'Вы не брали эту проблему'}, status=status.HTTP_400_BAD_REQUEST)
        except Pollutions.DoesNotExist:
            return Response({'error': 'Проблема не найдена'}, status=status.HTTP_404_NOT_FOUND)


@method_decorator(csrf_exempt, name='dispatch')
class CompletePollutionView(APIView):
    authentication_classes = [TelegramAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            pollution = Pollutions.objects.get(pk=pk)
            if request.user not in pollution.assigned_to.all():
                return Response({'error': 'Вы не брали эту проблему'}, status=status.HTTP_400_BAD_REQUEST)
            
            completion_photo = request.FILES.get('completion_photo')
            if completion_photo:
                pollution.completion_photo = completion_photo
            
            pollution.is_completed = True
            pollution.completed_by = request.user
            pollution.save()
            
            return Response({
                'success': 'Заявка на завершение отправлена',
                'has_photo': bool(completion_photo)
            }, status=status.HTTP_200_OK)
        except Pollutions.DoesNotExist:
            return Response({'error': 'Проблема не найдена'}, status=status.HTTP_404_NOT_FOUND)