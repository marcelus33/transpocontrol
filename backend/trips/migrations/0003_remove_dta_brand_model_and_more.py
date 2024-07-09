# Generated by Django 5.0.4 on 2024-06-24 18:09

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0008_merge_20240624_1409'),
        ('trips', '0002_dta_driver_1_dta_driver_2_dta_extra_1_dta_extra_2'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dta',
            name='brand_model',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='substitute_brand_model',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='substitute_towing_capacity',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='substitute_trailer_license_plate',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='substitute_truck_license_plate',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='substitute_truck_owner',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='substitute_truck_owner_rol_del_contribuyente',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='substitute_truck_year',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='towing_capacity',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='trailer_license_plate',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='truck_license_plate',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='truck_owner',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='truck_owner_rol_del_contribuyente',
        ),
        migrations.RemoveField(
            model_name='dta',
            name='truck_year',
        ),
        migrations.AddField(
            model_name='dta',
            name='substitute_trailer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dta_substitute_trailer', to='base.trailer'),
        ),
        migrations.AddField(
            model_name='dta',
            name='substitute_truck',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dta_substitute_truck', to='base.truck'),
        ),
        migrations.AddField(
            model_name='dta',
            name='trailer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dta_trailer', to='base.trailer'),
        ),
        migrations.AddField(
            model_name='dta',
            name='truck',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dta_truck', to='base.truck'),
        ),
    ]
