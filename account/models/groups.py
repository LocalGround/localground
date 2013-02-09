from django.contrib.gis.db import models
from localground.account.models.base import Base, BasePermissions
from localground.account.managers import ProjectManager, ViewManager
from localground.account.models.permissions import \
                UserAuthority, UserAuthorityObject, ObjectAuthority, EntityGroupAssociation
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType
from localground.uploads.models import Scan, Photo, Audio, Video
from localground.overlays.models import Marker, WMSOverlay

class Group(BasePermissions):
    """
    Abstract class that extends BasePermissions; provides helper methods to
    determine whether a user has read/write/manage permissions on an object.
    """
    extents = models.PolygonField(null=True, blank=True)
    slug = models.SlugField(verbose_name="Friendly URL", max_length=100, unique=True, db_index=True,
                                help_text='A few words, separated by dashes "-", to be used as part of the url')
    basemap = models.ForeignKey('overlays.WMSOverlay', default=12) #default to grayscale
    
    class Meta:
        abstract = True
        app_label = "account"
        
    @staticmethod
    def get_users():
        # Returns a list of user that own or have access to at least one project.
        from django.db.models import Q
        from django.contrib.auth.models import User
        return User.objects.distinct().filter(
                Q(project__isnull=False) | Q(userauthorityobject__isnull=False)
                ).order_by('username',)
    
    def _has_authority(self, user, user_authority_id, access_key=None):
        # 1) if user is superuser or user is owner, then has authority:
        #if user and (user.is_superuser or user == self.owner):
        if user and user == self.owner:
            return True
        
        # 2) if just view permissions, check if project/view is public or
        #    if a valid key has been supplied:
        if user_authority_id == UserAuthority.CAN_VIEW:
            if self.access_authority.id == ObjectAuthority.PUBLIC:
                return True
            elif self.access_authority.id == ObjectAuthority.PUBLIC_WITH_LINK:
                if access_key == self.access_key:
                    return True
                
        # 3) finally, if user is logged in, see if user has been granted
        #    the appropriate authority: 
        if user and user.is_authenticated():
            recs = self.users.select_related('authority__id').filter(user=user)
            for rec in recs:
                if rec.authority.id >= user_authority_id:
                    return True
        return False
    
    def can_view(self, user, access_key=None):
        return self._has_authority(user, UserAuthority.CAN_VIEW, access_key)

    def can_edit(self):
        return self._has_authority(user, UserAuthority.CAN_EDIT)
    
    def can_manage(self):
        return self._has_authority(user, UserAuthority.CAN_MANAGE)
    
    
class Project(Group):
    """
    Default grouping for user-generated content.  Every media type must be
    associated with one and only one project.  Think of a project as a folder
    where users can file their media.  Has helper functions for retrieving all
    media associated with a particular project (for the JavaScript API).
    """
    objects = ProjectManager()
    
    class Meta(Group.Meta):
        verbose_name = 'project'
        verbose_name_plural = 'projects'
        
    def to_dict(self, include_auth_users=False, include_processed_maps=False,
                include_markers=False, include_audio=False, include_photos=False,
                include_notes=False):
        d = {
            'id': self.id,
            'name': self.name,  
            'description': self.description,
            'owner': self.owner.username
        }
        if include_processed_maps:
            d.update({ 'processed_maps': 
                Scan.objects.by_project(self, processed_only=True).to_dict_list()
            })
        if include_audio:
            d.update({ 'audio': Audio.objects.by_project(self, ordering_field='name').to_dict_list() })
        if include_photos:
            d.update({ 'photos': Photo.objects.by_project(self, ordering_field='name').to_dict_list() })
        if include_markers:
            d.update({ 'markers': Marker.objects.by_project_with_counts_dict_list(self) })
        if include_notes:
            d.update({ 'notes': self.get_table_data(to_dict=True) })
        return d
    
    def get_table_data(self, to_dict=True):
        from localground.prints.models import Print, Form
        # Projects and forms are tied through prints.  So, select all the
        # forms that are tied to prints that are associate with this project:
        
        # Todo: create an at_projects_forms table; add a trigger on each dynamic
        #       table such that each time the dynamic table's project_id field is
        #       updated, a record is inserted into at_projects_forms (if it
        #       doesn't already exist).
        notes = []
        forms = self.form_set.all() #create trigger for this!
        for form in forms:
            recs = form.get_data(project=self, to_dict=to_dict,
                                    include_markers=False, include_scan=False)
            if len(recs) > 0:
                notes.append(dict(form=form.to_dict(), data=recs))
            
        return notes
    
    def __unicode__(self):
        return self.name

    
class View(Group):
    """
    A user-generated grouping of media.  Media associations are specified in the
    EntityGroupAssociation Model.  Only partially implemented.
    """
    objects = ViewManager()
    entities = generic.GenericRelation('account.EntityGroupAssociation',
                                       content_type_field='group_type',
                                       object_id_field='group_id')
    
    def _get_filtered_entities(self, cls):
        """
        Private method that queries the EntityGroupAssociation model for
        references to the current view for a given media type (Photo,
        Audio, Video, Scan, Marker).
        
        Required arguments:
        cls -- the class name of the media type you want to find.
        
        """
        qs = (self.entities
                .filter(entity_type=ContentType.objects.get_for_model(cls))
                .order_by('ordering',))
        entities = []
        for rec in list(qs):
            o = rec.entity_object
            o.ordering = rec.ordering
            o.turned_on = rec.turned_on
            entities.append(o)
        return entities
    
    @property
    def photos(self):
        return self._get_filtered_entities(Photo)    
    
    @property
    def audio_files(self):
        return self._get_filtered_entities(Audio)
    
    @property
    def videos(self):
        return self._get_filtered_entities(Video)
    
    @property
    def map_images(self):
        return self._get_filtered_entities(Scan)
        
    @property
    def markers(self):
        return self._get_filtered_entities(Marker)
        
    def get_markers_with_counts(self):
        """
        Queries for Markers and also uses raw sql to retrieve how many Audio,
        Photo, Notes are associated with the marker.
        """
        if len(self.markers) == 0: return []
        marker_ids = [m.id for m in self.markers]
        markers_with_counts = Marker.objects.by_marker_ids_with_counts(marker_ids)
        #append turned_on flag:
        for m in self.markers:
            for m1 in markers_with_counts:
                if m.id == m1.id:
                    m1.turned_on = m.turned_on
                    break
        return [m.to_dict(aggregate=True) for m in markers_with_counts]
        
        
    class Meta(Group.Meta):
        verbose_name = 'view'
        verbose_name_plural = 'views'
        
    def to_dict(self, include_auth_users=False, include_processed_maps=False,
                include_markers=False, include_audio=False, include_photos=False,
                include_notes=False):
        d = {
            'id': self.id,
            'name': self.name,  
            'description': self.description,
            'owner': self.owner.username
        }
        if include_processed_maps:
            d.update(dict(processed_maps=[rec.to_dict() for rec in self.map_images]))
        if include_audio:
            d.update(dict(audio=[rec.to_dict() for rec in self.audio_files]))
        if include_photos:
            d.update(dict(photos=[rec.to_dict() for rec in self.photos]))
        if include_markers:
            d.update(dict(markers=self.get_markers_with_counts()))
        return d
    
class Scene(Base):
    """
    Not used anywhere yet, but a stub for the new storytelling interface (where
    each view could be a collection of ordered scenes, configured by the user).
    """
    extents = models.PolygonField(null=True, blank=True)
    view = models.ForeignKey('account.View')
    
    