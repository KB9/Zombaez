from django.conf.urls import patterns, include, url
from django.contrib import admin

# Needed for redirecting from index to Zombaez home
from zombaez import views as zombaez_views

urlpatterns = patterns('',
    url(r'^$', zombaez_views.index),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^zombaez/', include('zombaez.urls')),
)
