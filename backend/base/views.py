import requests
from bs4 import BeautifulSoup
from cities_light.models import Region, Country, City
from drf_spectacular.utils import extend_schema, OpenApiParameter, extend_schema_view
from rest_framework import status
from rest_framework.filters import SearchFilter
from rest_framework.mixins import ListModelMixin
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, GenericViewSet

from base.models import Owner, Driver, Client, Supplier, Truck, Trailer, Supply, SupplyStorage, Category
from base.serializers import DriverSerializer, OwnerSerializer, ClientSerializer, SupplierSerializer, StateSerializer, \
    CitySerializer, CountrySerializer, TruckSerializer, TrailerSerializer, OwnerRetrieveSerializer, \
    ClientRetrieveSerializer, TruckDetailSerializer, TrailerDetailSerializer, TrailerBasicDetailSerializer, \
    TruckBasicDetailSerializer, SupplyCreateSerializer, SupplyDetailSerializer, SupplyStorageDetailSerializer, \
    SupplyStorageCreateSerializer, CountryCitySerializer, CategorySerializer
from utils.utils import CollectedMultipartJsonViewMixin, SerializerClassByActionMixin
from utils.utils.pagination import CustomPageSizePagination


@extend_schema(tags=['Clients'])
@extend_schema_view(
    list=extend_schema(
        description="Endpoint to list all clients.", request=ClientSerializer
    ),
    retrieve=extend_schema(
        description="Endpoint to retrieve a single client.", request=ClientRetrieveSerializer
    ),
    create=extend_schema(
        description="Endpoint to create new clients.",
        request=ClientSerializer,
    ),
    update=extend_schema(
        description="Endpoint to update clients.",
        request=ClientSerializer,
    ),
)
class ClientViewSet(
    CollectedMultipartJsonViewMixin,
    SerializerClassByActionMixin,
    ModelViewSet
):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['name', 'ruc']
    action_serializers = {
        'create': ClientSerializer,
        'update': ClientSerializer,
        'list': ClientSerializer,
        'retrieve': ClientRetrieveSerializer,
    }


@extend_schema(tags=['Suppliers'])
class SupplierViewSet(
    CollectedMultipartJsonViewMixin,
    ModelViewSet
):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['name', 'ruc']


@extend_schema(tags=['Owners'])
@extend_schema_view(
    list=extend_schema(
        description="Endpoint to list all owners.", request=OwnerSerializer
    ),
    retrieve=extend_schema(
        description="Endpoint to retrieve a single owner.", request=OwnerRetrieveSerializer
    ),
    create=extend_schema(
        description="Endpoint to create new owners.",
        request=OwnerSerializer,
    ),
    update=extend_schema(
        description="Endpoint to update owners.",
        request=OwnerSerializer,
    ),
)
class OwnerViewSet(
    CollectedMultipartJsonViewMixin,
    SerializerClassByActionMixin,
    ModelViewSet,
):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['name', 'id_number', 'ruc']
    action_serializers = {
        'create': OwnerSerializer,
        'update': OwnerSerializer,
        'list': OwnerSerializer,
        'retrieve': OwnerRetrieveSerializer,
    }


@extend_schema(tags=['Drivers'])
class DriverViewSet(
    CollectedMultipartJsonViewMixin,
    ModelViewSet
):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['name', 'id_number', 'ruc']


@extend_schema(tags=['Vehicles'])
@extend_schema_view(
    list=extend_schema(
        description="Endpoint to list all trucks.", request=TruckBasicDetailSerializer
    ),
    retrieve=extend_schema(
        description="Endpoint to retrieve a single truck.", request=TruckDetailSerializer
    ),
    create=extend_schema(
        description="Endpoint to create new trucks.",
        request=TruckSerializer,
    ),
    update=extend_schema(
        description="Endpoint to update trucks.",
        request=TruckSerializer,
    ),
)
class TruckViewSet(
    CollectedMultipartJsonViewMixin,
    SerializerClassByActionMixin,
    ModelViewSet
):
    queryset = Truck.objects.all()
    serializer_class = TruckSerializer
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['plate', 'chassis', 'vehicle_no']
    action_serializers = {
        'create': TruckSerializer,
        'update': TruckSerializer,
        'list': TruckBasicDetailSerializer,
        'retrieve': TruckDetailSerializer,
    }


@extend_schema(tags=['Vehicles'])
@extend_schema_view(
    list=extend_schema(
        description="Endpoint to list all trucks.", request=TrailerBasicDetailSerializer
    ),
    retrieve=extend_schema(
        description="Endpoint to retrieve a single truck.", request=TrailerDetailSerializer
    ),
    create=extend_schema(
        description="Endpoint to create new trucks.",
        request=TrailerSerializer,
    ),
    update=extend_schema(
        description="Endpoint to update trucks.",
        request=TrailerSerializer,
    ),
)
class TrailerViewSet(
    CollectedMultipartJsonViewMixin,
    SerializerClassByActionMixin,
    ModelViewSet
):
    queryset = Trailer.objects.all()
    serializer_class = TrailerSerializer
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['plate', 'chassis', 'vehicle_no']
    action_serializers = {
        'create': TrailerSerializer,
        'update': TrailerSerializer,
        'list': TrailerBasicDetailSerializer,
        'retrieve': TrailerDetailSerializer,
    }


@extend_schema(tags=['Supplies'])
@extend_schema_view(
    list=extend_schema(
        description="Endpoint to list all supplies.", request=SupplyDetailSerializer
    ),
    retrieve=extend_schema(
        description="Endpoint to retrieve a single supply.", request=SupplyDetailSerializer
    ),
    create=extend_schema(
        description="Endpoint to create new supplies.",
        request=SupplyCreateSerializer,
    ),
    update=extend_schema(
        description="Endpoint to update supplies.",
        request=SupplyCreateSerializer,
    ),
)
class SupplyViewSet(SerializerClassByActionMixin, ModelViewSet):
    queryset = Supply.objects.all()
    serializer_class = SupplyCreateSerializer
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['code', 'name', 'description']
    action_serializers = {
        'create': SupplyCreateSerializer,
        'update': SupplyCreateSerializer,
        'partial_update': SupplyCreateSerializer,
        'list': SupplyDetailSerializer,
        'retrieve': SupplyDetailSerializer,
    }


@extend_schema(tags=['Supply Storages'])
@extend_schema_view(
    list=extend_schema(
        description="Endpoint to list all supply storages.", request=SupplyStorageDetailSerializer
    ),
    retrieve=extend_schema(
        description="Endpoint to retrieve a single supply storage.", request=SupplyStorageDetailSerializer
    ),
    create=extend_schema(
        description="Endpoint to create new supply storages.",
        request=SupplyStorageCreateSerializer,
    ),
    update=extend_schema(
        description="Endpoint to update supply storages.",
        request=SupplyStorageCreateSerializer,
    ),
    partial_update=extend_schema(
        description="Endpoint to partial update supply storages.",
        request=SupplyStorageCreateSerializer,
    ),
)
class SupplyStorageViewSet(SerializerClassByActionMixin, ModelViewSet):
    queryset = SupplyStorage.objects.all()
    serializer_class = SupplyStorageCreateSerializer
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['name', 'address']
    action_serializers = {
        'create': SupplyStorageCreateSerializer,
        'update': SupplyStorageCreateSerializer,
        'partial_update': SupplyStorageCreateSerializer,
        'list': SupplyStorageDetailSerializer,
        'retrieve': SupplyStorageDetailSerializer,
    }


@extend_schema(tags=['Cities Light'])
class CountryViewSet(GenericViewSet, ListModelMixin):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    pagination_class = CustomPageSizePagination


@extend_schema(tags=['Cities Light'])
class StateViewSet(GenericViewSet, ListModelMixin):
    queryset = Region.objects.all()
    serializer_class = StateSerializer
    pagination_class = CustomPageSizePagination

    def list(self, request, *args, **kwargs):
        country_id = request.query_params.get('country_id')
        if country_id:
            self.queryset = self.queryset.filter(country_id=country_id)
        return super().list(request, *args, **kwargs)


@extend_schema(tags=['Cities Light'])
class CityViewSet(GenericViewSet, ListModelMixin):
    queryset = City.objects.all()
    serializer_class = CitySerializer
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['name']

    def list(self, request, *args, **kwargs):
        country_id = request.query_params.get('country_id')
        if country_id:
            self.queryset = self.queryset.filter(country_id=country_id)
        return super().list(request, *args, **kwargs)


class CountryCityViewSet(GenericViewSet, ListModelMixin):
    queryset = City.objects.all()
    serializer_class = CountryCitySerializer
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['name', 'country__name', ]


@extend_schema(tags=['Vehicles'])
class VehicleInfoView(APIView):
    """
    API endpoint that retrieves vehicle information based on a provided license plate number.
    The endpoint accepts a GET request with the license plate number as a query parameter, queries an external service,
    and scrapes the resulting HTML page to extract relevant data.
    """

    @extend_schema(
        parameters=[
            OpenApiParameter(name='plate', description='License plate number', required=True, type=str),
        ],
        summary='Retrieve vehicle information by license plate.',
        description='This endpoint retrieves vehicle information based on a provided license plate number. '
                    'It scrapes the HTML from an external service to extract relevant data.',
    )
    def get(self, request):
        plate = request.query_params.get('plate')
        if not plate:
            return Response({"error": "Plate parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        url = f"http://www.dinatran.gov.py:8082/wsint3/servlet/com.wsint3.mostrarplacanacional?{plate}"
        response = requests.get(url)

        if response.status_code != 200:
            return Response({"error": "Failed to retrieve information"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        soup = BeautifulSoup(response.content, 'html.parser')
        #
        table = soup.find('table', id='TABLE2')
        data_dict = {}
        try:
            relevant_info_labels = ['Propietario', 'Cédula/RUC', 'Dirección', 'Teléfono', 'Habilitación N°', 'Año',
                                    'Marca', 'Tipo', 'Chassis Nro', 'Ejes', 'Peso']
            if table:
                rows = table.find_all('tr')
                for row in rows:
                    cols = row.find_all('td')
                    i = 0
                    while i < len(cols):
                        key = cols[i].text.strip(':').strip()
                        # Check if the key is in the list of relevant info labels
                        if key in relevant_info_labels:
                            key = key.lower()
                            # Extract the value from the next column (td element)
                            value = cols[i + 1].text.strip()
                            # Clean and normalize the value
                            value = value.replace('\xa0', ' ').replace('\n', ' ').strip()
                            # Add the key-value pair to the data dictionary
                            if key and value:
                                # Check if the key already exists in the dictionary
                                if key in data_dict:
                                    if isinstance(data_dict[key], list):
                                        data_dict[key].append(value)
                                    else:
                                        data_dict[key] = [data_dict[key], value]
                                else:
                                    data_dict[key] = value
                        #
                        i += 2
        except Exception as e:
            return Response({"error": "An error occurred while attempting to retrieve vehicle information."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"data": self._translate_data(data_dict)}, status=status.HTTP_200_OK)

    def _translate_data(self, data):
        translation_mapping = {
            "propietario": "owner",
            "cédula/ruc": "id_number",
            "dirección": "address",
            "teléfono": "phone",
            "habilitación n°": "license_number",
            "año": "year",
            "marca": "brand",
            "tipo": "type",
            "chassis nro": "chassis_number",
            "ejes": "axles",
            "peso": "weight"
        }
        translated_data_dict = {}
        for key, value in data.items():
            translated_key = translation_mapping.get(key, key)
            if translated_key and value:
                translated_data_dict[translated_key] = value
        #
        return translated_data_dict


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['name']
