from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import FieldActivity, Visitor, Delivery
from .serializers import FieldActivitySerializer, VisitorSerializer, DeliverySerializer

class FieldActivityViewSet(viewsets.ModelViewSet):
    queryset = FieldActivity.objects.all().order_by('-timestamp')
    serializer_class = FieldActivitySerializer
    permission_classes = [AllowAny]

class VisitorViewSet(viewsets.ModelViewSet):
    queryset = Visitor.objects.all().order_by('-arrival_time')
    serializer_class = VisitorSerializer
    permission_classes = [AllowAny]

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all().order_by('-created_at')
    serializer_class = DeliverySerializer
    permission_classes = [AllowAny] 