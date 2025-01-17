# Generated by Django 5.0.4 on 2024-05-23 15:14

import django.db.models.deletion
import djmoney.models.fields
from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0002_supplierinvoice_outstanding_amount_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='supplierinvoice',
            name='payment_term',
            field=models.IntegerField(choices=[(1, 'Contado'), (2, 'Crédito')], default=2),
        ),
        migrations.CreateModel(
            name='SupplierInvoiceItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('description', models.TextField()),
                ('unit_price_currency', djmoney.models.fields.CurrencyField(choices=[('ARS', 'Argentine Peso'), ('BOB', 'Bolivian Boliviano'), ('BRL', 'Brazilian Real'), ('CLP', 'Chilean Peso'), ('PYG', 'Paraguayan Guarani'), ('PEN', 'Peruvian Sol'), ('USD', 'US Dollar'), ('UYU', 'Uruguayan Peso')], default='PYG', editable=False, max_length=3)),
                ('unit_price', djmoney.models.fields.MoneyField(decimal_places=2, default_currency='PYG', max_digits=14)),
                ('tax_type', models.IntegerField(choices=[(5, 'IVA 5%'), (10, 'IVA 10%'), (0, 'Exenta')])),
                ('tax_amount_currency', djmoney.models.fields.CurrencyField(choices=[('ARS', 'Argentine Peso'), ('BOB', 'Bolivian Boliviano'), ('BRL', 'Brazilian Real'), ('CLP', 'Chilean Peso'), ('PYG', 'Paraguayan Guarani'), ('PEN', 'Peruvian Sol'), ('USD', 'US Dollar'), ('UYU', 'Uruguayan Peso')], default='PYG', editable=False, max_length=3)),
                ('tax_amount', djmoney.models.fields.MoneyField(decimal_places=2, default=Decimal('0'), default_currency='PYG', max_digits=14)),
                ('item_total_currency', djmoney.models.fields.CurrencyField(choices=[('ARS', 'Argentine Peso'), ('BOB', 'Bolivian Boliviano'), ('BRL', 'Brazilian Real'), ('CLP', 'Chilean Peso'), ('PYG', 'Paraguayan Guarani'), ('PEN', 'Peruvian Sol'), ('USD', 'US Dollar'), ('UYU', 'Uruguayan Peso')], default='PYG', editable=False, max_length=3)),
                ('item_total', djmoney.models.fields.MoneyField(decimal_places=2, default=Decimal('0'), default_currency='PYG', max_digits=14)),
                ('invoice', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='invoice.supplierinvoice')),
            ],
        ),
    ]
