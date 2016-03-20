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
    #avatar = models.ImageField(upload_to='profile_images',blank=True)

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

    time_of_day = models.IntegerField(default=0)
    party_size = models.IntegerField(default=0)
    ammo_count = models.IntegerField(default=0)
    food_count = models.IntegerField(default=0)
    days_survived = models.IntegerField(default=0)

    def __unicode__(self):
        return "{0}'s Game".format(self.user.username)
