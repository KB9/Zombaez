__author__ = 'leif'

import os
from game import Game
from streetfactory import StreetFactory, Street
from game import PlayerState
from zombaez.models import Game as userGame

import pickle

game = None

def initNewGame():
    global game
    game = Game()
    game.start_new_day()

def pickleGame(request):
    
    data = userGame.objects.get(user=request.user.user)
    data.player_state = pickle.dumps(game.player_state)
    data.update_state = pickle.dumps(game.update_state)
    data.game_state = pickle.dumps(game.game_state)
    data.save()
    

def postStatus():
    player_status={}
    player_status["time_left"]=game.time_left
    player_status["player_ammo"]=game.player_state.ammo
    player_status["player_party"]=game.player_state.party
    player_status["player_food"]=game.player_state.food
    player_status["player_kills"]=game.player_state.kills 
    player_status["player_day"]=game.player_state.days
    return player_status


def unpickleGame(request):
    gameUser = userGame.objects.get(user=request.user.user)
    game.player_state = pickle.loads(gameUser.player_state)
    game.update_state = pickle.loads(gameUser.update_state)
    game.game_state = pickle.loads(gameUser.game_state)


