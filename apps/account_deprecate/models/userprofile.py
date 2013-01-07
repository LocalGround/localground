from django.db.models import signals
from django.contrib.gis.db import models
from django.contrib.auth.models import User
from localground.apps.account.models.permissions import ObjectAuthority

class UserProfile(models.Model):
    #https://docs.djangoproject.com/en/dev/topics/auth/#creating-users
    user = models.OneToOneField('auth.User') # This field is required.
    email_announcements = models.BooleanField(default=True)
    default_location = models.PointField(null=True, blank=True,
                        help_text='Search map by address, or drag the marker to your home location')
    default_view_authority = models.ForeignKey('account.ObjectAuthority',
                                default=1, verbose_name='Share Preference',
                                help_text='Your default sharing settings for your maps and media') #default to private
    contacts = models.ManyToManyField('auth.User', related_name='%(app_label)s_%(class)s_related',
                                      null=True, blank=True,
                                      verbose_name="Users You're Following")
    objects = models.GeoManager()
    
    class Meta:
        app_label = "account"

def create_profile_on_insert(sender, instance, created, **kwargs):
    # When a new user is created, also create a profile_object and a default
    # project.  Works just like a database trigger.
    
    if instance.id == 1: return #disable this signal for syncdb step
    if created:
        #create a new profile:
        profile = UserProfile()
        profile.email_announcements = True
        profile.default_view_authority = ObjectAuthority.objects.get(id=1)
        profile.user = instance
        profile.save()
        
        #create a default project:
        default_project = Project()
        default_project.slug = 'default-' + instance.username
        default_project.name = 'My First Project' 
        default_project.description = 'Default Local Ground project',
        default_project.access_authority = ObjectAuthority.objects.get(id=1)
        default_project.owner = instance
        default_project.save()
        
signals.post_save.connect(create_profile_on_insert, sender=User)



