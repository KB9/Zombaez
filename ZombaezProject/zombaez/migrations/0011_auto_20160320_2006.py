# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zombaez', '0010_auto_20160320_2003'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='game_state',
            field=models.CharField(default=b'', max_length=8192, blank=True),
        ),
        migrations.AlterField(
            model_name='game',
            name='player_state',
            field=models.CharField(default=b'', max_length=8192, blank=True),
        ),
        migrations.AlterField(
            model_name='game',
            name='update_state',
            field=models.CharField(default=b'', max_length=8192, blank=True),
        ),
    ]
