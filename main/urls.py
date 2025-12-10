from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, LinkTelegramView, PollutionListCreateView, PollutionTypeListView, PollutionDetailView, AssignPollutionView, UserProfileView, UserAssignedPollutionsView, UnassignPollutionView, CompletePollutionView, NotifyAdminsView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/link-telegram/', LinkTelegramView.as_view(), name='link_telegram'),
    path('pollutions/', PollutionListCreateView.as_view(), name='pollution_list_create'),
    path('pollutions/<int:pk>/', PollutionDetailView.as_view(), name='pollution_detail'),
    path('pollutions/<int:pk>/assign/', AssignPollutionView.as_view(), name='pollution_assign'),
    path('pollutions/<int:pk>/unassign/', UnassignPollutionView.as_view(), name='pollution_unassign'),
    path('pollutions/<int:pk>/complete/', CompletePollutionView.as_view(), name='pollution_complete'),
    path('pollution-types/', PollutionTypeListView.as_view(), name='pollution_type_list'),
    path('user/profile/', UserProfileView.as_view(), name='user_profile'),
    path('user/assigned-pollutions/', UserAssignedPollutionsView.as_view(), name='user_assigned_pollutions'),
    path('notify-admins/', NotifyAdminsView.as_view(), name='notify_admins'),
]
