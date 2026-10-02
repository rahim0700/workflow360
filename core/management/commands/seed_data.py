from django.core.management.base import BaseCommand
from django.utils import timezone
# Replace 'your_app_name' with the actual name of your Django app containing the models
from core.models import FieldActivity, Visitor, Delivery 

class Command(BaseCommand):
    help = 'Seeds initial sample data for the dashboard control panel'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Clear existing sample data if desired (optional)
        FieldActivity.objects.all().delete()
        Visitor.objects.all().delete()
        Delivery.objects.all().delete()

        # 1. Seed Field Activities
        FieldActivity.objects.create(
            agent_username='agent_mwanja',
            location_name='Sector A - Warehouse',
            status_notes='Perimeter security check completed successfully.',
            is_task_completed=True,
            timestamp=timezone.now()
        )
        FieldActivity.objects.create(
            agent_username='sarah_k',
            location_name='Gate 3 - North Wing',
            status_notes='Inspecting incoming cargo container seals.',
            is_task_completed=False,
            timestamp=timezone.now()
        )

        # 2. Seed Visitors
        Visitor.objects.create(
            visitor_name='John Doe',
            contact_info='+256 700 123456',
            purpose_of_visit='Vendor meeting with Logistics team',
            host_username='admin_user',
            arrival_time=timezone.now(),
            is_checked_out=False
        )
        Visitor.objects.create(
            visitor_name='Alice Nakato',
            contact_info='+256 772 987654',
            purpose_of_visit='IT Infrastructure audit',
            host_username='tech_lead',
            arrival_time=timezone.now(),
            is_checked_out=True
        )

        # 3. Seed Deliveries
        Delivery.objects.create(
            department='Information Technology',
            item_manifest='Dell Latitude Replacement Chargers (x5)',
            recipient_username='mwanja',
            status='PENDING',
            created_at=timezone.now()
        )
        Delivery.objects.create(
            department='Administration',
            item_manifest='Office Stationery and Printer Cartridges',
            recipient_username='front_desk',
            status='VERIFIED',
            created_at=timezone.now()
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database with test records!'))