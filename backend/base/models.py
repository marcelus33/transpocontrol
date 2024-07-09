from django.db import models

from base.helpers import Vehicle, CommercialParty


class Client(CommercialParty):
    legal_denomination = models.CharField(max_length=100, blank=True, null=True)
    city = models.ForeignKey('cities_light.City', on_delete=models.SET_NULL, blank=True, null=True)
    image = models.ImageField(upload_to='clients', blank=True, null=True)


class Supplier(CommercialParty):
    image = models.ImageField(upload_to='suppliers', blank=True, null=True)


class Owner(models.Model):
    name = models.CharField(max_length=100)
    SEX_CHOICES = [
        ('F', 'Femenino'),
        ('M', 'Masculino'),
    ]
    gender = models.CharField(max_length=1, choices=SEX_CHOICES, null=True, blank=True)
    birthday = models.DateField(blank=True, null=True)
    id_number = models.CharField(max_length=20)  # CI
    ruc = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    observation = models.TextField(blank=True, null=True)
    city = models.ForeignKey('cities_light.City', on_delete=models.PROTECT, null=True, blank=True)
    image = models.ImageField(upload_to='Owners', null=True, blank=True)


class Driver(models.Model):
    name = models.CharField(max_length=100)
    SEX_CHOICES = [
        ('F', 'Femenino'),
        ('M', 'Masculino'),
    ]
    gender = models.CharField(max_length=1, choices=SEX_CHOICES)
    birthday = models.DateField(blank=True, null=True)
    id_number = models.CharField(max_length=20)  # CI
    ruc = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    observation = models.TextField(blank=True, null=True)
    contract = models.ImageField(upload_to='contract', null=True, blank=True)
    image = models.ImageField(upload_to='image', null=True, blank=True)


class Truck(Vehicle):
    authorized_company = models.ForeignKey(Client, on_delete=models.PROTECT, null=True, blank=True)
    brand = models.CharField(max_length=100)
    image = models.ImageField(upload_to='trucks', null=True, blank=True)


class Trailer(Vehicle):
    image = models.ImageField(upload_to='trailers', null=True, blank=True)
    length = models.FloatField(blank=True, null=True)
    width = models.FloatField(blank=True, null=True)
    height = models.FloatField(blank=True, null=True)


class SupplyStorage(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200, null=True, blank=True)


class Supply(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    quantity = models.IntegerField(default=0)
    storage = models.ForeignKey('SupplyStorage', on_delete=models.SET_NULL, related_name="supplies",
                                null=True, blank=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField()

    def __str__(self):
        return self.name
