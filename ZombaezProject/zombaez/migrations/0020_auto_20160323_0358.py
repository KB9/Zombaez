# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('zombaez', '0019_auto_20160323_0237'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='player_state',
            field=models.CharField(default=b"ccopy_reg _reconstructor p0 (czombaez.engine.game PlayerState p1 c__builtin__ object p2 Ntp3 Rp4 (dp5 S'kills' p6 I0 sS'food' p7 I3 sS'total_ammo' p8 I0 sS'days' p9 I1 sS'total_days' p10 I0 sS'total_food' p11 I0 sS'largest_party' p12 I1 sS'party' p13 I1 sS'ammo' p14 I2 sb.", max_length=8192),
        ),
        migrations.AlterField(
            model_name='game',
            name='update_state',
            field=models.CharField(default=b"ccopy_reg _reconstructor p0 (czombaez.engine.game PlayerState p1 c__builtin__ object p2 Ntp3 Rp4 (dp5 S'kills' p6 I0 sS'food' p7 I0 sS'total_ammo' p8 I0 sS'days' p9 I0 sS'total_days' p10 I0 sS'total_food' p11 I0 sS'largest_party' p12 I1 sS'party' p13 I1 sS'ammo' p14 I0 sb.", max_length=8192),
        ),
    ]
