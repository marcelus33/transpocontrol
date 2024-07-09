from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes


def generate_reset_url(user, request):
    temp_key = default_token_generator.make_token(user)
    url = f"{request.scheme}://{request.get_host()}/set-new-password/{urlsafe_base64_encode(force_bytes(user.pk))}/{temp_key}"
    return url

