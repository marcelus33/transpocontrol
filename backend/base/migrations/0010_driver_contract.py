# Generated by Django 5.0.4 on 2024-07-04 20:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='driver',
            name='contract',
            field=models.ImageField(blank=True, null=True, upload_to='contract'),
        ),
    ]
