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
    completed_count = models.IntegerField(default=0, verbose_name='Количество завершенных работ')

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'


class PollutionType(models.Model):
    name = models.CharField(max_length=60, unique=True)
    
    class Meta:
        verbose_name = "Тип загрязнения"
        verbose_name_plural = "Типы загрязнения"

    def __str__(self):
        return self.name
    

class PollutionImage(models.Model):
    image = models.ImageField(upload_to='pollution_images/', verbose_name='Изображение')

    class Meta:
        verbose_name = 'Изображение загрязнения'
        verbose_name_plural = 'Изображения загрязнения'
    
    def __str__(self):
        return self.image.name


class Pollutions(models.Model):
    latitude = models.FloatField(verbose_name='Широта')
    longitude = models.FloatField(verbose_name='Долгота')
    description = models.TextField(verbose_name='Описание')
    pollution_type = models.ForeignKey(PollutionType, on_delete=models.PROTECT, related_name='pollutions', verbose_name='Тип загрязнения')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата и время создания')
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_pollutions', verbose_name='Автор сообщения', null=True, blank=True)
    is_approved = models.BooleanField(default=False, verbose_name='Одобрено')
    images = models.ForeignKey(PollutionImage, related_name='pollutions', verbose_name='Изображения', on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, verbose_name='Номер телефона автора', null=True, blank=True)
    assigned_to = models.ManyToManyField(User, related_name='assigned_pollutions', verbose_name='Взято в работу', blank=True)
    is_completed = models.BooleanField(default=False, verbose_name='Завершено')
    completion_photo = models.ImageField(upload_to='completion_photos/', null=True, blank=True, verbose_name='Фото завершения')
    completed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='completed_pollutions', verbose_name='Завершил')

    class Meta:
        verbose_name = 'Сообщение о загрязнении'
        verbose_name_plural = 'Сообщения о загрязнении'

    def __str__(self):
        return f'Загрязнение {self.pollution_type.name} на ({self.latitude}, {self.longitude})'


class AdminMessage(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_admin_messages', verbose_name='От пользователя')
    message = models.TextField(verbose_name='Сообщение')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    is_answered = models.BooleanField(default=False, verbose_name='Отвечено')
    
    class Meta:
        verbose_name = 'Сообщение администрации'
        verbose_name_plural = 'Сообщения администрации'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'Сообщение от {self.from_user.username}: {self.message[:50]}...'