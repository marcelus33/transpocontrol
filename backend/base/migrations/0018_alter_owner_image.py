# Generated by Django 5.0.4 on 2024-07-05 18:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0017_driver_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='owner',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='Owners'),
        ),
    ]
