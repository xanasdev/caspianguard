from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from main.models import Pollutions, PollutionType, PollutionImage
from PIL import Image, ImageDraw, ImageFont
import io
from django.core.files.uploadedfile import InMemoryUploadedFile
from datetime import datetime, timedelta
import random
from faker import Faker

User = get_user_model()


class Command(BaseCommand):
    help = 'Создает тестовые данные загрязнений'

    def handle(self, *args, **kwargs):
        # Получаем типы загрязнений
        pollution_types = list(PollutionType.objects.all())
        if not pollution_types:
            self.stdout.write(self.style.ERROR('Сначала создайте типы загрязнений: python manage.py types_faking'))
            return

        # Координаты вокруг Махачкалы и городского пляжа
        locations = [
            (42.9849, 47.5047, "Городской пляж Махачкалы"),
            (42.9812, 47.5123, "Набережная Махачкалы"),
            (42.9876, 47.5089, "Пляж у Каспийска"),
            (42.9923, 47.5156, "Северный пляж"),
            (42.9789, 47.4998, "Южный пляж"),
            (42.9834, 47.5067, "Центральный пляж"),
            (42.9901, 47.5134, "Пляж Турали"),
            (42.9756, 47.4956, "Пляж Манас"),
            (42.9867, 47.5101, "Пляж Каспий"),
            (42.9945, 47.5178, "Пляж Дагестан"),
            (42.9723, 47.4923, "Пляж Шамхал"),
            (42.9889, 47.5112, "Пляж Ленинкент"),
            (42.9801, 47.5034, "Пляж Альбатрос"),
        ]

        fake = Faker('ru_RU')
        
        pollution_templates = [
            "Обнаружено {}",
            "{} на пляже",
            "Загрязнение: {}",
            "Требуется уборка: {}",
        ]
        
        pollution_objects = [
            "пластиковые бутылки",
            "нефтяное пятно",
            "бытовой мусор",
            "строительные отходы",
            "пластиковые пакеты",
            "стеклянные осколки",
            "химические отходы",
            "металлический лом",
        ]

        created_count = 0
        colors = [(70, 130, 180), (100, 150, 200), (50, 100, 150), (80, 120, 160)]
        
        for i, (lat, lon, location_name) in enumerate(locations):
            # Создаем изображение с текстом
            img = Image.new('RGB', (800, 600), color=random.choice(colors))
            draw = ImageDraw.Draw(img)
            try:
                font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
            except:
                font = ImageFont.load_default()
            draw.text((50, 250), f"{location_name}", fill=(255, 255, 255), font=font)
            
            img_io = io.BytesIO()
            img.save(img_io, format='JPEG')
            img_io.seek(0)
            
            image_file = InMemoryUploadedFile(
                img_io, None, f'pollution_{i}.jpg', 'image/jpeg', img_io.getbuffer().nbytes, None
            )
            
            pollution_image = PollutionImage.objects.create(image=image_file)
            pollution_type = random.choice(pollution_types)
            
            # Генерируем описание
            template = random.choice(pollution_templates)
            obj = random.choice(pollution_objects)
            description = template.format(obj)
            
            pollution = Pollutions.objects.create(
                latitude=lat,
                longitude=lon,
                description=description,
                pollution_type=pollution_type,
                reported_by=None,
                images=pollution_image,
                phone_number=fake.phone_number() if random.choice([True, False]) else None,
                is_approved=random.choice([True, False]),
                created_at=datetime.now() - timedelta(days=random.randint(0, 30))
            )
            
            created_count += 1
            self.stdout.write(f'Создано загрязнение #{pollution.id} - {location_name}')

        self.stdout.write(self.style.SUCCESS(f'Успешно создано {created_count} тестовых загрязнений'))