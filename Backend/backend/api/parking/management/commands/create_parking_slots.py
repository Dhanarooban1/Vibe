from django.core.management.base import BaseCommand
from api.models import ParkingSlot

class Command(BaseCommand):
    help = 'Creates initial parking slots in the database'

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, default=10, help='Number of parking slots to create')

    def handle(self, *args, **options):
        count = options['count']
        slot_types = ['regular', 'premium', 'disabled', 'electric']
        
        # Create the parking slots
        for i in range(1, count + 1):
            # Distribute types evenly
            slot_type = slot_types[(i - 1) % len(slot_types)]
            
            # Check if slot already exists
            if not ParkingSlot.objects.filter(number=f'P{i}').exists():
                ParkingSlot.objects.create(
                    number=f'P{i}',
                    parking_type=slot_type,
                    is_available=True
                )
                self.stdout.write(self.style.SUCCESS(f'Created parking slot P{i} ({slot_type})'))
            else:
                self.stdout.write(self.style.WARNING(f'Parking slot P{i} already exists, skipping'))
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {count} parking slots'))