from django.urls import path, include
from rest_framework.routers import DefaultRouter

from base.views import OwnerViewSet, DriverViewSet, ClientViewSet, SupplierViewSet, CityViewSet, StateViewSet, \
    CountryViewSet, TruckViewSet, TrailerViewSet, VehicleInfoView, SupplyViewSet, SupplyStorageViewSet, \
    CountryCityViewSet

router = DefaultRouter()

router.register("client", ClientViewSet, basename="client")
router.register("supplier", SupplierViewSet, basename="supplier")
router.register("owner", OwnerViewSet, basename="owner")
router.register("driver", DriverViewSet, basename="driver")
router.register("truck", TruckViewSet, basename="truck")
router.register("trailer", TrailerViewSet, basename="trailer")
router.register("supply", SupplyViewSet, basename="supply")
router.register("supply-storage", SupplyStorageViewSet, basename="supply-storage")
router.register("city", CityViewSet, basename="city")
router.register("country-city", CountryCityViewSet, basename="country-city")
router.register("state", StateViewSet, basename="state")
router.register("country", CountryViewSet, basename="country")


urlpatterns = [
    path("", include(router.urls)),
    path('vehicle-info/', VehicleInfoView.as_view(), name='vehicle-info'),
]