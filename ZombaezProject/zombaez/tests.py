from django.test import TestCase
from zombaez.models import User, Game, Badge
from django.contrib.auth.models import User as djangoUser

class AnimalTestCase(TestCase):
    def setUp(self):
        u = djangoUser(username = "test")
        u.set_password("test")
        u.is_superuser = True
        u.is_staff = True
        u.save()

        userData = User(user=u)
	userData.username = u.username
	userData.save()

	gameData = Game(user = userData)
	gameData.save()

    def test_default_image(self):
        test = djangoUser.objects.get(username = "test")
        self.assertEqual(test.user.avatar, "profile_images/zombae.jpg")

    def test_default_game_state(self):
        u = User.objects.get(username = "test")
        game = Game.objects.get(user = u)
        self.assertEqual(game.game_state, "S'STREET' p0 .")

    def test_game_linked_with_user(self):
        u = User.objects.get(username = "test")
        game = Game.objects.get(user = u)
        self.assertEqual(game.user, u)

    def test_user_and_django_user_same_username(self):
        user = User.objects.get(username = "test")
        django_user = djangoUser.objects.get(username = "test")
        self.assertEqual(user.username, django_user.username)


# A good test to make would be to create a dummy version of the game and cause
# the player to lose with some fake stats like 50 zombie kills. Then I could
# check to see if the correct badges had been awarded and linked with the
# user. Unfortunately this test cannot be made because of the way the update
# leaderboard function has been structured with  views.py. It relies on
# a request being passed in which is something I cannot do.
