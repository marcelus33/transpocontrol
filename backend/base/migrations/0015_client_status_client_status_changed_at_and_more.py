# Generated by Django 5.0.4 on 2024-07-05 12:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0014_trailer_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='status',
            field=models.CharField(choices=[(1, 'active'), (2, 'removed')], default=1, max_length=10),
        ),
        migrations.AddField(
            model_name='client',
            name='status_changed_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='supplier',
            name='status',
            field=models.CharField(choices=[(1, 'active'), (2, 'removed')], default=1, max_length=10),
        ),
        migrations.AddField(
            model_name='supplier',
            name='status_changed_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='trailer',
            name='status',
            field=models.CharField(choices=[(1, 'active'), (2, 'removed')], default=1, max_length=10),
        ),
        migrations.AddField(
            model_name='trailer',
            name='status_changed_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='truck',
            name='status',
            field=models.CharField(choices=[(1, 'active'), (2, 'removed')], default=1, max_length=10),
        ),
        migrations.AddField(
            model_name='truck',
            name='status_changed_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
