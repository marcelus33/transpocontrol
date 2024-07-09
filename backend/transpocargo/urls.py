"""jtc URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.contrib import admin
from django.conf import settings
from django.urls import path, include, re_path
from django.views.generic.base import TemplateView
from drf_spectacular.views import SpectacularJSONAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenRefreshView

from users.views import CustomLoginView

api_v1_patterns = [
    path("authenticate/", CustomLoginView.as_view()),
    path("configuration/", include("configuration.urls")),
    path("invoice/", include("invoice.urls")),
    path("trip/", include("trips.urls")),
    # TODO: Check if needed or not
    # path("", include('dj_rest_auth.urls')),
    path("", include("users.urls")),
    path("", include("base.urls")),

]

urlpatterns = [
    path("api/v1/", include(api_v1_patterns)),
    path("admin/", admin.site.urls),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # swagger
    path("api-docs/schema/", SpectacularJSONAPIView.as_view(), name="schema"),
    path("api-docs/", SpectacularSwaggerView.as_view(url_name='schema'), name="api_docs"),

    path('adminx/webshell/', include('webshell.urls')),
]

admin.site.site_header = "JTC"
admin.site.site_title = "JTC Admin Portal"
admin.site.index_title = "JTC Admin"

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if not settings.DEBUG:
    urlpatterns += [re_path(r".*", TemplateView.as_view(template_name='index.html'))]
