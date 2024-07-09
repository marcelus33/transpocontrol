import asyncio
import functools

import phonenumbers
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.http import HttpResponse, FileResponse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework.exceptions import ValidationError
from urllib.parse import quote

from rest_framework.pagination import PageNumberPagination


User = get_user_model()

flat_map = lambda f, xs: (y for ys in xs for y in f(ys))


def querydict_to_dict(query_dict):
    data = {}
    for key in query_dict.keys():
        v = query_dict.getlist(key)
        if len(v) == 1:
            v = v[0]
        data[key] = v
    return data


def get_user_by_uidb64(uidb64):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User._default_manager.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist, ValidationError):
        user = None
    return user


def may_fail(cls_exc, detail='', *args_outer, wrapper_exc=ValidationError, append_exc_msg=False, **kwargs_outer):
    def decorator(func):

        if asyncio.iscoroutinefunction(func):
            @functools.wraps(func)
            async def asyncwrapper(*args, **kwargs):
                try:
                    return await func(*args, **kwargs)
                except cls_exc as exc:
                    raise wrapper_exc(detail + (getattr(exc, 'msg', str(exc)) if append_exc_msg else ''), *args_outer, **kwargs_outer)

            return asyncwrapper
        else:
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                try:
                    return func(*args, **kwargs)
                except cls_exc as exc:
                    raise wrapper_exc(detail + (getattr(exc, 'msg', str(exc)) if append_exc_msg else ''), *args_outer, **kwargs_outer)

            return wrapper

    return decorator


def content_disposition_header(as_attachment, filename):
    """
    Construct a Content-Disposition HTTP header value from the given filename
    as specified by RFC 6266.
    """
    if filename:
        disposition = "attachment" if as_attachment else "inline"
        try:
            filename.encode("ascii")
            file_expr = 'filename="{}"'.format(
                filename.replace("\\", "\\\\").replace('"', r"\"")
            )
        except UnicodeEncodeError:
            file_expr = "filename*=utf-8''{}".format(quote(filename))
        return f"{disposition}; {file_expr}"
    elif as_attachment:
        return "attachment"
    else:
        return None


def file_response(content, *args, content_type=None, filename=None, **kwargs):
    response = HttpResponse(content, *args, content_type=content_type, **kwargs)
    if content_disposition := content_disposition_header(True, filename):
        response.headers["Content-Disposition"] = content_disposition
    return response


def tuple_defaults(input, size, defaults):
    filling = list(defaults)[::-1][:size - len(input)][::-1]  # TODO better
    return (tuple(input) + tuple(filling))[:size]


def get_country_code_for_phonenumber(e164_number, raise_exception=False):
    try:
        if isinstance(e164_number, str):

            # Parse the E.164 formatted phone number
            parsed_number = phonenumbers.parse(e164_number, None)
        else:
            parsed_number = e164_number

        # Get the country code in ISO 3166-1 alpha-2 format
        country_code = phonenumbers.region_code_for_number(parsed_number)

        return country_code

    except phonenumbers.NumberParseException:
        if raise_exception:
            raise Exception("Invalid phone number")
        return None


def update_with_kwargs(self, kwargs):
    for name, value in kwargs.items():
        setattr(self, name, value)
    self.save()


def create_user_activation_link(user, request):
    confirmation_token = default_token_generator.make_token(user)
    activation_link = (f'{request.scheme}://{request.get_host()}/api/v1/redirect/'
                       f'{urlsafe_base64_encode(force_bytes(user.pk))}-_-{confirmation_token}/')
    return activation_link


class DefaultPagination(PageNumberPagination):
    page_size = 10
    page_query_param = 'page'
    page_size_query_param = 'page_size'

#
# def send_notifications(
#         users,
#         title,
#         description,
#         extra_data = None,
#         n_type = Notification.NotificationType.DEFAULT,
#         channel = Notification.NotificationChannel.PUSH,
#         from_user = None
# ):
#     notification = Notification.objects.create(
#         title=title,
#         description=description,
#         extra_data=extra_data,
#         type=n_type,
#         channel=channel,
#         from_user=from_user
#     )
#     notification.targets.set(users)
#     notification.send()