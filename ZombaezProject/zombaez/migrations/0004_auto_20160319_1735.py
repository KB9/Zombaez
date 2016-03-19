# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zombaez', '0003_auto_20160319_1654'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='badge',
            name='badge_id',
        ),
        migrations.AlterField(
            model_name='badge',
            name='image',
            field=models.ImageField(upload_to=b'', blank=True),
        ),
    ]
