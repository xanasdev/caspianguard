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

class CanAssignPollution(BasePermission):
    message = 'У вас нет прав для взятия проблемы в работу. Требуется роль: Волонтер, Менеджер или Админ.'
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            self.message = 'Необходимо авторизоваться для взятия проблемы в работу.'
            return False
        if request.user.is_superuser or request.user.is_staff:
            return True
        try:
            has_access = request.user.position and request.user.position.name in ['Волонтер', 'Менеджер', 'Админ']
            if not has_access:
                self.message = 'У вас нет прав для взятия проблемы в работу. Требуется роль: Волонтер, Менеджер или Админ.'
            return has_access
        except:
            return False