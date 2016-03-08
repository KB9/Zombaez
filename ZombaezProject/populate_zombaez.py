import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ZombaezProject.settings')

import django
django.setup()

from zombaez.models import User, Game, Badge

def populate():
    kavan_user = add_user(
            username='kavan',
            zombies_killed=1337,
            total_games_played=1337,
            total_ammo_collected=1337,
            largest_party_size=1337,
            total_food_collected=1337,
            total_days_survived=1337,
            avatar='kavans_avatar.png'
    )

    add_badge(
            badge_id=1,
            user=kavan_user,
            description='The most dank badge there is.',
            level=1,
            name='The dank badge',
            image='dank_af.png',
            requirements='Do not become dankrupt!'
    )

    add_game(
            user=kavan_user,
            time_of_day=0,
            party_size=0,
            ammo_count=0,
            food_count=0,
            days_survived=0
    )

    # Print out what was added
    for u in User.objects.all():
        for b in Badge.objects.filter(user=u):
            print "BADG: {0} - {1}".format(str(u), str(b))
        for g in Game.objects.filter(user=u):
            print "GAME: {0} - {1}".format(str(u), str(g))

def add_user(username, zombies_killed=0, total_games_played=0, total_ammo_collected=0, largest_party_size=0, total_food_collected=0, total_days_survived=0, avatar=''):
    u = User.objects.get_or_create(username=username)[0]

    u.zombies_killed = zombies_killed
    u.total_games_played = total_games_played
    u.total_ammo_collected = total_ammo_collected
    u.largest_party_size = largest_party_size
    u.total_food_collected = total_food_collected
    u.total_days_survived = total_days_survived
    u.avatar = avatar

    u.save()
    return u

def add_badge(badge_id, user, description='', level=0, name='', image='', requirements=''):
    b = Badge.objects.get_or_create(badge_id=badge_id, user=user)[0]

    b.description = description
    b.level = level
    b.name = name
    b.image = image
    b.requirements = requirements
    
    b.save()
    return b

def add_game(user, time_of_day=0, party_size=0, ammo_count=0, food_count=0, days_survived=0):
    g = Game.objects.get_or_create(user=user)[0]

    g.time_of_day = time_of_day
    g.party_size = party_size
    g.ammo_count = ammo_count
    g.food_count = food_count
    g.days_survived = days_survived

    g.save()
    return g

if __name__ == '__main__':
    print "Starting Zombaez population script..."
    populate()
