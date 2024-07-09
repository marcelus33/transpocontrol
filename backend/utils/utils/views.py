import asyncio
import functools
import json
import re
import zoneinfo
from functools import wraps

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import parsers, status
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.settings import api_settings

from utils.utils.misc import querydict_to_dict


def assign_on_path(obj, path, obj_to_assign, is_obj_or_dict=False):
    """
        asign something onto a nested object based on a path
        {house:
           [
             {name: room1},
             {name: None},
           ]
        }
        assigning with the following path: house.[1].name
        can assign what you want to the field that says None in the example
    """
    arr_regx = re.compile(r'^\[(\d+)]$')

    def assign_on_path_internal(obj2, path_arr, obj_to_assign2):
        if len(path_arr) == 1:
            if match := arr_regx.match(path_arr[0]):
                obj2[int(match.group(1))] = obj_to_assign2
            else:
                if is_obj_or_dict:
                    setattr(obj2, path_arr[0], obj_to_assign2)
                else:
                    obj2[path_arr[0]] = obj_to_assign2
        else:
            head, tail = path_arr[0], path_arr[1:]
            if match := arr_regx.match(head):
                assign_on_path_internal(obj2[int(match.group(1))], tail, obj_to_assign2)
            else:
                assign_on_path_internal(getattr(obj2, head) if is_obj_or_dict else obj2[head], tail, obj_to_assign2)

    assign_on_path_internal(obj, path.split('.'), obj_to_assign)


class MultipartCollectedJsonParserMediaUpload(parsers.MultiPartParser):
    """
      Accepts a multipart request, and recombines the files onto the nested json object expected in the 'data' field
      the files must come with the full path with the object to recombine. example:  house.[1].furnitures.[0].name
    """

    def parse(self, stream, media_type=None, parser_context=None):
        result = super().parse(
            stream,
            media_type=media_type,
            parser_context=parser_context
        )

        try:
            data = json.loads(result.data["data"])
            files = querydict_to_dict(result.files)
            for path, file in files.items():
                assign_on_path(data, path, file)
        except (ValueError, KeyError, AttributeError):
            raise ValidationError('Wrong multipart request format')

        return data


class CollectedMultipartJsonViewMixin:
    parser_classes = (MultipartCollectedJsonParserMediaUpload, parsers.JSONParser)


class PostViewsetMixin:
    # entry point
    def create(self, request, *args, **kwargs):
        self.action = 'simple_post'
        return self.simple_post(request, *args, **kwargs)

    def simple_post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = self.perform_post(serializer)
        if result and isinstance(result, HttpResponse):  # Response or HttpResponse
            return result
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)

    def perform_post(self, serializer):
        # OVERRIDE THIS
        pass

    def get_success_headers(self, data):
        try:
            return {'Location': str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}


class GetViewsetMixin:
    # entry point
    def list(self, request, *args, **kwargs):
        self.action = 'simple_get'
        return self.simple_get(request, *args, **kwargs)

    def simple_get(self, request, *args, **kwargs):
        # OVERRIDE THIS
        return Response(dict(), status=status.HTTP_200_OK)


def get_and_validate_serializer(func):
    # TODO args_outer?
    if asyncio.iscoroutinefunction(func):
        @functools.wraps(func)
        async def asyncwrapper(self, request, *args, **kwargs):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            return await func(self, request, serializer, *args, **kwargs)

        return asyncwrapper
    else:
        @functools.wraps(func)
        def wrapper(self, request, *args, **kwargs):
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            return func(self, request, serializer, *args, **kwargs)

        return wrapper


def wrap_response(response_class=HttpResponse):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            response = func(*args, **kwargs)
            if isinstance(response, Response):
                return response
            else:
                return response_class(response)

        return wrapper

    return decorator


class GenericCustomPagination(PageNumberPagination):
    """
    Generic custom pagination class for adjust page size dynamically.
    """
    page_size_query_param = 'page_size'
    default_page_size = 10

    def paginate_queryset(self, queryset, request, view=None):
        """
        Overwritting the paginate_queryset method in order to list all or adjust the size of GenericCustomPagination.
        """
        page_size = request.query_params.get(self.page_size_query_param)

        if page_size is None:
            self.page_size = self.default_page_size
        elif page_size == 'all':
            self.page_size = queryset.count()
        elif page_size.isdigit() and int(page_size) > 0:
            self.page_size = int(page_size)
        return super().paginate_queryset(queryset, request, view)


RETRIEVE = 'retrieve'
LIST = 'list'
CREATE = 'create'
UPDATE = 'update'
PARTIAL_UPDATE = 'partial_update'
DESTROY = 'destroy'
SIMPLE_POST = 'simple_post'
SIMPLE_GET = 'simple_get'


class SerializerClassByActionMixin:
    def get_serializer_class(self):
        default = getattr(self, 'serializer_class', None)
        if hasattr(self, 'action_serializers'):
            if self.action in self.action_serializers:
                return self.action_serializers[self.action]
            else:
                for k, v in self.action_serializers.items():
                    if isinstance(k, tuple) and self.action in k:
                        return v
            return default

        raise ImproperlyConfigured(
            "SerializerByActionMixin requires a definition of 'action_serializers'"
        )


class PermissionClassByActionMixin:
    def get_permissions(self):
        default = getattr(self, 'permission_classes', None)
        if hasattr(self, 'action_permissions'):
            if self.action in self.action_permissions:
                self.permission_classes = self.action_permissions[self.action]
                return super().get_permissions()
            else:
                for k, v in self.action_permissions.items():
                    if isinstance(k, tuple) and self.action in k:
                        self.permission_classes = v
                        return super().get_permissions()
            self.permission_classes = default
            return super().get_permissions()

        raise ImproperlyConfigured(
            "PermissionByActionMixin requires a definition of 'action_permissions'"
        )


class OneToOneToUserMixin:

    def get_object(self):
        if not self.request.user or self.request.user.is_anonymous:
            raise ValidationError('User not found')
        if hasattr(self, 'onetoone_field'):
            value = self.request.user
            for path in self.onetoone_field.split('.'):
                value = getattr(value, path)

                if not value:
                    raise ValidationError('User or related data not found')  # TODO better

            return value

        raise ImproperlyConfigured(
            "OneToOneToUserMixin requires a definition of 'onetoone_field'"
        )


class TimezoneHeaderContextMixin:
    activate_timezone = True  # override if needed

    def get_serializer_context(self):
        tz = self.get_timezone()
        return {**super().get_serializer_context(), 'timezone': tz}

    def get_timezone(self):
        try:
            return zoneinfo.ZoneInfo(self.request.META.get("HTTP_CLIENT_LOCATION", settings.TIME_ZONE))
        except zoneinfo.ZoneInfoNotFoundError:
            return zoneinfo.ZoneInfo(settings.TIME_ZONE)

    def initialize_request(self, request, *args, **kwargs):
        """
        Set the `.action` attribute on the view, depending on the request method.
        """
        tz = self.get_timezone()
        if self.activate_timezone:
            timezone.activate(tz)

        request = super().initialize_request(request, *args, **kwargs)
        return request
