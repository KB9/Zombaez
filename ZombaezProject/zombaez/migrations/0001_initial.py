# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Badge',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('badge_id', models.IntegerField(unique=True)),
                ('description', models.CharField(max_length=128)),
                ('level', models.IntegerField(default=0)),
                ('name', models.CharField(max_length=128)),
                ('image', models.CharField(max_length=128)),
                ('requirements', models.CharField(max_length=128)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('time_of_day', models.IntegerField(default=0)),
                ('party_size', models.IntegerField(default=0)),
                ('ammo_count', models.IntegerField(default=0)),
                ('food_count', models.IntegerField(default=0)),
                ('days_survived', models.IntegerField(default=0)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('username', models.CharField(unique=True, max_length=128)),
                ('zombies_killed', models.IntegerField(default=0)),
                ('total_games_played', models.IntegerField(default=0)),
                ('total_ammo_collected', models.IntegerField(default=0)),
                ('largest_party_size', models.IntegerField(default=0)),
                ('total_food_collected', models.IntegerField(default=0)),
                ('total_days_survived', models.IntegerField(default=0)),
                ('avatar', models.CharField(max_length=128)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='game',
            name='username',
            field=models.OneToOneField(to='zombaez.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='badge',
            name='username',
            field=models.ForeignKey(to='zombaez.User'),
            preserve_default=True,
        ),
    ]
