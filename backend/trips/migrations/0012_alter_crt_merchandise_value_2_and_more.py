# Generated by Django 5.0.4 on 2024-07-08 13:44

import djmoney.models.fields
from decimal import Decimal
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trips', '0011_alter_crtindex_enumeration_alter_crtindex_year_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='crt',
            name='merchandise_value_2',
            field=djmoney.models.fields.MoneyField(decimal_places=2, default=Decimal('0'), default_currency='USD', max_digits=15, null=True),
        ),
        migrations.AlterField(
            model_name='crt',
            name='merchandise_value_2_currency',
            field=djmoney.models.fields.CurrencyField(choices=[('ARS', 'Argentine Peso'), ('BOB', 'Bolivian Boliviano'), ('BRL', 'Brazilian Real'), ('CLP', 'Chilean Peso'), ('PYG', 'Paraguayan Guarani'), ('PEN', 'Peruvian Sol'), ('USD', 'US Dollar'), ('UYU', 'Uruguayan Peso')], default='USD', editable=False, max_length=3, null=True),
        ),
    ]
