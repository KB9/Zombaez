# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zombaez', '0004_auto_20160319_1735'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='slug',
            field=models.SlugField(default='kavan'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='badge',
            name='image',
            field=models.CharField(max_length=128),
        ),
    ]
