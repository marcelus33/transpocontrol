# Generated by Django 5.0.4 on 2024-05-16 13:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_user_change_password_next_login_user_description_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='last_password_change',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
