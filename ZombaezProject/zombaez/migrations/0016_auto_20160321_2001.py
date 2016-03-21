# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zombaez', '0015_auto_20160321_1253'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default=b'static/images/zombae.png', upload_to=b'profile_images'),
        ),
    ]
