from main.models import PollutionType
from django.core.management.base import BaseCommand

types = ['Нефтяные отходы', 'Химические вещества', 'Большое скопление мусора', "Большая мертвая рыба"]

class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        for t in types:
            if PollutionType.objects.filter(name=t).exists():
                continue
            else:
                PollutionType.objects.create(name=t)
        
        self.stdout.write(self.style.SUCCESS(f'Успешно созданы типы загрязнений'))