from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Delivery, FieldActivity, Visitor
from .serializers import (
    DeliverySerializer,
    FieldActivitySerializer,
    VisitorSerializer,
)


class FieldActivityViewSet(viewsets.ModelViewSet):
  """API endpoint for tracking field workforce status and tasks[cite: 1, 2]."""

  queryset = FieldActivity.objects.all().order_by('-timestamp')
  serializer_class = FieldActivitySerializer
  permission_classes = [IsAuthenticated]

  def perform_create(self, serializer):
    serializer.save(agent=self.request.user)


class VisitorViewSet(viewsets.ModelViewSet):
  """API endpoint for visitor check-ins and host notifications[cite: 1, 2]."""

  queryset = Visitor.objects.all().order_by('-arrival_time')
  serializer_class = VisitorSerializer
  permission_classes = [IsAuthenticated]


class DeliveryViewSet(viewsets.ModelViewSet):
  """API endpoint for delivery verification and digital sign-off manifests[cite: 1, 2, 3]."""

  queryset = Delivery.objects.all().order_by('-created_at')
  serializer_class = DeliverySerializer
  permission_classes = [IsAuthenticated]