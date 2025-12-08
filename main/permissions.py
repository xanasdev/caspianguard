from rest_framework.permissions import BasePermission


class IsVolunteerUser(BasePermission):
    def has_permission(self, request, view):
        try:
            return request.user.is_superuser or request.user.position.name == 'Волонтер'
        except Exception as e:
            print(e)
            return False
        

class IsManagerUser(BasePermission):
    def has_permission(self, request, view):
        try:
            return request.user.is_superuser or request.user.position.name == "Менеджер"
        except:
            return False