from django.urls import path, include
from rest_framework.routers import DefaultRouter

from invoice.views import SupplierInvoiceViewSet

router = DefaultRouter()

router.register("supplier", SupplierInvoiceViewSet, basename="supplier-invoice")


urlpatterns = [
    path("", include(router.urls)),
]