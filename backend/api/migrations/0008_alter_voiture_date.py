# Generated by Django 5.0.6 on 2024-07-01 00:00

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_voiture_enchaire_commentaire_bid_enchairechat_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='voiture',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]