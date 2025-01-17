"""
Django settings for jtc project.

Generated by 'django-admin startproject' using Django 2.2.2.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import io
import logging
import os
from datetime import timedelta

import environ

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

env_file = os.path.join(BASE_DIR, ".env")
env = environ.Env()
env.read_env(env_file)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DEBUG", default=False)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env.str("SECRET_KEY")

ALLOWED_HOSTS = env.list("HOST", default=["*"])
SITE_ID = 1

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = env.bool("SECURE_REDIRECT", default=False)

# Application definition

INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'djmoney',
]
LOCAL_APPS = [
    'home',
    'utils',
    'configuration',
    'users.apps.UsersConfig',
    'base',
    'invoice',
    'trips',
]
THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'rest_framework_simplejwt',
    'corsheaders',
    'phonenumber_field',
    'django_json_widget',
    'django_extensions',
    'drf_spectacular',
    'storages',
    'encrypted_model_fields',
    'webshell',
    'cities_light',
]

INSTALLED_APPS += LOCAL_APPS + THIRD_PARTY_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'users.middleware.threadlocalmiddleware.ThreadLocalMiddleware',
    'jtc.middlewares.UpdateLastActivityMiddleware',
]

OVERRIDE_REDIS_URL = env.str("OVERRIDE_REDIS_URL", None)
REDIS_URL = OVERRIDE_REDIS_URL or env.str("REDIS_URL", "redis://redis:6379/0")

REDIS_PARAMS = dict(ssl_cert_reqs=None) if REDIS_URL.startswith("rediss:") else dict()

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_URL,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "IGNORE_EXCEPTIONS": True,
            "REDIS_CLIENT_KWARGS": REDIS_PARAMS,
            "CONNECTION_POOL_KWARGS": {
                # "max_connections": 40,
                **REDIS_PARAMS,
            },
        }
    }
}

ROOT_URLCONF = 'jtc.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'web_build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'jtc.wsgi.application'

JAZZMIN_SETTINGS = {
    "site_logo": "img/logo.png",
    "site_title": "JTC",
    "site_logo_classes": "img-logo",
    "login_logo": "img/logo.png",
    "icons": {
        "clients.Request": "fas fa-arrow-up",
        "clients.Seeker": "fas fa-heart",
        "clients.Specialist": "fas fa-users",
        "clients.Gender": "fas fa-venus-mars",
        "privacy_policy.PrivacyPolicy": "fas fa-file",
        "terms_and_conditions.TermAndCondition": "fas fa-file",
        "configuration.Configuration": "fas fa-cogs",
        "specialties.Specialty": "fas fa-star",
        "users.User": "fas fa-user",
    },
    "hide_apps": ['authtoken', 'auth', 'cities_light', 'sites'],
    "hide_models": ['support.category'],
    "order_with_respect_to": ["clients", "clients.request", "clients.seeker", "clients.specialist", "specialties",
                              "users", "privacy_policy", "terms_and_conditions", "configurations"],
    # "show_ui_builder": True,
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-white",
    # "accent": "accent-maroon",
    "navbar": "navbar-white navbar-light",
    "no_navbar_border": False,
    "navbar_fixed": False,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    # "sidebar": "sidebar-light-pink",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": False,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": True,
    "theme": "lux",
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-outline-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success"
    },
    "actions_sticky_top": False
}

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

if env.str("DATABASE_URL", default=None):
    DATABASES = {
        'default': env.db()
    }

# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

if DEBUG:
    AUTH_PASSWORD_VALIDATORS = []

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'es-py'
TIME_ZONE = 'America/Asuncion'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'

MIDDLEWARE += ['whitenoise.middleware.WhiteNoiseMiddleware']

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static'), os.path.join(BASE_DIR, 'web_build/static')]
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

MEDIA_URL = '/mediafiles/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'mediafiles')

REDIRECT_DEEP_LINK = env.str("REDIRECT_DEEP_LINK", "JTC")

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

REST_AUTH_SERIALIZERS = {
    # Replace password reset serializer to fix 500 error
    "PASSWORD_RESET_SERIALIZER": "home.api.v1.serializers.PasswordSerializer",
    "USER_DETAILS_SERIALIZER": "users.serializers.UserDetailSerializer",
}

REST_FRAMEWORK = {
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 25,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'dj_rest_auth.jwt_auth.JWTCookieAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
}

REST_AUTH = {
    'USE_JWT': True,
    "USER_DETAILS_SERIALIZER": "users.serializers.UserDetailSerializer",
    "JWT_AUTH_HTTPONLY": False,
    'JWT_AUTH_REFRESH_COOKIE': 'my-refresh-token',
    "REGISTER_SERIALIZER": "users.serializers.SignupSerializer",
}

REST_AUTH_REGISTER_SERIALIZERS = {
    # Use custom serializer that has no username and matches web signup
    "REGISTER_SERIALIZER": "users.serializers.SignupSerializer",
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# THE BLOCK TOKEN
THE_BLOCK_TOKEN = env.str("THE_BLOCK_TOKEN", "")

# Custom user model
AUTH_USER_MODEL = "users.User"

EMAIL_HOST = env.str("EMAIL_HOST", "smtp.sendgrid.net")
EMAIL_HOST_USER = env.str("SENDGRID_USERNAME", "")
EMAIL_HOST_PASSWORD = env.str("SENDGRID_PASSWORD", "")
DEFAULT_FROM_EMAIL = env.str("DEFAULT_FROM_EMAIL", "")
EMAIL_PORT = 587
EMAIL_USE_TLS = True

SPECTACULAR_SETTINGS = {
    "SWAGGER_UI_SETTINGS": {
        "deepLinking": True,
        "persistAuthorization": True,
        "displayOperationId": True,
    },
    "SERVE_PERMISSIONS": ["rest_framework.permissions.IsAuthenticated"]
    if not DEBUG else ["rest_framework.permissions.AllowAny"],
    "TITLE": "JTC (jtc) API",
    "DESCRIPTION": "API documentation for JTC (jtc) App",
    "VERSION": "v1",
    'TAGS': [
        {'name': 'Authentication', 'description': 'All API endpoints related to authentication.'},
        {'name': 'Users', 'description': 'All API endpoints related to users'},
        {'name': 'Users Groups', 'description': 'All API endpoints related to user groups'},
        {'name': 'Clients', 'description': 'All API endpoints related to clients'},
        {'name': 'Drivers', 'description': 'All API endpoints related to drivers'},
        {'name': 'Configurations', 'description': 'All API endpoints related to configurations'},
        {'name': 'Owners', 'description': 'All API endpoints related to owners'},
        {'name': 'Suppliers', 'description': 'All API endpoints related to suppliers'},
        {'name': 'Invoices', 'description': 'All API endpoints related to invoices'},
        {'name': 'DTAs', 'description': 'All API endpoints related to DTAs'},
        {'name': 'Customs', 'description': 'All API endpoints related to customs'},
        # Add more tags as needed
    ],
}

# DJANGO MONEY
CURRENCIES = ('USD', 'PYG', 'BOB', 'ARS', 'BRL', 'UYU', 'CLP', 'PEN')

if DEBUG or not (EMAIL_HOST_USER and EMAIL_HOST_PASSWORD):
    # output email to console instead of sending
    if not DEBUG:
        logging.warning("You should setup `SENDGRID_USERNAME` and `SENDGRID_PASSWORD` env vars to send emails.")
    # EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

CORS_ALLOW_ALL = DEBUG
CORS_ALLOW_ALL_ORIGINS = DEBUG
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://0.0.0.0:8000',
    'http://0.0.0.0:3000',
]

CORS_EXPOSE_HEADERS = [
    'content-disposition',
]

ONESIGNAL_APP_ID = env.str("ONESIGNAL_APP_ID", "")
ONESIGNAL_REST_API_KEY = env.str("ONESIGNAL_REST_API_KEY", "")
ONESIGNAL_USER_AUTH_KEY = env.str("ONESIGNAL_USER_AUTH_KEY", "")

if not DEBUG:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration

    sentry_sdk.init(
        dsn="https://2fecbed8d0b540919b386739e0a76dc9@sentry.transpocargo.com.py//43",
        integrations=[
            DjangoIntegration(),
        ],

        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production.
        traces_sample_rate=1.0,

        # If you wish to associate users to errors (assuming you are using
        # django.contrib.auth) you may enable sending PII data.
        send_default_pii=True
    )

CELERY_BROKER_URL = CELERY_RESULT_BACKEND = env.str("REDIS_URL", "redis://redis:6379/")

CITIES_LIGHT_DATA_DIR = os.path.join(BASE_DIR, 'cities')
CITIES_LIGHT_TRANSLATION_LANGUAGES = ['es']
CITIES_LIGHT_INCLUDE_COUNTRIES = ['PY', 'AR', 'UY', 'CL', 'BR', 'BO', 'PE']
