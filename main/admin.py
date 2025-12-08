from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Position


class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Дополнительно', {'fields': ('telegram_id', 'position')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Дополнительно', {'fields': ('telegram_id', 'position')}),
    )


admin.site.register(User, UserAdmin)
admin.site.register(Position)
