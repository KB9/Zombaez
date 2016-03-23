# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zombaez', '0020_auto_20160323_0358'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='game_state',
            field=models.CharField(default=b"S'STREET' p0 .", max_length=8192),
        ),
    ]
