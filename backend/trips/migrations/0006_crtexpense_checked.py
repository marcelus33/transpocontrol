# Generated by Django 5.0.4 on 2024-06-24 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trips', '0005_crt_cif_name_crt_cif_value_crt_cif_value_currency_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='crtexpense',
            name='checked',
            field=models.BooleanField(default=False),
        ),
    ]
