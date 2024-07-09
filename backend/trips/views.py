from django.http import HttpResponse
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from trips.models import CRT, CRTIndex
from trips.models import Customs
from trips.serializers import CRTDetailSerializer, CRTCreateSerializer, CRTListSerializer, DTASerializer, \
    MerchandiseValueTypeSerializer
from trips.serializers import CustomsSerializer, DTACreateSerializer
from utils.utils import GenericCustomPagination, SerializerClassByActionMixin
from utils.utils.create_printable_pdf import create_dta_pdf
from utils.utils.pagination import CustomPageSizePagination
from .models import DTA


@extend_schema(tags=['Customs'])
class CustomsViewSet(ModelViewSet):
    queryset = Customs.objects.all()
    serializer_class = CustomsSerializer
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['name', 'city', 'code']


@extend_schema(tags=['DTAs'])
class DTAViewSet(ModelViewSet):
    queryset = DTA.objects.all()
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter]
    search_fields = ['carrier', 'issue_date', 'DTA_number']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DTACreateSerializer
        return DTASerializer

    @action(detail=True, methods=['get'])
    def print_dta(self, request, pk):
        dta = DTA.objects.filter(id=pk).first()
        if not dta:
            return Response({'message': 'DTA no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="DTA_{pk}.pdf"'
        create_dta_pdf(dta, response)
        return response


@extend_schema(tags=['CRTs'])
@extend_schema_view(
    list=extend_schema(
        description="Endpoint to list all CRTs.", request=CRTListSerializer
    ),
    retrieve=extend_schema(
        description="Endpoint to retrieve a single CRT.", request=CRTDetailSerializer
    ),
    create=extend_schema(
        description="Endpoint to create a CRT. "
                    "Availables Currency Codes are 'USD', 'PYG', 'BOB', 'ARS', 'BRL', 'UYU', 'CLP', 'PEN'",
        request=CRTCreateSerializer,
    ),
    update=extend_schema(
        description="Endpoint to update a CRT",
        request=CRTCreateSerializer,
    ),
)
class CRTViewSet(SerializerClassByActionMixin, viewsets.ModelViewSet):
    queryset = CRT.objects.all()
    serializer_class = CRTDetailSerializer
    pagination_class = GenericCustomPagination
    filter_backends = [SearchFilter]
    search_fields = ['crt_number', 'sender__name', 'recipient__name']
    action_serializers = {
        'create': CRTCreateSerializer,
        'update': CRTCreateSerializer,
        'partial_update': CRTCreateSerializer,
        'list': CRTListSerializer,
        'retrieve': CRTDetailSerializer,
    }

    @action(detail=False, methods=['GET'], url_path='next-crt-number')
    def next_crt_number(self, request, pk=None):
        crt_index = CRTIndex.get_current_index()
        next_crt_number = crt_index.get_formatted_code()
        return Response({'next_crt_number': next_crt_number})

    @action(detail=False, methods=['GET'], url_path='merchandise-value-type')
    def merchandise_value_type(self, request, *args, **kwargs):
        """
        List all order phases existing, only for admin user.
        """
        merchandise_types = CRT.MerchandiseValueType.choices
        serializer = MerchandiseValueTypeSerializer(merchandise_types, many=True)
        return Response(serializer.data)
