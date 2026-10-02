from django.db import models

class FieldActivity(models.Model):
    agent_username = models.CharField(max_length=150)
    location_name = models.CharField(max_length=255)
    status_notes = models.TextField(blank=True, null=True)
    is_task_completed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.agent_username} - {self.location_name}"


class Visitor(models.Model):
    visitor_name = models.CharField(max_length=150)
    contact_info = models.CharField(max_length=100)
    purpose_of_visit = models.TextField()
    host_username = models.CharField(max_length=150, blank=True, null=True)
    arrival_time = models.DateTimeField(auto_now_add=True)
    is_checked_out = models.BooleanField(default=False)

    def __str__(self):
        return self.visitor_name


class Delivery(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
    ]

    department = models.CharField(max_length=100)
    item_manifest = models.TextField()
    recipient_username = models.CharField(max_length=150, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Delivery #{self.id} - {self.department}"