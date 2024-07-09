import json

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from configuration.models import Configuration


class ConfigurationListSerializer(serializers.ModelSerializer):
    key = serializers.CharField(read_only=True)
    value = serializers.SerializerMethodField()

    class Meta:
        model = Configuration
        fields = ['key', 'value', 'description']

    def get_value(self, obj):
        if obj.image_value:
            return self.context['request'].build_absolute_uri(obj.image_value.url)
        return obj.value


class ConfigurationUpdateSerializer(serializers.ModelSerializer):
    value = serializers.JSONField(required=True, allow_null=True)

    class Meta:
        model = Configuration
        fields = ['value']

    def to_internal_value(self, data):
        # try:
        #     if 'value' in data:
        #         json.loads(data['value'])
        # except json.JSONDecodeError:
        #     data._mutable = True
        #     data['value'] = f'"{data["value"]}"'
        #     data._mutable = False
        return super().to_internal_value(data)

    def validate(self, attrs):
        Configuration.validate_new_value(self.instance.key, attrs['value'])
        return attrs

    def update(self, instance, validated_data):
        if validated_data['value']:
            validated_data['image_value'] = None
        if validated_data['value'] is None and validated_data['image_value'] is None and not instance.nullable:
            raise ValidationError('Configuration is not nullable')
        return super().update(instance, validated_data)


class ConfigurationFileUpdateSerializer(ConfigurationUpdateSerializer):
    value = serializers.FileField(required=True, allow_null=True, source='image_value')

    def validate(self, attrs):
        Configuration.validate_new_value(self.instance.key, attrs['image_value'])
        return attrs

    def update(self, instance, validated_data):
        validated_data['value'] = None
        return super().update(instance, validated_data)


class ConfigurationBulkUpdateSerializer(serializers.Serializer):
    formato_numero_ventas = serializers.CharField(required=True)
    imprimir_automaticamente_finalizar_venta = serializers.BooleanField(required=True)
    items_por_factura = serializers.IntegerField(required=True)
    modificar_precio_item_venta = serializers.BooleanField(required=True)
    modificar_valor_total_venta = serializers.BooleanField(required=True)
    mostrar_costo_grilla_productos = serializers.BooleanField(required=True)
    mostrar_descuento_grilla_ventas = serializers.BooleanField(required=True)
    mostrar_ganancia_grilla_productos = serializers.BooleanField(required=True)
    mostrar_imagen_producto_principal = serializers.BooleanField(required=True)
    mostrar_total_otras_monedas = serializers.BooleanField(required=True)
    no_usar_precios_mayoristas = serializers.BooleanField(required=True)
    numero_factura = serializers.CharField(required=True)
    permitir_ventas_sin_stock = serializers.BooleanField(required=True)
