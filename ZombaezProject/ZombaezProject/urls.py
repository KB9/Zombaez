from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import RedirectView
from registration.backends.simple.views import RegistrationView

class MyRegistrationView(RegistrationView):
    def get_success_url(self,request):
        return '/zombaez/'

urlpatterns = patterns('',
    url(r'^$',  RedirectView.as_view(url='/zombaez/')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^zombaez/', include('zombaez.urls')),
    url(r'^user/register/$', MyRegistrationView.as_view(), name='registration_register'),
    url(r'^user/', include('registration.backends.simple.urls')),
   
)

