from zombaez.models import User, Game
from registration.signals import user_registered
from registration.forms import RegistrationForm

# This is a bit of a round-about way to create new users but it means
# that I can use the django-registration forms and views without having to
# rewrite it all myself.

# The user_registered signal is checked for and then a new User is created for
# each django-registration user

def user_created(sender, user, request, **kwargs):
        
	# If the user uploaded a picture then use it in the create of the new user
	if 'picture' in request.FILES:
                userData = User(user=user, avatar = request.FILES['picture'])
	else:
                userData = User(user=user)
	userData.username = user.username
	userData.save()
	# Initialise a default Game that is associated with this new user
	gameData = Game(user=request.user.user)
	gameData.save()
	

user_registered.connect(user_created)

