# Generated by Django 5.0.4 on 2024-06-20 21:17

import django.db.models.deletion
import djmoney.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0003_supplierinvoice_payment_term_supplierinvoiceitem'),
        ('trips', '0004_remove_dta_carrier_signature_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='crt',
            name='cif_name',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='crt',
            name='cif_value',
            field=djmoney.models.fields.MoneyField(decimal_places=2, default_currency='USD', max_digits=15, null=True),
        ),
        migrations.AddField(
            model_name='crt',
            name='cif_value_currency',
            field=djmoney.models.fields.CurrencyField(choices=[('ARS', 'Argentine Peso'), ('BOB', 'Bolivian Boliviano'), ('BRL', 'Brazilian Real'), ('CLP', 'Chilean Peso'), ('PYG', 'Paraguayan Guarani'), ('PEN', 'Peruvian Sol'), ('USD', 'US Dollar'), ('UYU', 'Uruguayan Peso')], default='USD', editable=False, max_length=3, null=True),
        ),
        migrations.AddField(
            model_name='crt',
            name='export_invoice',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='issued_crts', to='invoice.supplierinvoice'),
        ),
        migrations.AddField(
            model_name='crt',
            name='fob_name',
            field=models.TextField(blank=True, null=True),
        ),
    ]
