# Generated by Django 5.0.4 on 2024-06-24 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0004_supplierinvoice_total_tax_amount_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='supplierinvoice',
            name='is_annulled',
            field=models.BooleanField(default=False, verbose_name='Annulled'),
        ),
    ]
