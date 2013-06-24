from django.conf.urls import patterns, url
from django.conf.urls import include
from localground.apps.site.api import views
from rest_framework.routers import DefaultRouter

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'photos', views.PhotoViewSet)
router.register(r'audio', views.AudioViewSet)
router.register(r'project', views.ProjectViewSet)

# The API URLs are now determined automatically by the router.
# Additionally, we include the login URLs for the browseable API.
urlpatterns = patterns('',
    url(r'^api/0/', include(router.urls)),
)



