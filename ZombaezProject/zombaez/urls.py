from django.conf.urls import patterns, url
from zombaez import views

urlpatterns = patterns('',
        url(r'^$', views.index, name='index'))
