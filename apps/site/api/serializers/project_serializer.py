from rest_framework import serializers
from django.conf import settings
from localground.apps.site import models
from localground.apps.site.api.serializers.base_serializer import \
    BaseNamedSerializer
from localground.apps.site.api.serializers.photo_serializer import \
    PhotoSerializer
from localground.apps.site.api.serializers.video_serializer import \
    VideoSerializer
from localground.apps.site.api.serializers.mapimage_serializer import \
    MapImageSerializerUpdate
from localground.apps.site.api.serializers.audio_serializer import \
    AudioSerializer
from localground.apps.site.api.metadata import CustomMetadata
from localground.apps.site.api.serializers.marker_serializer import \
    MarkerSerializer, MarkerSerializerDetail
from localground.apps.site.api.serializers.marker_w_attrs_serializer import \
    create_dynamic_serializer


class ProjectSerializerMixin(object):
    sharing_url = serializers.SerializerMethodField()

    def get_sharing_url(self, obj):
        view = self.context.get('view')
        return '%s/api/0/projects/%s/users/' % (
            settings.SERVER_URL,
            obj.id)


class ProjectSerializer(BaseNamedSerializer, ProjectSerializerMixin):
    sharing_url = serializers.SerializerMethodField()
    access_authority = serializers.PrimaryKeyRelatedField(
        queryset=models.ObjectAuthority.objects.all(),
        read_only=False, required=False)
    slug = serializers.SlugField(max_length=100, label='friendly url')
    last_updated_by = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = models.Project
        read_only_fields = ('time_stamp', 'date_created', 'last_updated_by')
        fields = BaseNamedSerializer.Meta.fields + (
            'slug', 'access_authority', 'sharing_url', 'time_stamp',
            'date_created', 'last_updated_by')
        depth = 0

    def get_last_updated_by(self, obj):
        return obj.last_updated_by.username


class ProjectDetailSerializer(ProjectSerializer, ProjectSerializerMixin):
    slug = serializers.SlugField(
        max_length=100, label='friendly url', required=False)
    children = serializers.SerializerMethodField()
    view = None

    class Meta:
        model = models.Project
        read_only_fields = ('time_stamp', 'date_created', 'last_updated_by')
        fields = ProjectSerializer.Meta.fields + ('sharing_url', 'children')
        depth = 0

    def get_metadata(self, serializer_class):
        m = CustomMetadata()
        return m.get_serializer_info(serializer_class)

    def get_children(self, obj):
        forms = models.Form.objects.prefetch_related(
                'field_set', 'field_set__data_type'
            ).filter(project=obj)

        children = {
            'photos': self.get_photos(obj),
            'videos': self.get_videos(obj),
            'audio': self.get_audio(obj),
            'map_images': self.get_mapimages(obj),
            'markers': self.get_markers(obj)
        }

        # add table data:
        for form in forms:
            children['form_%s' % form.id] = self.get_table_records(form)
        return children

    def get_table_records(self, form):
        records = form.get_records()
        return self.serialize_list(
            models.Record,
            create_dynamic_serializer(form),
            records,
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

    def get_videos(self, obj):
        return self.serialize_list(
            models.Video,
            VideoSerializer,
            models.Video.objects.get_objects(
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
                processed_only=False
            ),
            name="Map Images"
        )

    def get_markers(self, obj):
        return self.serialize_list(
            models.Marker,
            MarkerSerializer,
            models.Marker.objects.get_objects_with_lists(
                project=obj,
            )
        )

    def serialize_list(
            self, model_class, serializer_class, records, name=None,
            overlay_type=None, model_name_plural=None):
        if name is None:
            name = model_class.model_name_plural.title()
        if overlay_type is None:
            overlay_type = model_class.model_name
        if model_name_plural is None:
            model_name_plural = model_class.model_name_plural

        serializer = serializer_class(
            records, many=True, context={'request': {}})
        # if model_class == models.MarkerWithAttributes:
        #     raise Exception(serializer.data)
        d = {
            'id': model_name_plural,
            'name': name,
            'overlay_type': overlay_type,
            'data': serializer.data
        }
        d.update({
            'update_metadata': self.get_metadata(serializer)
        })
        # if model_class == models.MarkerWithAttributes:
        #     raise Exception(d)
        return d
