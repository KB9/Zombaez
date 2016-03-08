from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    context_dict = {'test': "test context dict entry"}
    return render(request, 'zombaez/index.html', context_dict)
