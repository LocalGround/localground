from localground.apps.site.api.serializers.base_serializer import BaseNamedSerializer
from localground.apps.site.api.serializers.photo_serializer import PhotoSerializer
from localground.apps.site.api.serializers.barcoded_serializer import ScanSerializer
from localground.apps.site.api.serializers.audio_serializer import AudioSerializer
from localground.apps.site.api.serializers.form_serializer import create_record_serializer, \
    create_compact_record_serializer
from localground.apps.site.api.serializers.marker_serializer import MarkerSerializerCounts
from rest_framework import serializers
from localground.apps.site import models


class ProjectSerializer(BaseNamedSerializer):
    access = serializers.SerializerMethodField('get_access_name')

    class Meta:
        model = models.Project
        fields = BaseNamedSerializer.Meta.fields + ('owner', 'slug', 'access')
        depth = 0

    def get_access_name(self, obj):
        return obj.access_authority.name


class ProjectDetailSerializer(BaseNamedSerializer):
    children = serializers.SerializerMethodField('get_children_dict')

    class Meta:
        model = models.Project
        fields = BaseNamedSerializer.Meta.fields + (
            'slug', 'children'
        )
        depth = 0

    def get_children_dict(self, obj):
        from django.contrib.contenttypes.models import ContentType
        from localground.apps.site import models

        candidates = [
            models.Photo,
            models.Audio,
            models.Scan,
            models.Project,
            models.Marker]
        '''
        forms = (models.Form.objects
                 .select_related('projects')
                 .prefetch_related('field_set', 'field_set__data_type')
                 .filter(projects=obj)
                 )
        for form in forms:
            candidates.append(form.TableModel)
        '''
        # this caches the ContentTypes so that we don't keep executing one-off
        # queries
        ContentType.objects.get_for_models(*candidates, concrete_model=False)
        children = {
            'photos': self.get_photos(obj),
            'audio': self.get_audio(obj),
            'scans': self.get_scans(obj),
            #'markers': self.get_markers(obj, forms)
        }

        '''
        # add table data:
        for form in forms:
            form_data = self.get_table_records(obj, form)
            if len(form_data.get('data')) > 0:
                children['form_%s' % form.id] = form_data
        '''
        return children
        

    def get_table_records(self, obj, form):
        return []
        return self.serialize_list(
            form.TableModel,
            create_record_serializer(form),
            form.TableModel.objects.get_objects(obj.owner, project=obj),
            name=form.name,
            overlay_type='record',
            model_name_plural='form_%s' % form.id
        )

    def get_photos(self, obj):
        return self.serialize_list(
            models.Photo,
            PhotoSerializer,
            models.Photo.objects.get_objects(
                obj.owner,
                project=obj
            )
        )

    def get_audio(self, obj):
        return self.serialize_list(
            models.Audio,
            AudioSerializer,
            models.Audio.objects.get_objects(
                obj.owner,
                project=obj
            )
        )

    def get_scans(self, obj):
        return self.serialize_list(
            models.Scan,
            ScanSerializer,
            models.Scan.objects.get_objects(
                obj.owner,
                project=obj,
                processed_only=True
            )
        )

    def get_markers(self, obj, forms):
        return self.serialize_list(
            models.Marker,
            MarkerSerializerCounts,
            models.Marker.objects.get_objects_with_counts(
                obj.owner,
                project=obj,
                forms=forms
            )
        )
    
    def serialize_list(self, model_class, serializer_class, records,
                        name=None, overlay_type=None, model_name_plural=None):
        if name is None:
            name = model_class.model_name_plural.title()
        if overlay_type is None:
            overlay_type = model_class.model_name
        if model_name_plural is None:
            model_name_plural = model_class.model_name_plural
             
        serializer = serializer_class( records, many=True,
                        context={ 'request': {} })
        d = {
            'id': model_name_plural,
            'name': name,
            'overlay_type': overlay_type,
            'data': serializer.data
        }
        try:
            if self.request.GET.get("include_schema") in ['True', 'true', '1']:
                d.update({
                    'update_metadata': serializer.metadata() #,
                    #'create_metadata': serializer_class().metadata() 
                })
        except:
            pass
        return d
