from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

def home(request):
    context_dict = {'test': "test context dict entry"}
    context_dict["about"] = "TBC - Text regarding the description of the game."
    context_dict["whats_new"] = """TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game.
    TBC - Text regarding new happenings in the game. """
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
    return render(request, 'zombaez/user_profile.html', context_dict)

@login_required
def play(request):
    context_dict = {"play":"PLLAAYYYAAAAA"}
    return render(request, 'zombaez/play.html', context_dict)
