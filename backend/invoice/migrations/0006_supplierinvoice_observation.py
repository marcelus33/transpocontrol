# Generated by Django 5.0.4 on 2024-06-25 14:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0005_supplierinvoice_is_annulled'),
    ]

    operations = [
        migrations.AddField(
            model_name='supplierinvoice',
            name='observation',
            field=models.TextField(blank=True, null=True),
        ),
    ]
