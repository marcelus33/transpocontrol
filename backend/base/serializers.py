from cities_light.models import Region, City, Country
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, SerializerMethodField

from base.models import Owner, Driver, Client, Supplier, Truck, Trailer, Supply, SupplyStorage, Category


class CitySerializer(ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'region']


class CountryCitySerializer(ModelSerializer):
    name = SerializerMethodField()

    class Meta:
        model = City
        fields = ['id', 'name']

    def get_name(self, obj):
        return f"{obj.country.name} - {obj.name}"


class OwnerBasicDetailSerializer(ModelSerializer):
    class Meta:
        model = Owner
        fields = ['id', 'name', ]


class DriverBasicDetailSerializer(ModelSerializer):
    class Meta:
        model = Driver
        fields = ['id', 'name', ]


class ClientBasicDetailSerializer(ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name', ]


class ClientSerializer(ModelSerializer):
    status = serializers.CharField(read_only=True)
    status_changed_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Client
        fields = ['id', 'name', 'ruc', 'address', 'phone', 'email', 'observation', 'legal_denomination', 'city',
                  'image', 'status', 'status_changed_at']


class ClientRetrieveSerializer(ModelSerializer):
    city = CitySerializer()
    status = serializers.CharField(read_only=True)
    status_changed_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Client
        fields = ['id', 'name', 'ruc', 'address', 'phone', 'email', 'observation', 'legal_denomination', 'city',
                  'image', 'status', 'status_changed_at']


class SupplierSerializer(ModelSerializer):
    status = serializers.CharField(read_only=True)
    status_changed_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Supplier
        fields = ['id', 'name', 'ruc', 'address', 'phone', 'email', 'observation', 'image', 'status',
                  'status_changed_at']


class OwnerSerializer(ModelSerializer):
    class Meta:
        model = Owner
        fields = ['id', 'name', 'gender', 'birthday', 'id_number', 'ruc', 'address', 'phone', 'email', 'observation',
                  'city', 'image']


class OwnerRetrieveSerializer(ModelSerializer):
    city = CitySerializer()

    class Meta:
        model = Owner
        fields = ['id', 'name', 'gender', 'birthday', 'id_number', 'ruc', 'address', 'phone', 'email', 'observation',
                  'city', 'image']


class DriverSerializer(ModelSerializer):
    class Meta:
        model = Driver
        fields = ['id', 'name', 'gender', 'birthday', 'id_number', 'ruc', 'address', 'phone', 'email', 'observation',
                  'contract', 'image']


class TruckSerializer(ModelSerializer):
    class Meta:
        model = Truck
        fields = ['id', 'plate', 'brand', 'year', 'authorized_company', 'owner',
                  'driver', 'type', 'axles', 'body', 'chassis', 'load_capacity', 'vehicle_no', 'observation', 'image']


class TruckDetailSerializer(ModelSerializer):
    authorized_company = ClientBasicDetailSerializer()
    owner = OwnerBasicDetailSerializer()
    driver = DriverBasicDetailSerializer()

    class Meta:
        model = Truck
        fields = ['id', 'plate', 'brand', 'year', 'authorized_company', 'owner',
                  'driver', 'type', 'axles', 'body', 'chassis', 'load_capacity', 'vehicle_no', 'observation', 'image']


class TruckBasicDetailSerializer(ModelSerializer):
    authorized_company = ClientBasicDetailSerializer()
    owner = OwnerBasicDetailSerializer()
    driver = DriverBasicDetailSerializer()
    company_truck_name = SerializerMethodField()

    class Meta:
        model = Truck
        fields = ['id', 'plate', 'brand', 'year', 'authorized_company', 'owner',
                  'driver', 'type', 'chassis', 'company_truck_name', 'load_capacity',]

    def get_company_truck_name(self, instance):
        return f'{instance.authorized_company.name} - {instance.brand} - {instance.plate}'


class TrailerSerializer(ModelSerializer):
    class Meta:
        model = Trailer
        fields = ['id', 'plate', 'year', 'owner', 'driver', 'type', 'axles', 'body', 'chassis', 'load_capacity',
                  'vehicle_no', 'observation', 'image', 'length', 'width', 'height']


class TrailerBasicDetailSerializer(ModelSerializer):
    owner = OwnerBasicDetailSerializer()
    driver = DriverBasicDetailSerializer()

    class Meta:
        model = Trailer
        fields = ['id', 'plate', 'year', 'owner', 'driver', 'type', 'chassis', 'length', 'width', 'height']


class TrailerDetailSerializer(ModelSerializer):
    owner = OwnerBasicDetailSerializer()
    driver = DriverBasicDetailSerializer()

    class Meta:
        model = Trailer
        fields = ['id', 'plate', 'year', 'owner', 'driver', 'type', 'axles', 'body', 'chassis', 'load_capacity',
                  'vehicle_no', 'observation', 'image', 'length', 'width', 'height']


class SupplyStorageDetailSerializer(ModelSerializer):
    class Meta:
        model = SupplyStorage
        fields = ['id', 'name', 'address']
        read_only_fields = fields


class SupplyStorageCreateSerializer(ModelSerializer):
    class Meta:
        model = SupplyStorage
        fields = ['id', 'name', 'address']


class SupplyDetailSerializer(ModelSerializer):
    storage = SupplyStorageDetailSerializer(read_only=True)

    class Meta:
        model = Supply
        fields = ['id', 'code', 'name', 'description', 'price', 'quantity', 'storage']
        read_only_fields = fields


class SupplyCreateSerializer(ModelSerializer):
    class Meta:
        model = Supply
        fields = ['id', 'code', 'name', 'description', 'price', 'quantity', 'storage']


class CountrySerializer(ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'alternate_names']
        read_only_fields = fields


class StateSerializer(ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name']
        read_only_fields = fields


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id',
            'name'
        ]
