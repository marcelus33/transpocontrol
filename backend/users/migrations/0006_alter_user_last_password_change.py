# Generated by Django 5.0.4 on 2024-05-16 17:33

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_user_last_password_change'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='last_password_change',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
