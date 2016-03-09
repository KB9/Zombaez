from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    context_dict = {'test': "test context dict entry"}
    context_dict["about"] = "TBC - Text regarding the description of the game."
    context_dict["whatsNew"] = "TBC - Text regarding new happenings in the game."
    return render(request, 'zombaez/home.html', context_dict)

def howToPlay(request):
    return HttpResponse("How to play page is yet to be implemented")
def leaderboards(request):
    return HttpResponse("Leaderboard page is yet to be implemented")
