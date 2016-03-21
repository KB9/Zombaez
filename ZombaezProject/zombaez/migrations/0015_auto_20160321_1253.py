# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zombaez', '0014_auto_20160320_2009'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.ImageField(default='test', upload_to=b'profile_images', blank=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='game',
            name='game_state',
            field=models.CharField(default=b'STREET', max_length=8192),
        ),
        migrations.AlterField(
            model_name='game',
            name='player_state',
            field=models.CharField(default=b"ccopy_reg _reconstructor p0 (czombaez.engine.game PlayerState p1 c__builtin__ object p2 Ntp3 Rp4 (dp5 S'food' p6 I3 sS'party' p7 I1 sS'kills' p8 I0 sS'ammo' p9 I2 sS'days' p10 I0 sb.", max_length=8192),
        ),
        migrations.AlterField(
            model_name='game',
            name='update_state',
            field=models.CharField(default=b"ccopy_reg _reconstructor p0 (czombaez.engine.game PlayerState p1 c__builtin__ object p2 Ntp3 Rp4 (dp5 S'food' p6 I0 sS'party' p7 I0 sS'kills' p8 I0 sS'ammo' p9 I0 sS'days' p10 I0 sb.", max_length=8192),
        ),
    ]
