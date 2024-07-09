import logging
from random import random

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template import loader
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from transpocargo import settings

LOGGER = logging.getLogger('django')

def send_email_with_template(subject, email, context, template_to_load):
    """
    Send an email with an HTML template to the specified email address.
    """
    template = loader.get_template(template_to_load)
    html_content = template.render(context)
    send_mail(
        subject,
        html_content,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        html_message=html_content,
    )


def send_email(user_email, subject, text_content):
    try:
        from_email, to = settings.DEFAULT_FROM_EMAIL, user_email
        html_content = text_content
        msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

    except Exception as e:
        LOGGER.exception('Email sending failed: {}'.format(e))