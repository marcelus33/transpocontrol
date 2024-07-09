from django.urls import path, include
from rest_framework.routers import DefaultRouter

from trips.views import DTAViewSet, CustomsViewSet
from trips.views import CRTViewSet

router = DefaultRouter()

router.register('dta', DTAViewSet, basename='dta')
router.register('customs', CustomsViewSet, basename='customs')
router.register("crt", CRTViewSet, basename="crt")


urlpatterns = [
    path("", include(router.urls)),
]
