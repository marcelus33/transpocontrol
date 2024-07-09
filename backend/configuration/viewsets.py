import json

from django.core.files import File
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.shortcuts import render
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, mixins, serializers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from configuration.models import Configuration
from configuration.serializer import ConfigurationListSerializer, ConfigurationFileUpdateSerializer, \
    ConfigurationUpdateSerializer, ConfigurationBulkUpdateSerializer


@extend_schema(tags=['Configurations'])
class ConfigurationViewset(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, GenericViewSet):
    lookup_field = 'key'

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ConfigurationListSerializer
        if self.request.FILES:
            return ConfigurationFileUpdateSerializer
        return ConfigurationUpdateSerializer

    def get_queryset(self):
        base = Configuration.objects.all()
        if self.action in ['list', 'retrieve']:
            if self.request.user.is_anonymous:
                return base.filter(is_public=True)
            if not self.request.user.is_superuser:
                return base.filter(only_admin=False)
        return base

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.image_value:
            return Response(request.build_absolute_uri(instance.image_value.url))
        return Response(instance.value if instance.value else None)

    def update(self, request, *args, **kwargs):
        if not self.request.user.is_superuser:  # TODO admin missing here
            return Response(status=403)
        return super().update(request, *args, **kwargs)

    @extend_schema(request=ConfigurationBulkUpdateSerializer)
    @action(detail=False, methods=['post'], url_path='update-configurations')
    def update_configurations(self, request):
        serializer = ConfigurationBulkUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        valid_data = serializer.validated_data
        errors = []
        for key, value in valid_data.items():
            try:
                config, created = Configuration.objects.update_or_create(key=key, defaults={'value': value})
            except Exception as e:
                errors.append({key: str(e)})

        if errors:
            return Response({"detail": "Some configurations could not be updated.", "errors": errors},
                            status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Configurations updated successfully."}, status=status.HTTP_200_OK)

