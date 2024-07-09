from django.db import models
from djmoney.models.fields import MoneyField

from base.models import Supplier


class PaymentTerm(models.IntegerChoices):
    CASH = 1, 'Contado'
    CREDIT = 2, 'Crédito'


class TaxType(models.IntegerChoices):
    IVA_5 = 5, 'IVA 5%'
    IVA_10 = 10, 'IVA 10%'
    EXEMPT = 0, 'Exenta'


class SupplierInvoice(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, related_name='invoices')
    number = models.CharField(max_length=100)
    date = models.DateField()
    payment_term = models.IntegerField(choices=PaymentTerm.choices, default=PaymentTerm.CREDIT)
    due_date = models.DateField(blank=True, null=True)
    total_tax_amount = MoneyField(max_digits=14, decimal_places=2, default=0, default_currency='PYG')
    outstanding_amount = MoneyField(max_digits=14, decimal_places=2, default=0, default_currency='PYG')
    paid_amount = MoneyField(max_digits=14, decimal_places=2, default=0, default_currency='PYG')
    total_amount = MoneyField(max_digits=14, decimal_places=2, default=0, default_currency='PYG')
    observation = models.TextField(null=True, blank=True)
    is_annulled = models.BooleanField(default=False, verbose_name="Annulled")


class SupplierInvoiceItem(models.Model):
    invoice = models.ForeignKey(SupplierInvoice, on_delete=models.CASCADE, related_name='items')
    quantity = models.PositiveIntegerField(default=1)
    # product = models.ForeignKey()
    description = models.TextField()
    unit_price = MoneyField(max_digits=14, decimal_places=2, default_currency='PYG')
    tax_type = models.IntegerField(choices=TaxType.choices)
    tax_amount = MoneyField(max_digits=14, decimal_places=2, default=0, default_currency='PYG')
    item_total = MoneyField(max_digits=14, decimal_places=2, default=0, default_currency='PYG')

