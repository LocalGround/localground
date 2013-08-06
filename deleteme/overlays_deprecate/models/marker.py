from django.contrib.gis.db import models
from localground.apps.lib.helpers.models import ObjectTypes
from datetime import datetime    
from localground.apps.overlays.managers import MarkerManager
from localground.apps.lib.helpers.models import PointObject, ReturnCodes
from localground.apps.account.models import Base
from localground.apps.uploads.models import Photo, Audio
    
class Marker(PointObject): 
    """
    Markers are association objects with a lat/lng.  Markers can be associated
    with one or more photos, audio files, data records, etc.  This object needs
    to be re-factored to inherit from account/Group Model, since it's an
    association of other media objects (and should behave like a project or a view).
    """
    name                = models.CharField(max_length=255, blank=True)
    description         = models.CharField(max_length=1000, blank=True)
    color               = models.CharField(max_length=6)
    objects             = MarkerManager()
    
    @staticmethod 
    def create_instance(user, project, lat, lng, name=None):
        try:
            from django.contrib.gis.geos import Point
            marker = Marker()
            marker.project = project
            marker.owner = user
            marker.color = 'CCCCCC'
            marker.last_updated_by = user
            marker.point = Point(lng, lat, srid=4326)
            if name is not None:
                marker.name = name
            marker.save()
            return marker, ReturnCodes.SUCCESS
        except Exception:
            return None, ReturnCodes.UNKNOWN_ERROR
    
    def get_name(self):
        if self.name is None or len(self.name) == 0:
            return 'Marker #%s' % (self.id)
        return self.name

    def clear_nullable_related(self, *args, **kwargs):
        # 1) clear foreign key references to un-managed models (dynamic forms):
        forms = list(self.project.form_set.all())
        for form in forms:
            related = list(form.TableModel.objects.filter(source_marker=self))
            for rec in related:
                rec.source_marker = None
                rec.save()
                
        # 2) clear foreign key references to managed models:
        super(Marker, self).clear_nullable_related(*args, **kwargs)
        
    def delete(self, *args, **kwargs):
        self.clear_nullable_related(*args, **kwargs)
        super(Marker, self).delete(*args, **kwargs)
        
    def append(self, obj, identity):
        #if the object isn't a marker object, just update the source marker:
        if not isinstance(obj, Marker):
            obj.source_marker = self
            obj.save()
            return
        
        #if the object *is* a marker, update all pointers:
        from localground.apps.uploads.models import Photo, Audio, Video
        marker = obj
        #1) set the old marker's data references to the current marker: 
        forms = list(marker.project.form_set.all())
        for form in forms:
            related = list(form.TableModel.objects.filter(source_marker=marker))
            for rec in related:
                rec.source_marker = self
                rec.save()
        
        #2) set the old marker's media references to the current marker:
        media_list = []         
        media_list.extend(list(Photo.objects.filter(source_marker=marker)))
        media_list.extend(list(Audio.objects.filter(source_marker=marker)))
        media_list.extend(list(Video.objects.filter(source_marker=marker)))
        for o in media_list:
            o.source_marker = self
            o.save()
            
        #3) update marker attributes:
        self.name = '%s + %s' % (self.name, marker.name)
        self.description = '%s + %s' % (self.description, marker.description)
        self.last_updated_by = identity
        self.time_stamp = datetime.now()
        self.save()
        
        #4) delete the old marker:
        marker.delete()
        
    def get_photo_ids(self):
        photo_ids = [o.id for o in
                           list(Photo.objects.filter(source_marker=self))]
        if len(photo_ids) > 0:
            return photo_ids
        return None
    
    def get_photos(self):
        return Photo.objects.by_marker(self, ordering_field='name').to_dict_list() 
    
    def get_audio_ids(self):
        audio_ids = [o.id for o in
                           list(Audio.objects.filter(source_marker=self))]
        if len(audio_ids) > 0:
            return audio_ids
        return None
    
    def get_audio(self):
        return Audio.objects.by_marker(self, ordering_field='name').to_dict_list() 
    
    def get_note_ids(self):
        notes = {}
        forms = self.project.form_set.all()
        for form in forms:
            recs = form.get_data(marker=self, to_dict=False,
                                    include_markers=False)
            if len(recs) > 0:
                notes[form.id] = [rec.id for rec in recs]
        if len(notes) > 0:
            return notes
        return None
    
    def get_tables(self):
        data = []
        forms = self.project.form_set.all()
        for form in forms:
            recs = form.get_data(marker=self, to_dict=True,
                                    include_markers=False)
            if len(recs) > 0:
                data.append({
                    'id': form.id,
                    'overlayType': ObjectTypes.RECORD,
                    'name': form.name,
                    'data': recs    
                })
        if len(data) > 0:
            return data
        return []
    
    def to_dict(self, aggregate=False, detail=False):
        e = {
            'id': self.id,
            'lat': self.point.y,
            'lng': self.point.x,
            'name': self.get_name(),
            'description': self.description,
            'color': self.color
        }
        if aggregate:
            e.update({ 'photo_count': self.photo_count })
            e.update({ 'audio_count': self.audio_count })
            #e.update({ 'review_count': self.review_count })
            e.update({ 'video_count': self.video_count })
            e.update({ 'note_count': self.note_count })
            e.update({ 'project_id': self.project_id })
        elif detail:
            e.update({
                'photoIDs': self.get_photo_ids(),
                'audioIDs': self.get_audio_ids(),
                'noteIDs': self.get_note_ids(),
                'photos': self.get_photos(),
                'audio': self.get_audio(),
                'tables': self.get_tables()
            })
        else:
            e.update({ 'project_id': self.project.id })
        if self.project.access_key is not None:
             e.update({ 'accessKey': self.project.access_key })
        
        #add turned_on flag (only exists for views)
        try: e.update(dict(turned_on=self.turned_on))
        except AttributeError: pass
        return e

    class Meta:
        verbose_name = 'marker'
        verbose_name_plural = 'Map Markers'
        ordering = ['id']
        app_label = "overlays"
    
    def __unicode__(self):
        return str(self.id)