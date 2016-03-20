# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zombaez', '0007_remove_user_avatar'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='game',
            name='ammo_count',
        ),
        migrations.RemoveField(
            model_name='game',
            name='days_survived',
        ),
        migrations.RemoveField(
            model_name='game',
            name='food_count',
        ),
        migrations.RemoveField(
            model_name='game',
            name='party_size',
        ),
        migrations.RemoveField(
            model_name='game',
            name='time_of_day',
        ),
        migrations.AddField(
            model_name='game',
            name='game_state',
            field=models.FileField(null=True, upload_to=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='game',
            name='player_state',
            field=models.FileField(null=True, upload_to=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='game',
            name='street',
            field=models.FileField(null=True, upload_to=b'', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='game',
            name='street_factory',
            field=models.FileField(null=True, upload_to=b'', blank=True),
            preserve_default=True,
        ),
    ]
