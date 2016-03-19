from zombaez.models import User
from registration.signals import user_registered
from registration.forms import RegistrationForm

def user_created(sender, user, request, **kwargs):
	form = RegistrationForm(request.POST)
	data = User(user=user, avatar = request.FILES['picture'])
	data.username = user.username
	data.save()

user_registered.connect(user_created)

