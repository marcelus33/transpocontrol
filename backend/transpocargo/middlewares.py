from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone

from transpocargo.redis_cache import redis_save_last_activity

User = get_user_model()

class UpdateLastActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        user = request.user
        if user.is_authenticated:
            current_time = timezone.now()
            # Check if more than an hour has passed since the last activity
            redis_save_last_activity(user.id, current_time)
            if not user.last_activity or (current_time - user.last_activity) > timedelta(hours=1):
                user.last_activity = current_time
                user.save()
        return response