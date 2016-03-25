from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from zombaez.models import Badge, User
from engine import main as engine
from threading import Thread
import json

#View for the home page. Context dictionary contains paragraph on game description
def home(request):
    context_dict = {"about" :"""A zombie apocalypse has broken out and you find yourself all alone.
Your goal is to survive as many days as possible during the zombie apocalypse.
Armed only with your gun, you must risk your life by entering houses to find food and ammo to survive each day.
Find fellow survivors to increase your chances of survival against the zombies you encounter as you hunt for supplies.
Be mindful of your fellow survivors.
You must find enough food to support your group.
If you fall short on these supplies, do not be surprised if some members decide to part ways with your group.
If your group size dwindles, so do your chances of survival should you encounter any zombies.
"""}
    context_dict["whats_new"] = "Pre Alpha - Game doesn't actually exist yet"
    return render(request, 'zombaez/home.html', context_dict)



def how_to_play(request):
    return render(request, 'zombaez/how_to_play.html')

#Context dict entries are showing the top fifty players in each statistic.
def leaderboards(request):
    context_dict = {"total_games_played":User.objects.order_by("-total_games_played")[:50]}
    context_dict["total_ammo_collected"] = User.objects.order_by("-total_ammo_collected")[:50]
    context_dict["total_food_collected"] = User.objects.order_by("-total_food_collected")[:50]
    context_dict["total_days_survived"] = User.objects.order_by("-total_days_survived")[:50]
    context_dict["largest_party_size"] = User.objects.order_by("-largest_party_size")[:50]
    context_dict["zombies_killed"] = User.objects.order_by("-zombies_killed")[:50]
    return render(request, 'zombaez/leaderboards.html', context_dict)


def user(request, player_name):
    context_dict = {}

    #In the event that the player in the URL doesn't exist then don't pass anything back
    try:
        player = User.objects.get(username=player_name)
        context_dict['player'] = player
        context_dict['badges'] = Badge.objects.filter(user = player)
    except User.DoesNotExist:
        pass
    return render(request, 'zombaez/user_profile.html', context_dict)

@login_required
def user_profile(request):
    context_dict = {"player": request.user.user}
    context_dict['badges'] = Badge.objects.filter(user = request.user.user)
    return render(request, 'zombaez/user_profile.html', context_dict)

@login_required
def play(request):
    return render(request, 'zombaez/play.html')

game_info={}
current_house = None
current_room = None
@login_required
# REQUIRED PARAMETERS: event_type
def game_event(request):
    global current_house
    global current_room
    global game_info
    print request.method
    if request.method != "GET":
        return

    get = request.GET
    eventType = get["event_type"]
    
    if eventType == "unpickle_on_load": #First check if the event was the page loading. With out this the game would never be unpickled
        engine.initNewGame()
        engine.unpickleGame(request)

    elif eventType == "pickle_on_close":
        engine.pickleGame(request)
        
    elif eventType=="house_exited":
        engine.game.game_state = "HOUSE"
        engine.game.take_turn("EXIT")
        
    elif eventType=="house_entered":
        engine.game.game_state = "STREET"
        engine.game.take_turn("ENTER")
        engine.game.street.current_house = int(get["house_id"])
        current_house=engine.game.street.house_list[int(get["house_id"])]
        game_info["num_of_rooms"] = current_house.num_of_rooms
                                               
    elif eventType=="room_entered":
        engine.game.game_state = "HOUSE"
        current_house.current_room = int(get["room_id"])
        current_room = current_house.room_list[int(get["room_id"])]
        
        game_info["room_people"]=current_room.people
        game_info["room_food"]=current_room.food
        game_info["room_ammo"]=current_room.ammo
        game_info["room_zombies"]=current_room.zombies
        
        engine.game.take_turn("SEARCH", int(get["room_id"]))
        
    elif eventType == "room_exited":
        engine.game.game_state = "HOUSE"
        
    elif eventType =="zombie_run":
        engine.game.game_state = "ZOMBIE"
        engine.game.take_turn("RUN")
        
    elif eventType == "zombie_fight":
        engine.game.game_state = "ZOMBIE"
        game_info["start_zombies"]=current_room.zombies
        game_info["room_people"]=current_room.people
        game_info["room_food"]=current_room.food
        game_info["room_ammo"]=current_room.ammo
        engine.game.take_turn("FIGHT")
        game_info["room_zombies"]=current_room.zombies
        
    elif eventType == "game_over":
        updateLeaderboardsAndBadges(request) #Update leaderboards and award badges only when the user dies
        engine.initNewGame()

    game_info.update(engine.postStatus()) #This is for displaying the HUD data

    return HttpResponse(json.dumps(game_info))

def updateLeaderboardsAndBadges(request):
    #update stats
    u = User.objects.get(user=request.user.user)
    u.total_games_played += 1
    u.total_ammo_collected = u.total_ammo_collected + engine.game.player_state.total_ammo
    u.total_food_collected = u.total_food_collected + engine.game.player_state.total_food
    u.total_days_survived = u.total_days_survived + engine.game.player_state.days
    u.zombies_killed = u.zombies_killed + engine.game.player_state.kills
    
    if engine.game.player_state.largest_party > u.largest_party_size:
        u.largest_party_size = engine.game.player_state.largest_party

    #Check if user already has badges
    badgeExists = [False] * 12
    for badge in Badge.objects.all().filter(user=u):
        if badge.name == "Killer":
            if badge.level == 1:
                badgeExists[0] = True
            elif badge.level == 2:
                badgeExists[1] = True
            elif badge.level == 3:
                badgeExists[2] = True
        if badge.name == "Survivor":
            if badge.level == 1:
                badgeExists[3] = True
            elif badge.level == 2:
                badgeExists[4] = True
            elif badge.level == 3:
                badgeExists[5] = True
        elif badge.name == "Stamina":
            if badge.level == 1:
                badgeExists[6] = True
            elif badge.level == 2:
                badgeExists[7] = True
            elif badge.level == 3:
                badgeExists[8] = True
        elif badge.name == "Party":
            if badge.level == 1:
                badgeExists[9] = True
            elif badge.level == 2:
                badgeExists[10] = True
            elif badge.level == 3:
                badgeExists[11] = True
    u.save()

    #Award badges
    if u.zombies_killed > 10 and not badgeExists[0]:
        k1 = Badge(user=request.user.user)
        k1.description = "Earned for killing 10 ZombaeZ"
        k1.level = 1
        k1.name = "Killer"
        k1.image = "/static/images/badges/k1.png"
        k1.requirements = "10 Zombae kills"
        k1.save()
    if u.zombies_killed > 20 and not badgeExists[1]:
        k2 = Badge(user=request.user.user)
        k2.description = "Earned for killing 20 ZombaeZ"
        k2.level = 2
        k2.name = "Killer"
        k2.image = "/static/images/badges/k2.png"
        k2.requirements = "20 Zombae kills"
        k2.save()
    if u.zombies_killed > 50 and not badgeExists[2]:
        k3 = Badge(user=request.user.user)
        k3.description = "Earned for killing 50 ZombaeZ"
        k3.level = 3
        k3.name = "Killer"
        k3.image = "/static/images/badges/k3.png"
        k3.requirements = "50 Zombae kills"
        k3.save()
    if u.total_days_survived > 5 and not badgeExists[3]:
        s1 = Badge(user=request.user.user)
        s1.description = "Earned for surviving for 5 days"
        s1.level = 1
        s1.name = "Survivor"
        s1.image = "/static/images/badges/s1.png"
        s1.requirements = "5 days survived"
        s1.save()
    if u.total_days_survived > 10 and not badgeExists[4]:
        s2 = Badge(user=request.user.user)
        s2.description = "Earned for surviving for 10 days"
        s2.level = 2
        s2.name = "Survivor"
        s2.image = "/static/images/badges/s2.png"
        s2.requirements = "10 days survived"
        s2.save()
    if u.total_days_survived > 20 and not badgeExists[5]:
        s3 = Badge(user=request.user.user)
        s3.description = "Earned for surviving for 20 days"
        s3.level = 3
        s3.name = "Survivor"
        s3.image = "/static/images/badges/s3.png"
        s3.requirements = "20 days survived"
        s3.save()
    if u.total_games_played > 5 and not badgeExists[6]:
        sta1 = Badge(user=request.user.user)
        sta1.description = "Earned for playing 5 games"
        sta1.level = 1
        sta1.name = "Stamina"
        sta1.image = "/static/images/badges/sta1.png"
        sta1.requirements = "5 games played"
        sta1.save()
    if u.total_games_played > 10 and not badgeExists[7]:
        sta2 = Badge(user=request.user.user)
        sta2.description = "Earned for playing 10 games"
        sta2.level = 2
        sta2.name = "Stamina"
        sta2.image = "/static/images/badges/sta2.png"
        sta2.requirements = "10 games played"
        sta2.save()
    if u.total_games_played > 20 and not badgeExists[8]:
        sta3 = Badge(user=request.user.user)
        sta3.description = "Earned for playing 20 games"
        sta3.level = 3
        sta3.name = "Stamina"
        sta3.image = "/static/images/badges/sta3.png"
        sta3.requirements = "20 games played"
        sta3.save()
    if u.largest_party_size > 10 and not badgeExists[9]:
        p1 = Badge(user=request.user.user)
        p1.description = "Earned for having a party of at least 10 players"
        p1.level = 1
        p1.name = "Party"
        p1.image = "/static/images/badges/p1.png"
        p1.requirements = "10 players in a party"
        p1.save()
    if u.largest_party_size > 20 and not badgeExists[10]:
        p2 = Badge(user=request.user.user)
        p2.description = "Earned for having a party of at least 20 players"
        p2.level = 2
        p2.name = "Party"
        p2.image = "/static/images/badges/p2.png"
        p2.requirements = "20 players in a party"
        p2.save()
    if u.largest_party_size > 40 and not badgeExists[11]:
        p3 = Badge(user=request.user.user)
        p3.description = "Earned for having a party of at least 40 players"
        p3.level = 3
        p3.name = "Party"
        p3.image = "/static/images/badges/p3.png"
        p3.requirements = "40 players in a party"
        p3.save()
