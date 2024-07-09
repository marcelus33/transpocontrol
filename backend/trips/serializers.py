from cities_light.models import City
from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from drf_writable_nested.serializers import WritableNestedModelSerializer

from base.models import Client, Truck
from base.serializers import CountryCitySerializer, DriverSerializer, ClientSerializer, TruckSerializer, \
    OwnerBasicDetailSerializer, DriverBasicDetailSerializer, TrailerSerializer, TruckDetailSerializer, \
    TrailerDetailSerializer, TrailerBasicDetailSerializer, TruckBasicDetailSerializer
from invoice.serializers import SupplierInvoiceDetailSerializer, CustomMoneyFieldSerializer
from trips.models import CRT, CRTExpense, DTAShipmentDetail
from trips.models import DTA, Customs


class CustomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customs
        fields = [
            'id',
            'name',
            'city',
            'code'
        ]


class DTATruckDetailSerializer(serializers.ModelSerializer):
    driver = DriverBasicDetailSerializer()
    company_truck_name = serializers.SerializerMethodField()

    class Meta:
        model = Truck
        fields = ['id', 'plate', 'brand', 'year', 'authorized_company', 'owner',
                  'driver', 'type', 'chassis', 'company_truck_name', ]

    def get_company_truck_name(self, instance):
        if instance.authorized_company is not None:
            return f'{instance.authorized_company.name} - {instance.brand} - {instance.plate}'
        return f'{instance.brand} - {instance.plate}'


class DTAShipmentDetailsSerializer(WritableNestedModelSerializer):
    destination_customs = CountryCitySerializer()
    origin_goods = CountryCitySerializer()
    FOT_value_and_currency = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    sender = ClientSerializer()
    recipient = ClientSerializer()
    consignee = ClientSerializer()
    export_invoice = SupplierInvoiceDetailSerializer(allow_null=True)
    driver_1 = DriverSerializer()
    driver_2 = DriverSerializer(allow_null=True)
    currency = serializers.SerializerMethodField()

    class Meta:
        model = DTAShipmentDetail
        fields = ['id', 'page_number', 'bill_of_lading', 'destination_customs', 'origin_goods',
                  'FOT_value_and_currency', 'freight_in_usd', 'insurance_in_usd', 'cargo_type', 'cargo_quantity',
                  'gross_weight', 'net_weight', 'contains', 'sender', 'recipient', 'consignee', 'export_invoice',
                  'DTA_route', 'driver_1', 'driver_2', 'currency', ]

    def get_currency(self, instance):
        return {'id': instance.FOT_value_and_currency.currency.code}


class DTACreateSerializer(WritableNestedModelSerializer):
    carrier = ClientSerializer()
    departure_customs = CountryCitySerializer()
    destination_city = CountryCitySerializer()
    # trailer = TrailerBasicDetailSerializer()
    # truck = TruckBasicDetailSerializer()
    shipment_details = DTAShipmentDetailsSerializer(many=True)

    class Meta:
        model = DTA
        fields = [
            'id',
            'carrier',
            'transito_aduanero',
            'carrier_rol_del_contribuyente',
            'MIC_DTA_number',
            'issue_date',
            'departure_customs',
            'destination_city',
            'truck',
            'trailer',
            'substitute_truck',
            'substitute_trailer',
            'cargo_description',
            'carrier_signature',
            'carrier_signature_date',
            'customs_signature',
            'customs_signature_date',
            'DTA_number',
            'extra_1',
            'extra_2',
            'shipment_details'
        ]

    def to_internal_value(self, data):
        keys = ['truck', 'trailer', 'substitute_truck', 'substitute_trailer']
        for key in keys:
            item = data.get(key)
            data[key] = item.get('id') if item else None

        return super().to_internal_value(data)

    @transaction.atomic
    def create(self, validated_data):
        try:
            validated_data['shipment_details']=self.context.get('request').data.get('shipment_details')
            shipment_details_data = validated_data.pop('shipment_details', [])
            dta = super().create(validated_data)
            for detail_data in shipment_details_data:
                detail_serializer = DTAShipmentDetailsSerializer(data=detail_data)
                detail_serializer.is_valid(raise_exception=True)
                detail_serializer.save(dta=dta)
            return dta
        except Exception as e:
            raise ValidationError({"detail": str(e)})


class DTASerializer(serializers.ModelSerializer):
    carrier = ClientSerializer()
    departure_customs = CountryCitySerializer()
    destination_city = CountryCitySerializer()
    trailer = TrailerBasicDetailSerializer()
    truck = TruckBasicDetailSerializer()
    shipment_details = DTAShipmentDetailsSerializer(many=True)

    class Meta:
        model = DTA
        fields = [
            'id',
            'carrier',
            'transito_aduanero',
            'carrier_rol_del_contribuyente',
            'MIC_DTA_number',
            'issue_date',
            'departure_customs',
            'destination_city',
            'truck',
            'trailer',
            'substitute_truck',
            'substitute_trailer',
            'cargo_description',
            'carrier_signature',
            'carrier_signature_date',
            'customs_signature',
            'customs_signature_date',
            'DTA_number',
            'extra_1',
            'extra_2',
            'shipment_details'
        ]


def format_city_string(city):
    if not city:
        return None
    return "{} - {}".format(city.name, city.country)


class CRTClientSerializer(serializers.ModelSerializer):
    city_country = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = ['id', 'name', 'address', 'legal_denomination', 'city_country']

    def get_city_country(self, obj):
        return format_city_string(obj.city)


class CRTClientNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name', ]


class MerchandiseValueTypeSerializer(serializers.Serializer):
    """
    Serializer for listing all the MerchandiseValueType.
    """
    def to_representation(self, instance):
        return dict(
            id=instance[0],
            name=instance[1]
        )


class CRTExpenseDetailSerializer(serializers.ModelSerializer):

    sender_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    recipient_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)

    class Meta:
        model = CRTExpense
        fields = ['id', 'description', 'sender_amount', 'recipient_amount', ]
        read_only_fields = fields


class CRTExpenseCreateSerializer(serializers.ModelSerializer):
    sender_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    recipient_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)

    class Meta:
        model = CRTExpense
        fields = ['id', 'description', 'sender_amount', 'recipient_amount', ]


class CRTListSerializer(serializers.ModelSerializer):

    class Meta:
        model = CRT
        fields = [
            'id',
            'crt_number',
            'sender',
            'recipient',
            # 'carrier',
            # 'consignee',
        ]
        read_only_fields = fields


class CRTDetailSerializer(serializers.ModelSerializer):
    expenses = CRTExpenseDetailSerializer(many=True, read_only=True)
    type_merchandise_1 = serializers.SerializerMethodField()
    type_merchandise_2 = serializers.SerializerMethodField()
    merchandise_value_1 = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    merchandise_value_2 = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    external_freight_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    reimbursement_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    load_value = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)

    class Meta:
        model = CRT
        fields = [
            'id',
            'crt_number',
            'carrier',
            'sender',
            'consignee',
            'recipient',
            'place_of_issue',  # 5 LUGAR Y PAIS DE EMISION
            'loading_place',  # 7 LUGAR DE CARGA
            'loading_date',
            'destination_place',  # 8 LUGAR DESTINO
            'notify_party',
            'successive_carriers',
            'contains',
            'gross_weight_kg',
            'net_weight_kg',
            'volume_mcu',
            'load_value',
            'type_merchandise_1',
            'merchandise_value_1',
            'type_merchandise_2',
            'merchandise_value_2',
            'expenses',
            'attached_documents',
            'customs_instructions',
            'external_freight_amount',
            'reimbursement_amount',
            'remarks',
            'carrier_name',
            'carrier_signature',
            'carrier_signature_date',
        ]
        read_only_fields = fields

    def get_type_merchandise_1(self, obj):
        value_id = obj.type_merchandise_1
        value_name = CRT.MerchandiseValueType(value_id).label
        return {"id": value_id, "name": value_name}

    def get_type_merchandise_2(self, obj):
        value_id = obj.type_merchandise_2
        if value_id is not None:
            value_name = CRT.MerchandiseValueType(value_id).label
            return {"id": value_id, "name": value_name}
        return None


class CRTCreateSerializer(WritableNestedModelSerializer):
    expenses = CRTExpenseCreateSerializer(many=True)
    merchandise_value_1 = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    merchandise_value_2 = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2, allow_null=True)
    external_freight_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    reimbursement_amount = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)
    load_value = CustomMoneyFieldSerializer(max_digits=14, decimal_places=2)

    class Meta:
        model = CRT
        fields = [
            'id',
            'crt_number',
            'carrier',
            'sender',
            'consignee',
            'recipient',
            'place_of_issue',  # 5 LUGAR Y PAIS DE EMISION
            'loading_place',  # 7 LUGAR DE CARGA
            'loading_date',
            'destination_place',  # 8 LUGAR DESTINO
            'notify_party',
            'successive_carriers',
            'contains',
            'gross_weight_kg',
            'net_weight_kg',
            'volume_mcu',
            'load_value',
            'type_merchandise_1',
            'merchandise_value_1',
            'type_merchandise_2',
            'merchandise_value_2',
            'expenses',
            'attached_documents',
            'customs_instructions',
            'external_freight_amount',
            'reimbursement_amount',
            'remarks',
            'carrier_name',
            'carrier_signature',
            'carrier_signature_date',
        ]

    @transaction.atomic
    def create(self, validated_data):
        try:
            expenses_data = validated_data.pop('expenses', [])
            crt = super().create(validated_data)
            expenses = [CRTExpense(crt=crt, **expense) for expense in expenses_data]
            CRTExpense.objects.bulk_create(expenses)
            return crt
        except Exception as e:
            raise ValidationError({"detail": str(e)})

    @transaction.atomic
    def update(self, instance, validated_data):
        try:
            expenses_data = validated_data.pop('expenses', [])
            crt = super().update(instance, validated_data)
            # Clear existing expenses and add new ones
            CRTExpense.objects.filter(crt=crt).delete()
            expenses = [CRTExpense(crt=crt, **expense) for expense in expenses_data]
            CRTExpense.objects.bulk_create(expenses)
            #
            return instance
        except Exception as e:
            raise ValidationError({"detail": str(e)})
