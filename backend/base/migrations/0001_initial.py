# Generated by Django 5.0.4 on 2024-05-10 17:28

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Driver',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('gender', models.CharField(choices=[('F', 'Femenino'), ('M', 'Masculino')], max_length=1)),
                ('birthday', models.DateField(blank=True, null=True)),
                ('id_number', models.CharField(max_length=20)),
                ('ruc', models.CharField(blank=True, max_length=20, null=True)),
                ('address', models.CharField(blank=True, max_length=200, null=True)),
                ('phone', models.CharField(blank=True, max_length=20, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('observation', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Owner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('gender', models.CharField(choices=[('F', 'Femenino'), ('M', 'Masculino')], max_length=1)),
                ('birthday', models.DateField(blank=True, null=True)),
                ('id_number', models.CharField(max_length=20)),
                ('ruc', models.CharField(blank=True, max_length=20, null=True)),
                ('address', models.CharField(blank=True, max_length=200, null=True)),
                ('phone', models.CharField(blank=True, max_length=20, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('observation', models.TextField(blank=True, null=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='image')),
            ],
        ),
    ]
