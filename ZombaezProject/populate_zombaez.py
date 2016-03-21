import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ZombaezProject.settings')

import django
django.setup()

from zombaez.models import User, Game, Badge

def populate():
    jill_user = add_user(
            username='jill',
            zombies_killed=57,
            total_games_played=15,
            total_ammo_collected=45,
            largest_party_size=11,
            total_food_collected=54,
            total_days_survived=60,
            avatar='avatar.png'
    )

    add_badge(
            user=jill_user,
            description='Earned for killing 50 ZombaeZ.',
            level=3,
            name='Killer',
            image='k3.png',
            requirements='50 Zombae kills'
    )

    add_badge(
            user=jill_user,
            description='Earned for killing 20 ZombaeZ.',
            level=2,
            name='Killer',
            image='k2.png',
            requirements='20 Zombae kills'
    )

    add_badge(
            user=jill_user,
            description='Earned for killing 10 ZombaeZ.',
            level=1,
            name='Killer',
            image='k1.png',
            requirements='10 Zombae kills'
    )

    add_game(
            user=jill_user,
            game_state=""
            update_state=""
            player_state=""
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

def add_badge(user, description='', level=0, name='', image='', requirements=''):
    b = Badge.objects.get_or_create(user=user)[0]

    b.description = description
    b.level = level
    b.name = name
    b.image = image
    b.requirements = requirements
    
    b.save()
    return b

def add_game(user, game_state="",update_state="",player_state=""):
    g = Game.objects.get_or_create(user=user)[0]
    g.game_state = game_state
    g.player_state = player_state
    g.update_state = update_state

    g.save()
    return g

if __name__ == '__main__':
    print "Starting Zombaez population script..."
    populate()
