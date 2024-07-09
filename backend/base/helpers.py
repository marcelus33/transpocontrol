from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class CommercialParty(models.Model):
    """
    Abstract parent model for Client & Supplier.
    """

    class StatusChoices(models.IntegerChoices):
        ACTIVE = (1, 'active')
        REMOVED = (2, 'removed')

    name = models.CharField(max_length=100)
    ruc = models.CharField(max_length=20)
    address = models.CharField(max_length=200, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    observation = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=StatusChoices.choices, default=StatusChoices.ACTIVE)
    status_changed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        """
        Custom save method to handle 'status' changes.
        """
        if self.pk:
            original = type(self).objects.get(pk=self.pk)
            if original.status != self.status:
                self.status_changed_at = timezone.now()

        super().save(*args, **kwargs)


class Vehicle(models.Model):
    """
    Abstract parent model for Truck & Trailer.
    """

    class StatusChoices(models.IntegerChoices):
        ACTIVE = (1, 'active')
        REMOVED = (2, 'removed')

    owner = models.ForeignKey('Owner', on_delete=models.PROTECT, null=True, blank=True)
    driver = models.ForeignKey('Driver', on_delete=models.SET_NULL, null=True, blank=True)
    type = models.CharField(max_length=100, null=True, blank=True)
    year = models.IntegerField()
    axles = models.IntegerField(null=True, blank=True)  # ejes
    plate = models.CharField(max_length=20, unique=True)  # matricula
    body = models.CharField(max_length=100, null=True, blank=True)  # carroceria
    chassis = models.CharField(max_length=100, unique=True)
    load_capacity = models.CharField(max_length=100, null=True, blank=True)  # carga
    vehicle_no = models.CharField(max_length=20, null=True, blank=True)
    observation = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=StatusChoices.choices, default=StatusChoices.ACTIVE)
    status_changed_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        """
        Custom save method to handle 'status' changes and make unique values available for new instances.
        Instances of models that inherit from Vehicle are not allowed to be reactivated.
        """
        if self.pk:
            original = type(self).objects.get(pk=self.pk)
            if original.status != self.status:
                if original.status == Vehicle.StatusChoices.REMOVED and self.status == Vehicle.StatusChoices.ACTIVE:
                    raise ValidationError("Cannot change status from 'removed' back to 'active'.")

                if self.status == Vehicle.StatusChoices.REMOVED:
                    if not self.plate.endswith('-removed'):
                        self.plate += '-removed'
                    if not self.chassis.endswith('-removed'):
                        self.chassis += '-removed'
                self.status_changed_at = timezone.now()
        super().save(*args, **kwargs)
