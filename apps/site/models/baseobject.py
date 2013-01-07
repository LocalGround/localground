#!/usr/bin/env python

from django.contrib.gis.db import models
from datetime import datetime
from localground.apps.site.models import ObjectTypes, ReturnCodes
        
class BaseObject(models.Model):
    """
    abstract class for most media Models.  Needs to be consolidated with
    account/models/Base class.  We need a single base class abstraction (not two)!
    """
    class Meta:
        abstract = True
        
    project = models.ForeignKey('Project')
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
            from localground.apps.site.models import Audio
            return Audio, ReturnCodes.SUCCESS
        elif object_type == ObjectTypes.PHOTO:
            from localground.apps.site.models import Photo
            return Photo, ReturnCodes.SUCCESS
        elif object_type == ObjectTypes.VIDEO: 
            from localground.apps.site.models import Video
            return Video, ReturnCodes.SUCCESS    
        elif object_type == ObjectTypes.MARKER:
            from localground.apps.site.models import Marker
            return Marker, ReturnCodes.SUCCESS
        elif object_type == ObjectTypes.PRINT:
            from localground.apps.site.models import Print  
            return Print, ReturnCodes.SUCCESS    
        elif object_type.find('table') != -1: 
            #a bit more complicated b/c the Form object is a wrapper for any
            #dynamic table; need to query for the form and for the record:
            from localground.apps.site.models import Form
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
                    return None, ReturnCodes.UNAUTHORIZED
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
        


