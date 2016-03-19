from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from zombaez.models import Badge
from engine import main as engine
from threading import Thread

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
    context_dict = {"leaderboards": "TBC - Text regarding leaderboards in the game."}
    return render(request, 'zombaez/leaderboards.html', context_dict)

@login_required
def user_profile(request):
    context_dict = {"user_profile": "TBC - Text regarding user profile in the game."}
    context_dict['badges'] = Badge.objects.filter(user = request.user.user)
    return render(request, 'zombaez/user_profile.html', context_dict)

@login_required
def play(request):
    context_dict = {"play":"PLLAAYYYAAAAA"}
    return render(request, 'zombaez/play.html', context_dict)

@login_required
def game_event(request): 
    if request.method != "GET":
        return  

    get = request.GET;

    engine.startNewGame()
    pickleList = engine.getPickledGame()
    print pickleList

    passedInString = get["var"]

    return HttpResponse(passedInString)
