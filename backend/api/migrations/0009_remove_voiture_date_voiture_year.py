# Generated by Django 5.0.6 on 2024-07-01 00:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_voiture_date'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='voiture',
            name='date',
        ),
        migrations.AddField(
            model_name='voiture',
            name='year',
            field=models.IntegerField(default=2024),
        ),
    ]