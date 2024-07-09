from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from rest_framework import viewsets
from rest_framework.filters import SearchFilter

from utils.utils import GenericCustomPagination, SerializerClassByActionMixin
from .filters import DateRangeFilter, DueDateRangeFilter, IsAnnulledFilter
from .models import SupplierInvoice
from .serializers import SupplierInvoiceSerializer, SupplierInvoiceDetailSerializer, SupplierInvoiceListSerializer


@extend_schema(tags=['Invoices'])
@extend_schema_view(
    list=extend_schema(
        description="Endpoint to list all supplier invoices.",
        parameters=[
            OpenApiParameter(name='date_start', description='Fecha de inicio para filtrar por fecha',
                             type=OpenApiTypes.DATE),
            OpenApiParameter(name='date_end', description='Fecha de fin para filtrar por fecha',
                             type=OpenApiTypes.DATE),
            OpenApiParameter(name='due_date_start', description='Fecha de inicio para filtrar por fecha de vencimiento',
                             type=OpenApiTypes.DATE),
            OpenApiParameter(name='due_date_end', description='Fecha de fin para filtrar por fecha de vencimiento',
                             type=OpenApiTypes.DATE),
            OpenApiParameter(name='is_annulled',
                             description='Incluir facturas anuladas.',
                             type=OpenApiTypes.BOOL),
        ],
        request=SupplierInvoiceDetailSerializer,
    ),
    retrieve=extend_schema(
        description="Endpoint to retrieve a single invoice.", request=SupplierInvoiceDetailSerializer
    ),
    create=extend_schema(
        description="Endpoint to create a supplier invoice. "
                    "Availables Currency Codes are 'USD', 'PYG', 'BOB', 'ARS', 'BRL', 'UYU', 'CLP', 'PEN'",
        request=SupplierInvoiceSerializer,
    ),
    update=extend_schema(
        description="Endpoint to update a supplier invoice.",
        request=SupplierInvoiceSerializer,
    ),
)
class SupplierInvoiceViewSet(SerializerClassByActionMixin, viewsets.ModelViewSet):
    queryset = SupplierInvoice.objects.all()
    serializer_class = SupplierInvoiceSerializer
    pagination_class = GenericCustomPagination
    filter_backends = [SearchFilter, DateRangeFilter, DueDateRangeFilter, IsAnnulledFilter]
    search_fields = ['supplier__name', 'number']
    action_serializers = {
        'create': SupplierInvoiceSerializer,
        'update': SupplierInvoiceSerializer,
        'list': SupplierInvoiceListSerializer,
        'retrieve': SupplierInvoiceDetailSerializer,
    }

