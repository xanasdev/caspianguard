from django.contrib.auth.models import AbstractUser
from django.db import models


class Position(models.Model):
    name = models.CharField(max_length=100, unique=True)
    permissions = models.JSONField(default=list)

    class Meta:
        verbose_name = 'Должность'
        verbose_name_plural = 'Должности'

    def __str__(self):
        return self.name


class User(AbstractUser):
    telegram_id = models.BigIntegerField(unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    position = models.ForeignKey(Position, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
