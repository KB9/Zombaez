from django.db import models
from django.contrib.auth.models import User as DjangoUser

class User(models.Model):
    username = models.CharField(max_length=128, unique=True)
    user = models.OneToOneField(DjangoUser, on_delete=models.CASCADE, default=1)

    
    zombies_killed = models.IntegerField(default=0)
    total_games_played = models.IntegerField(default=0)
    total_ammo_collected = models.IntegerField(default=0)
    largest_party_size = models.IntegerField(default=0)
    total_food_collected = models.IntegerField(default=0)
    total_days_survived = models.IntegerField(default=0)
    avatar = models.ImageField(upload_to='profile_images', default = "profile_images/zombae.jpg")

    def __unicode__(self):
        return self.username

class Badge(models.Model):
    user = models.ForeignKey(User)

    description = models.CharField(max_length=128)
    level = models.IntegerField(default=0)
    name = models.CharField(max_length=128)
    image = models.CharField(max_length=128)
    requirements = models.CharField(max_length=128)

    def __unicode__(self):
        return "{0}'s Badge".format(self.user.username)

class Game(models.Model):
    user = models.OneToOneField(User)

    player_state = models.CharField(max_length=8192, default="ccopy_reg _reconstructor p0 (czombaez.engine.game PlayerState p1 c__builtin__ object p2 Ntp3 Rp4 (dp5 S'kills' p6 I0 sS'food' p7 I3 sS'total_food' p8 I3 sS'days' p9 I1 sS'total_ammo' p10 I2 sS'total_days' p11 I0 sS'total_kills' p12 I0 sS'largest_party' p13 I1 sS'party' p14 I1 sS'ammo' p15 I2 sb.", blank = False)
    game_state = models.CharField(max_length=8192, default="STREET", blank = False)
    update_state = models.CharField(max_length=8192, default="	ccopy_reg _reconstructor p0 (czombaez.engine.game PlayerState p1 c__builtin__ object p2 Ntp3 Rp4 (dp5 S'kills' p6 I0 sS'food' p7 I0 sS'total_food' p8 I3 sS'days' p9 I0 sS'total_ammo' p10 I2 sS'total_days' p11 I0 sS'total_kills' p12 I0 sS'largest_party' p13 I1 sS'party' p14 I1 sS'ammo' p15 I0 sb.", blank = False)


    def __unicode__(self):
        return "{0}'s Game".format(self.user.username)
