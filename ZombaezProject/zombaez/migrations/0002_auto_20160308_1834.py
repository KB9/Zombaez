# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zombaez', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='badge',
            old_name='username',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='game',
            old_name='username',
            new_name='user',
        ),
    ]
