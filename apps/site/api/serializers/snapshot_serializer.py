import sys
from localground.apps.site.api.serializers.base_serializer import BaseNamedSerializer
from localground.apps.site.api.serializers.photo_serializer import PhotoSerializer
from localground.apps.site.api.serializers.mapimage_serializer import MapImageSerializerUpdate
from localground.apps.site.api.serializers.audio_serializer import AudioSerializer
from localground.apps.site.api.serializers.record_serializer import create_record_serializer, \
    create_compact_record_serializer
from localground.apps.site.api.serializers.marker_serializer import MarkerSerializerCounts
from rest_framework import serializers, validators
from localground.apps.site import models, widgets
from localground.apps.site.api import fields

class SnapshotSerializer(BaseNamedSerializer):
    name = serializers.CharField(required=False, allow_null=True)
    access = serializers.SerializerMethodField()
    slug = serializers.SlugField(
        max_length=100,
        validators=[ validators.UniqueValidator(models.Snapshot.objects.all()) ]
    )
    entities = fields.EntitiesField(
        style={'base_template': 'json.html', 'rows': 5},
        required=False)
    center = fields.GeometryField(
                help_text='Assign a GeoJSON string',
                required=True,
                style={'base_template': 'json.html', 'rows': 5}
            )
    basemap = serializers.PrimaryKeyRelatedField(queryset=models.WMSOverlay.objects.all())
    zoom = serializers.IntegerField(min_value=1, max_value=20, default=17)
    children = serializers.SerializerMethodField()

    class Meta:
        model = models.Snapshot
        fields = BaseNamedSerializer.Meta.fields + \
            ('owner', 'slug', 'access', 'zoom', 'center', 'basemap', 'entities', 'children')
        depth = 0
        
        '''
        #this doesn't work b/c the owner is auto-populated
        validators = [ validators.UniqueTogetherValidator(
            queryset=models.Snapshot.objects.all(),
            fields=['slug', 'owner'],
            message='There is already a friendly url (slug) of the same name that is owned by you. Please rename.'
        )]
        '''
        

    def get_access(self, obj):
        return obj.access_authority.name

    def get_children(self, obj):
        from django.contrib.contenttypes.models import ContentType
        from localground.apps.site import models

        candidates = [
            models.Photo,
            models.Audio,
            models.MapImage,
            models.Project,
            models.Marker]
        associations = (models.GenericAssociation.objects
                        .filter(source_type=models.Snapshot.get_content_type()).filter(source_id=obj.id))

        form_classes = ContentType.objects\
            .filter(id__in=[a.entity_type_id for a in associations])

        #TODO: this is really awful there must be a better way to do this haha
        forms = (models.Form.objects
                     .filter(id__in=[f.model.split('_')[-1] for f in form_classes if 'form' in f.model]))
        for form in forms:
            candidates.append(form.TableModel)
        # this caches the ContentTypes so that we don't keep executing one-off
        # queries
        ContentType.objects.get_for_models(*candidates, concrete_model=False)
        children = {
            'photos': self.get_photos(obj),
            'audio': self.get_audio(obj),
            'map_images': self.get_mapimages(obj),
            'markers': self.get_markers(obj, forms),
        }



        # add table data:
        for form in forms:
            #TODO: Jesus christ
            form_data = self.get_table_records(obj, form, (a.entity_id for a in associations.filter(entity_type_id=form_classes.get(model__contains=str(form.id)).id)))
            if len(form_data.get('data')) > 0:
                children['form_%s' % form.id] = form_data
        return children

    def get_photos(self, obj):
        serializer = PhotoSerializer(
            obj.photos, many=True, context={'request': {}}
        )
        return self.serialize_list(models.Photo, serializer)

    def get_audio(self, obj):
        serializer = AudioSerializer(
            obj.audio, many=True, context={'request': {}}
        )
        return self.serialize_list(models.Audio, serializer)

    def get_mapimages(self, obj):
        serializer = MapImageSerializerUpdate(
            obj.map_images, many=True, context={'request': {}}
        )
        return self.serialize_list(models.MapImage, serializer)

    def get_markers(self, obj, forms):
        serializer = MarkerSerializerCounts(
            obj.markers, many=True, context={'request': {}}
        )
        return self.serialize_list(models.Marker, serializer)


    def serialize_list(self, model_class, serializer, name=None, overlay_type=None,
                       model_name_plural=None):
        if name is None:
            name = model_class.model_name_plural.title()
        if overlay_type is None:
            overlay_type = model_class.model_name
        if model_name_plural is None:
            model_name_plural = model_class.model_name_plural

        d = {
            'id': model_name_plural,
            'name': name,
            'overlay_type': overlay_type,
            'data': serializer.data
        }
        try:
            r = self.context.get('request') 
            if r and r.GET.get('include_metadata') in ['True', 'true', '1']:
                d.update({
                    'update_metadata': serializer.metadata() #,
                    #'create_metadata': serializer_class().metadata()
                })
        except:
            pass
        return d

    def get_table_records(self, obj, form, ids):
        serializer = create_record_serializer(form)
        return self.serialize_list(
            form.TableModel,
            serializer(form.TableModel.objects.get_objects(obj.owner).filter(id__in=ids)),
            name=form.name,
            overlay_type='record',
            model_name_plural='form_%s' % form.id
        )


class SnapshotDetailSerializer(SnapshotSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = models.Snapshot
        fields = SnapshotSerializer.Meta.fields + ('children',)
        depth = 0
