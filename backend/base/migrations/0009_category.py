# Generated by Django 5.0.4 on 2024-07-04 20:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0008_merge_20240624_1409'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField()),
            ],
        ),
    ]
