from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Delivery, FieldActivity, Visitor

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

  class Meta:
    model = User
    fields = [
        'id',
        'username',
        'email',
        'role',
        'phone_number',
        'department',
        'first_name',
        'last_name',
    ]


class FieldActivitySerializer(serializers.ModelSerializer):
  agent_username = serializers.ReadOnlyField(source='agent.username')

  class Meta:
    model = FieldActivity
    fields = [
        'id',
        'agent',
        'agent_username',
        'location_name',
        'latitude',
        'longitude',
        'status_notes',
        'timestamp',
        'is_task_completed',
    ]
    read_only_fields = ['timestamp', 'agent']


class VisitorSerializer(serializers.ModelSerializer):
  host_username = serializers.ReadOnlyField(source='host.username')

  class Meta:
    model = Visitor
    fields = [
        'id',
        'visitor_name',
        'contact_info',
        'purpose_of_visit',
        'host',
        'host_username',
        'arrival_time',
        'departure_time',
        'is_checked_out',
    ]
    read_only_fields = ['arrival_time']


class DeliverySerializer(serializers.ModelSerializer):
  recipient_username = serializers.ReadOnlyField(source='recipient.username')

  class Meta:
    model = Delivery
    fields = [
        'id',
        'item_manifest',
        'department',
        'recipient',
        'recipient_username',
        'status',
        'receiver_signature',
        'signed_at',
        'created_at',
    ]
    read_only_fields = ['created_at']