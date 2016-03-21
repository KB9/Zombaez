from zombaez.models import User, Game
from registration.signals import user_registered
from registration.forms import RegistrationForm

def user_created(sender, user, request, **kwargs):
	form = RegistrationForm(request.POST)
	if 'picture' in request.FILES:
                userData = User(user=user, avatar = request.FILES['picture'])
	else:
                userData = User(user=user)
	userData.username = user.username
	userData.save()
	gameData = Game(user=request.user.user)
	gameData.save()
	

user_registered.connect(user_created)

