# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zombaez', '0008_auto_20160320_1826'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='game',
            name='street',
        ),
        migrations.RemoveField(
            model_name='game',
            name='street_factory',
        ),
        migrations.AddField(
            model_name='game',
            name='update_state',
            field=models.CharField(default=b'', max_length=8192),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='game',
            name='game_state',
            field=models.CharField(default=b'', max_length=8192),
        ),
        migrations.AlterField(
            model_name='game',
            name='player_state',
            field=models.CharField(default=b'', max_length=8192),
        ),
    ]
