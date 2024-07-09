# Generated by Django 5.0.4 on 2024-05-29 21:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0004_supplier_client_trailer_truck'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trailer',
            name='chassis',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='trailer',
            name='plate',
            field=models.CharField(max_length=20, unique=True),
        ),
        migrations.AlterField(
            model_name='truck',
            name='chassis',
            field=models.CharField(max_length=100, unique=True),
        ),
        migrations.AlterField(
            model_name='truck',
            name='plate',
            field=models.CharField(max_length=20, unique=True),
        ),
    ]