from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from main.models import Pollutions, PollutionType, PollutionImage
from PIL import Image
import io
from django.core.files.uploadedfile import InMemoryUploadedFile
from datetime import datetime, timedelta
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Создает тестовые данные загрязнений'

    def handle(self, *args, **kwargs):
        # Получаем или создаем тестового пользователя
        test_user, created = User.objects.get_or_create(
            username='test_user',
            defaults={
                'first_name': 'Тестовый',
                'last_name': 'Пользователь',
                'telegram_id': 123456789,
                'is_active': True
            }
        )
        if created:
            test_user.set_password('test123')
            test_user.save()
            self.stdout.write(self.style.SUCCESS('Создан тестовый пользователь'))

        # Получаем типы загрязнений
        pollution_types = list(PollutionType.objects.all())
        if not pollution_types:
            self.stdout.write(self.style.ERROR('Сначала создайте типы загрязнений: python manage.py types_faking'))
            return

        # Координаты вокруг Каспийского моря
        locations = [
            (43.123456, 51.654321, "Актау, Казахстан"),
            (42.856789, 47.123456, "Махачкала, Россия"),
            (40.345678, 50.987654, "Баку, Азербайджан"),
            (36.789012, 53.456789, "Энзели, Иран"),
            (41.234567, 52.345678, "Туркменбаши, Туркменистан"),
            (43.567890, 51.234567, "Форт-Шевченко, Казахстан"),
            (42.123456, 48.567890, "Дербент, Россия"),
            (40.567890, 50.123456, "Сумгаит, Азербайджан"),
            (37.123456, 54.234567, "Рамсар, Иран"),
            (41.567890, 52.789012, "Балканабат, Туркменистан"),
            (43.234567, 51.567890, "Жанаозен, Казахстан"),
            (42.567890, 47.789012, "Каспийск, Россия"),
            (40.789012, 50.567890, "Гянджа, Азербайджан"),
        ]

        descriptions = [
            "Обнаружено большое скопление пластикового мусора на берегу",
            "Нефтяное пятно в прибрежной зоне",
            "Химические отходы в воде",
            "Мертвая рыба на побережье",
            "Стеклянные бутылки и другой мусор",
            "Загрязнение воды неизвестным веществом",
            "Большое количество выброшенного мусора",
            "Пятно нефтепродуктов на поверхности воды",
            "Химический запах в прибрежной зоне",
            "Пластиковые отходы в большом количестве",
            "Загрязнение прибрежной полосы",
            "Подозрительное вещество в воде",
            "Мусор на пляже требует уборки",
        ]

        created_count = 0
        
        for i, (lat, lon, location_name) in enumerate(locations):
            # Создаем простое изображение
            img = Image.new('RGB', (800, 600), color=(70, 130, 180))
            img_io = io.BytesIO()
            img.save(img_io, format='JPEG')
            img_io.seek(0)
            
            image_file = InMemoryUploadedFile(
                img_io, None, f'test_image_{i}.jpg', 'image/jpeg', img_io.getbuffer().nbytes, None
            )
            
            # Создаем PollutionImage
            pollution_image = PollutionImage.objects.create(image=image_file)
            
            # Выбираем случайный тип загрязнения
            pollution_type = random.choice(pollution_types)
            
            # Создаем запись загрязнения
            pollution = Pollutions.objects.create(
                latitude=lat,
                longitude=lon,
                description=descriptions[i],
                pollution_type=pollution_type,
                reported_by=test_user,
                images=pollution_image,
                phone_number=f"+7{random.randint(7000000000, 7999999999)}" if i % 2 == 0 else None,
                is_approved=random.choice([True, False]),
                created_at=datetime.now() - timedelta(days=random.randint(0, 30))
            )
            
            created_count += 1
            self.stdout.write(f'Создано загрязнение #{pollution.id} - {location_name}')

        self.stdout.write(self.style.SUCCESS(f'Успешно создано {created_count} тестовых загрязнений'))