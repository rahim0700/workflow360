from rest_framework import serializers
from .models import FieldActivity, Visitor, Delivery

class FieldActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = FieldActivity
        fields = '__all__'

class VisitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visitor
        fields = ['visitor_name', 'contact_info', 'purpose_of_visit', 'host', 'arrival_time', 'is_checked_out']

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__'