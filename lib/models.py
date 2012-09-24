#!/usr/bin/env python
'''
This file contains abstract classes that other model objects inherit.
'''

from django.contrib.gis.db import models
from datetime import datetime
class ReturnCode():
    """
    Not really sure if this is used.
    """
    id = None
    name = None
    description = None
    
    def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description
            
class ReturnCodes():
    """
    A look-up table of return codes for various operations on media models.
    Probably a better way to do this.
    """
    SUCCESS = 1
    UNAUTHORIZED = 2
    OBJECT_DOES_NOT_EXIST = 3
    OBJECT_TYPE_DOES_NOT_EXIST = 4
    LAT_LNG_REQUIRED = 5
    UNKNOWN_ERROR = 999
    
    messages = {}
    messages[SUCCESS] = 'Success'
    messages[UNAUTHORIZED] = 'You are not authorized to perform \
                                            this action'
    messages[OBJECT_DOES_NOT_EXIST] = 'Object not found'
    messages[OBJECT_TYPE_DOES_NOT_EXIST] = 'Object type not found'
    messages[LAT_LNG_REQUIRED] = 'Valid latitude and longitude \
                                                values are required'
    messages[UNKNOWN_ERROR] = 'Unknown error'

    @staticmethod
    def get_message(code):
        return ReturnCodes.messages.get(code)
        
    

class ObjectTypes():
    """
    A look-up table of supported media models (and their string representations).
    Not sure how useful this class really is.
    """
    PHOTO = 'photo'
    AUDIO = 'audio'
    VIDEO = 'video'
    MARKER = 'marker'
    PRINT = 'print'

class BaseObject(models.Model):
    """
    abstract class for most media Models.  Needs to be consolidated with
    account/models/Base class.  We need a single base class abstraction (not two)!
    """
    class Meta:
        abstract = True
        
    project = models.ForeignKey('account.Project')
    owner = models.ForeignKey('auth.User', db_column='user_id')
    last_updated_by = models.ForeignKey('auth.User',
                                related_name='%(app_label)s_%(class)s_related')
    time_stamp = models.DateTimeField(auto_now=True, default=datetime.now)
    
    def get_object_type(self):
        return self._meta.verbose_name
    
    def can_view(self, user, access_key=None):
        return self.project.can_view(user, access_key=access_key)
    
    def can_edit(self, user):
        return True
    
    def can_manage(self, user):
        return True
    
    @staticmethod
    def get_cls(object_type):
        if object_type == ObjectTypes.AUDIO:
            from localground.uploads.models import Audio
            return Audio, ReturnCodes.SUCCESS
        elif object_type == ObjectTypes.PHOTO:
            from localground.uploads.models import Photo
            return Photo, ReturnCodes.SUCCESS
        elif object_type == ObjectTypes.VIDEO: 
            from localground.uploads.models import Video
            return Video, ReturnCodes.SUCCESS    
        elif object_type == ObjectTypes.MARKER:
            from localground.overlays.models import Marker
            return Marker, ReturnCodes.SUCCESS
        elif object_type == ObjectTypes.PRINT:
            from localground.prints.models import Print  
            return Print, ReturnCodes.SUCCESS    
        elif object_type.find('table') != -1: 
            #a bit more complicated b/c the Form object is a wrapper for any
            #dynamic table; need to query for the form and for the record:
            from localground.prints.models import Form
            form = Form.objects.get(id=object_type.split('_')[1])
            return form.TableModel, ReturnCodes.SUCCESS
        else:
            return None, ReturnCodes.OBJECT_TYPE_DOES_NOT_EXIST
    
    @staticmethod
    def get_instance(object_id, object_type, identity, access_key=None):
        obj = None
        cls, return_code = BaseObject.get_cls(object_type)
        if return_code == ReturnCodes.SUCCESS:
            try:
                obj = cls.objects.get(id=object_id)
                if obj.can_view(identity, access_key=access_key):
                    return obj, ReturnCodes.SUCCESS
                else:
                    return obj, ReturnCodes.UNAUTHORIZED
            except cls.DoesNotExist:
                return obj, ReturnCodes.OBJECT_DOES_NOT_EXIST
        else:
            return None, return_code
        
    @staticmethod
    def create_instance(object_type, user, project, *args, **kwargs):
        cls, return_code = BaseObject.get_cls(object_type)
        if return_code == ReturnCodes.SUCCESS:
            return cls.create_instance(user, project, *args, **kwargs)
        else:
            return None, return_code
        
    @staticmethod 
    def update_instance(object_id, object_type, identity, update_dictionary):
        object, return_code = BaseObject.get_instance(object_id, object_type, identity)
        if return_code != ReturnCodes.SUCCESS:
            return None, return_code
        if object.can_edit(identity):
            d = update_dictionary
            for k, v in d.items():
                object.__setattr__(k, v)
            object.time_stamp = datetime.now()
            object.last_updated_by = identity
            object.save()
        else:
            return None, ReturnCodes.UNAUTHORIZED
        return object, ReturnCodes.SUCCESS
    
    @staticmethod 
    def delete_instance(object_id, object_type, identity):
        object, return_code = BaseObject.get_instance(object_id, object_type, identity)
        if return_code != ReturnCodes.SUCCESS:
            return return_code
        if object.can_edit(identity):
            object.delete()
        else:
            return ReturnCodes.UNAUTHORIZED
        return ReturnCodes.SUCCESS
        
    def delete(self, *args, **kwargs):
        self.clear_nullable_related(*args, **kwargs)
        super(BaseObject, self).delete(*args, **kwargs)

    def clear_nullable_related(self, *args, **kwargs):
        """
        Recursively clears any nullable foreign key fields on related objects.
        Django is hard-wired for cascading deletes, which is very dangerous for
        us. This simulates ON DELETE SET NULL behavior manually.
        """
        for related in self._meta.get_all_related_objects():
            accessor = related.get_accessor_name()
            related_set = getattr(self, accessor)

            if related.field.null:
                related_set.clear()
            else:
                for related_object in related_set.all():
                    #careful - recursion here:
                    try:
                        related_object.clear_nullable_related()
                    except:
                        #not all child objects have a clear_nullabe_related()
                        #method
                        pass
        

class PointObject(BaseObject):
    """
    abstract class for uploads with lat/lng references.
    """
    point = models.PointField(blank=True, null=True)
    
    class Meta:
        abstract = True
    
    def display_coords(self):
        if self.point is not None:
            try:
                return '(%0.4f, %0.4f)'  % (self.point.y, self.point.x)
            except ValueError:
                return 'String Format Error: (%s, %s)' % (str(self.point.y), str(self.point.x))
        return '(?, ?)'
    
    def update_latlng(self, lat, lng, user):
        '''Tries to update lat/lng, returns code'''
        from django.contrib.gis.geos import Point
        try:
            if self.can_edit(user):
                self.point = Point(lng, lat, srid=4326)
                self.last_updated_by = user
                self.save()
                return ReturnCodes.SUCCESS
            else:
                return ReturnCodes.UNAUTHORIZED
        except Exception:
            return ReturnCodes.UNKNOWN_ERROR
    
    def remove_latlng(self, user):
        try:
            if self.can_edit(user):
                self.point = None
                self.last_updated_by = user
                self.save()
                return ReturnCodes.SUCCESS
            else:
                return ReturnCodes.UNAUTHORIZED
        except Exception:
            return ReturnCodes.UNKNOWN_ERROR
    
    def __unicode__(self):
        return self.display_coords()
    
    
