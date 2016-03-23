import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ZombaezProject.settings')

import django
django.setup()

from zombaez.models import User, Game, Badge
from django.contrib.auth.models import User as djangoUser

def populate():
    jill_admin = add_admin(
            username='jill',
            password = "jill",
            is_superuser = True,
            is_staff = True		
    )
    jill_user = add_user(
            user = jill_admin,
            username='jill',
            zombies_killed=57,
            total_games_played=15,
            total_ammo_collected=45,
            largest_party_size=11,
            total_food_collected=54,
            total_days_survived=60
    )

    add_badge(
            user=jill_user,
            description='Earned for killing 50 ZombaeZ.',
            level=3,
            name='Killer',
            image='/static/images/badges/k3.png',
            requirements='50 Zombae kills'
    )

    add_badge(
            user=jill_user,
            description='Earned for killing 20 ZombaeZ.',
            level=2,
            name='Killer',
            image='/static/images/badges/k2.png',
            requirements='20 Zombae kills'
    )

    add_badge(
            user=jill_user,
            description='Earned for killing 10 ZombaeZ.',
            level=1,
            name='Killer',
            image='/static/images/badges/k1.png',
            requirements='10 Zombae kills'
    )

    add_game(
            user=jill_user

    )

    bob_admin = add_admin(
            username='bob',
            password = "bob",
            is_superuser = True,
            is_staff = True		
    )
    bob_user = add_user(
            user = bob_admin,
            username='bob',
            zombies_killed=2,
            total_games_played=2,
            total_ammo_collected=3,
            largest_party_size=1,
            total_food_collected=6,
            total_days_survived=3
    )

    add_game(
            user=bob_user

    )
    jen_admin = add_admin(
            username='jen',
            password = "jen",
            is_superuser = True,
            is_staff = True		
    )
    jen_user = add_user(
            user = jen_admin,
            username='jen',
            zombies_killed=12342,
            total_games_played=1756,
            total_ammo_collected=4545,
            largest_party_size=102,
            total_food_collected=56867,
            total_days_survived=1754
    )

    add_badge(
            user=jen_user,
            description='Earned for killing 50 ZombaeZ.',
            level=3,
            name='Killer',
            image='/static/images/badges/k3.png',
            requirements='50 Zombae kills'
    )

    add_badge(
            user=jen_user,
            description='Earned for killing 20 ZombaeZ.',
            level=2,
            name='Killer',
            image='/static/images/badges/k2.png',
            requirements='20 Zombae kills'
    )

    add_badge(
            user=jen_user,
            description='Earned for killing 10 ZombaeZ.',
            level=1,
            name='Killer',
            image='/static/images/badges/k1.png',
            requirements='10 Zombae kills'
    )
    add_badge(
            user=jen_user,
            description='Earned for surviving for 20 days.',
            level=3,
            name='Survivor',
            image='/static/images/badges/s3.png',
            requirements='20 days survived'
    )

    add_badge(
            user=jen_user,
            description='Earned for surviving for 10 days.',
            level=2,
            name='Survivor',
            image='/static/images/badges/s2.png',
            requirements='10 days survived'
    )

    add_badge(
            user=jen_user,
            description='Earned for surviving for 5 days.',
            level=1,
            name='Survivor',
            image='/static/images/badges/s1.png',
            requirements='5 days survived'
    )
    add_badge(
            user=jen_user,
            description='Earned for playing 20 games.',
            level=3,
            name='Stamina',
            image='/static/images/badges/sta3.png',
            requirements='20 games played'
    )

    add_badge(
            user=jen_user,
            description='Earned for playing 10 games.',
            level=2,
            name='Stamina',
            image='/static/images/badges/sta2.png',
            requirements='10 games played'
    )

    add_badge(
            user=jen_user,
            description='Earned for playing 5 games.',
            level=1,
            name='Stamina',
            image='/static/images/badges/sta1.png',
            requirements='5 games played'
    )
    add_badge(
            user=jen_user,
            description='Earned for having a party of at least 40 players.',
            level=3,
            name='Party',
            image='/static/images/badges/p3.png',
            requirements='40 players in a party'
    )

    add_badge(
            user=jen_user,
            description='Earned for having a party of at least 20 players.',
            level=2,
            name='Party',
            image='/static/images/badges/p2.png',
            requirements='20 players in a party'
    )

    add_badge(
            user=jen_user,
            description='Earned for having a party of at least 10 players.',
            level=1,
            name='Party',
            image='/static/images/badges/p1.png',
            requirements='10 players in a party'
    )


    add_game(
            user=jen_user

    )

    # Print out what was added
    for u in User.objects.all():
        for b in Badge.objects.filter(user=u):
            print "BADG: {0} - {1}".format(str(u), str(b))
        for g in Game.objects.filter(user=u):
            print "GAME: {0} - {1}".format(str(u), str(g))

def add_admin(username,password,is_superuser,is_staff):
    u = djangoUser(username=username)
    u.set_password(password)
    u.is_superuser = is_superuser
    u.is_staff = is_staff
    u.save()
    return u
    
def add_user(user,username, zombies_killed=0, total_games_played=0, total_ammo_collected=0, largest_party_size=0, total_food_collected=0, total_days_survived=0):
    u = User(username=username)
    u.user = user
    u.zombies_killed = zombies_killed
    u.total_games_played = total_games_played
    u.total_ammo_collected = total_ammo_collected
    u.largest_party_size = largest_party_size
    u.total_food_collected = total_food_collected
    u.total_days_survived = total_days_survived

    u.save()
    return u

def add_badge(user, description='', level=0, name='', image='', requirements=''):
    b = Badge(user=user)
    b.description = description
    b.level = level
    b.name = name
    b.image = image
    b.requirements = requirements
    
    b.save()
    return b

def add_game(user):
    g = Game.objects.get_or_create(user=user)[0]


    g.save()
    return g

if __name__ == '__main__':
    print "Starting Zombaez population script..."
    populate()
