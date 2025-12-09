from main.models import Position
from django.core.management.base import BaseCommand

positions = ['Волонтер', 'Житель', 'Менеджер', 'Администратор']

class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        count = 0

        for pos in positions:
            if Position.objects.filter(name=pos).exists():
                continue
            else:
                count += 1
                Position.objects.create(name=pos, permissions=[])

        self.stdout.write(self.style.SUCCESS(f'Успешно {count} должностей'))