from django.contrib.auth.models import AbstractUser, Group
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True)
    password_never_expires = models.BooleanField(default=False)
    password_expiry_days = models.IntegerField(blank=True, null=True)
    change_password_next_login = models.BooleanField(default=False)  # Debe cambiar password en el siguiente login
    last_password_change = models.DateTimeField(default=timezone.now)
    last_activity = models.DateTimeField(auto_now=True)
    status_changed_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-id']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def save(self, *args, **kwargs):
        """
        Custom save method to handle 'is_active' changes.
        """
        if self.pk:
            original = type(self).objects.get(pk=self.pk)
            if original.is_active != self.is_active:
                self.status_changed_at = timezone.now()

        super().save(*args, **kwargs)

    @property
    def is_admin(self):
        return self.is_superuser or self.groups.filter(name='Admin').exists()

    def set_password(self, raw_password):
        self.last_password_change = timezone.now()
        super().set_password(raw_password)

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})


def code_live_time():
    """
    Return the expiration time for the verification code
    """
    return timezone.now() + timezone.timedelta(hours=1)


class UserVerificationCode(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    verification_code = models.CharField(_("Verification code"), max_length=6)
    expires_on = models.DateTimeField(_("Expires On"), default=code_live_time)
    timestamp = models.DateTimeField(_("Timestamp"), auto_now_add=True)
    active = models.BooleanField(default=True)
