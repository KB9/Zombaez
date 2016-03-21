from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from zombaez.models import Badge, User
from engine import main as engine
from threading import Thread
import json

def home(request):
    context_dict = {'test': "test context dict entry"}
    context_dict["about"] ="""A zombie apocalypse has broken out and you find yourself all alone.
Your goal is to survive as many days as possible during the zombie apocalypse.
Armed only with your gun, you must risk your life by entering houses to find food and ammo to survive each day.
Find fellow survivors to increase your chances of survival against the zombies you encounter as you hunt for supplies.
Be mindful of your fellow survivors.
You must find enough food to support your group.
If you fall short on these supplies, do not be surprised if some members decide to part ways with your group.
If your group size dwindles, so do your chances of survival should you encounter any zombies.
"""
    context_dict["whats_new"] = "Pre Alpha - Game doesn't actually exist yet"
    return render(request, 'zombaez/home.html', context_dict)



def how_to_play(request):
    context_dict = {"how_to_play": "TBC - Text regarding how to play the game."}
    return render(request, 'zombaez/how_to_play.html', context_dict)

def leaderboards(request):
    context_dict = {"total_games_played":User.objects.order_by("-total_games_played")[:10]}
    context_dict["total_ammo_collected"] = User.objects.order_by("-total_ammo_collected")[:10]
    context_dict["total_food_collected"] = User.objects.order_by("-total_food_collected")[:10]
    context_dict["total_days_survived"] = User.objects.order_by("-total_days_survived")[:10]
    context_dict["largest_party_size"] = User.objects.order_by("-largest_party_size")[:10]
    context_dict["zombies_killed"] = User.objects.order_by("-zombies_killed")[:10]
    return render(request, 'zombaez/leaderboards.html', context_dict)


def user(request, player_name):
    context_dict = {}
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
    context_dict = {"play":"PLLAAYYYAAAAA"}
    return render(request, 'zombaez/play.html', context_dict)

@login_required
# REQUIRED PARAMETERS: event_type
def game_event(request): 
    if request.method != "GET":
        return  

    get = request.GET
    eventType = get["event_type"]
    game_info = {}

    if eventType == "unpickle_on_load":
        engine.unpickleGame(request)
    elif eventType == "pickle_on_close":
        engine.pickleGame(request)
    elif eventType=="house_entered":
        print engine
        #print engine.game
        #print engine.game.street_factory
        #print engine.game.street_factory.street
        #print engine.game.street_factory.street.house_list
        #game_info["num_of_rooms"] = engine.game.street_factory.street.house_list[get["house_id"]].num_of_rooms
        #print game_info["num_of_rooms"]

    return HttpResponse(json.dumps(game_info))
