from django.conf.urls import patterns, url
from zombaez import views

urlpatterns = patterns('',
        url(r'^$', views.home, name='home'),
	url(r'^how-to-play/', views.howToPlay, name = 'howToPlay'),
	url(r'^leaderboards/', views.leaderboards, name = 'leaderboards')
		)
