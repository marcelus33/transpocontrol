from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter

from users.views import PasswordViewset, UserViewSet, GroupViewSet, PermissionViewSet

router = DefaultRouter()
router.register("password", PasswordViewset, basename="user")
router.register("users", UserViewSet, basename="users")
router.register("groups", GroupViewSet, basename="groups")
router.register("permissions", PermissionViewSet, basename="permissions")

app_name = "users"
urlpatterns = [
    path("", include(router.urls)),
]
