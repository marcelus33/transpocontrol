from django.utils.deprecation import MiddlewareMixin
from threading import local

TIMEZONE_ATTR_NAME = "_current_timezone"

_thread_locals = local()


def get_current_timezone():
    """
   Get current timezone to thread local storage.
   """
    return getattr(_thread_locals, TIMEZONE_ATTR_NAME, None)


class ThreadLocalMiddleware(MiddlewareMixin):
    """
   Middleware that gets timezone from the
   request and saves it in thread local storage.
   """

    def process_request(self, request):
        # Handles current user timezone.
        current_timezone = request.META.get("HTTP_CLIENT_LOCATION", "UTC")
        setattr(_thread_locals, TIMEZONE_ATTR_NAME, current_timezone)