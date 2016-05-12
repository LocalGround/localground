from localground.apps.site.api.serializers.base_serializer import BaseNamedSerializer
from localground.apps.site.api.serializers.photo_serializer import PhotoSerializer
from localground.apps.site.api.serializers.mapimage_serializer import MapImageSerializerUpdate
from localground.apps.site.api.serializers.audio_serializer import AudioSerializer
from localground.apps.site.api.serializers.record_serializer import create_record_serializer, \
    create_compact_record_serializer
from localground.apps.site.api.metadata import CustomMetadata
from localground.apps.site.api.serializers.marker_serializer import MarkerSerializerCounts, MarkerSerializerLists
from rest_framework import serializers
from localground.apps.site import models
from django.conf import settings

class ProjectSerializerMixin(object):
    sharing_url = serializers.SerializerMethodField()

    def get_sharing_url(self, obj):
        view = self.context.get('view')
        return '%s/api/0/projects/%s/users/' % (
            settings.SERVER_URL,
            obj.id)

class ProjectSerializer(BaseNamedSerializer, ProjectSerializerMixin):
    sharing_url = serializers.SerializerMethodField()
    access_authority = serializers.PrimaryKeyRelatedField(queryset=models.ObjectAuthority.objects.all(), read_only=False, required=False)
    slug = serializers.SlugField(max_length=100, label='friendly url')
    class Meta:
        model = models.Project
        fields = BaseNamedSerializer.Meta.fields + ('slug', 'access_authority', 'sharing_url')
        depth = 0


class ProjectDetailSerializer(ProjectSerializer, ProjectSerializerMixin):
    slug = serializers.SlugField(max_length=100, label='friendly url', required=False)
    children = serializers.SerializerMethodField()
    view = None
        
    class Meta:
        model = models.Project
        fields = ProjectSerializer.Meta.fields + ('sharing_url', 'children')
        depth = 0
    
    def get_metadata(self, serializer_class):
        m = CustomMetadata()
        return m.get_serializer_info(serializer_class)

    def get_children(self, obj):
        from django.contrib.contenttypes.models import ContentType
        from localground.apps.site import models

        candidates = [
            models.Photo,
            models.Audio,
            models.MapImage,
            models.Project,
            models.Marker]
        
        forms = (models.Form.objects
                 .prefetch_related('projects', 'field_set', 'field_set__data_type')
                 .filter(projects=obj)
                 )
        for form in forms:
            candidates.append(form.TableModel)
        
        # this caches the ContentTypes so that we don't keep executing one-off
        # queries
        ContentType.objects.get_for_models(*candidates, concrete_model=False)
        children = {
            'photos': self.get_photos(obj),
            'audio': self.get_audio(obj),
            'map_images': self.get_mapimages(obj),
            'markers': self.get_markers(obj, forms)
        }
        
        # add table data:
        # todo: start here tomorrow:
        for form in forms:
            form_data = self.get_table_records(obj, form)
            if len(form_data.get('data')) > 0:
                children['form_%s' % form.id] = form_data
        return children
        

    def get_table_records(self, obj, form):
        #raise Exception(form.TableModel.objects.get_objects(obj.owner, project=obj))
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

    def get_mapimages(self, obj):
        return self.serialize_list(
            models.MapImage,
            MapImageSerializerUpdate,
            models.MapImage.objects.get_objects(
                obj.owner,
                project=obj,
                processed_only=True
            ),
            name="Map Images"
        )
    
    def get_markers(self, obj, forms):
        if self.context['view'].request.GET.get('marker_with_media_arrays') in ['1', 'true', 'True']:
            return self.serialize_list(
                models.Marker,
                MarkerSerializerLists,
                models.Marker.objects.get_objects_with_lists(
                    obj.owner,
                    project=obj,
                    forms=forms
                )
            )
        else:
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
        
        serializer = serializer_class( records, many=True, context={ 'request': {} })
        d = {
            'id': model_name_plural,
            'name': name,
            'overlay_type': overlay_type,
            'data': serializer.data
        }
        d.update({
            'update_metadata': self.get_metadata(serializer)
        })
        return d
