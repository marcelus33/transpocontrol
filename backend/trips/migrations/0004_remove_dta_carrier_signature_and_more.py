# Generated by Django 5.0.4 on 2024-06-24 18:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trips', '0003_remove_dta_brand_model_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dta',
            name='carrier_signature',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='customs_signature',
        ),
    ]
