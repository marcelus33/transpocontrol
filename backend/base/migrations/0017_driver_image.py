# Generated by Django 5.0.4 on 2024-07-05 18:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0016_trailer_height_trailer_length_trailer_width'),
    ]

    operations = [
        migrations.AddField(
            model_name='driver',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='image'),
        ),
    ]