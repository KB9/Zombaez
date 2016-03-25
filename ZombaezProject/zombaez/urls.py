from django.conf.urls import patterns, url
from zombaez import views

urlpatterns = patterns('',
        url(r'^$', views.home, name='home'),
	url(r'^how_to_play/', views.how_to_play, name = 'how_to_play'),
	url(r'^leaderboards/', views.leaderboards, name = 'leaderboards'),
        url(r'^view_profile/(?P<player_name>[\w\-]+)/$', views.user, name='user'), #Username in URL is a variable
        url(r'^user_profile/', views.user_profile, name = 'user_profile'),
        url(r'^play/', views.play, name = 'play'),
        url(r'^game_event/', views.game_event, name = 'game_event'),
		)
