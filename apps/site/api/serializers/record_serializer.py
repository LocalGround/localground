from rest_framework import serializers, validators
from localground.apps.site import models
from localground.apps.site.models import Field
from localground.apps.site.api import fields
import datetime
from django.conf import settings
from rest_framework.serializers import raise_errors_on_nested_writes, model_meta

class BaseRecordSerializer(serializers.ModelSerializer):
    
    geometry = fields.GeometryField(
        help_text='Assign a GeoJSON string',
        required=False,
        allow_null=True,
        style={'base_template': 'json.html', 'rows': 5},
        source='point'
    )
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Project.objects.all(),
        source='project',
        required=False
    )
    owner = serializers.SerializerMethodField()
    overlay_type = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField('get_detail_url')
    children = serializers.SerializerMethodField()
    photo_count = serializers.SerializerMethodField()
    audio_count = serializers.SerializerMethodField()

    def get_fields(self, *args, **kwargs):
        fields = super(BaseRecordSerializer, self).get_fields(*args, **kwargs)
        if self.context.get('view'):
            view = self.context['view']
            form = models.Form.objects.get(id=view.kwargs.get('form_id'))
            fields['project_id'].queryset = form.projects.all()
        else:
            fields['project_id'].queryset = models.Form.objects.all()
        return fields
    
    def get_children(self, obj):
        children = {}
        self.photos = self.get_photos(obj) or []
        self.audio = self.get_audio(obj) or []
        if self.photos:
            children['photos'] = self.photos
        if self.audio:
            children['audio'] = self.audio
        return children
    
    def get_photo_count(self, obj):
        try:
            return obj.photo_count
        except:
            try:
                return len(obj.photos)
            except:
                return 0
    
    def get_audio_count(self, obj):
        try:
            return obj.audio_count
        except:
            try:
                return len(obj.audio)
            except:
                return 0
        
    def get_photos(self, obj):
        from localground.apps.site.api.serializers import PhotoSerializer

        data = PhotoSerializer(
            obj.photos,
            many=True, context={ 'request': {} }).data
        return self.serialize_list(obj, models.Photo, data)
    
    def get_audio(self, obj):
        from localground.apps.site.api.serializers import AudioSerializer

        data = AudioSerializer(
            obj.audio,
            many=True, context={ 'request': {} }).data
        return self.serialize_list(obj, models.Audio, data)
    
    def serialize_list(self, obj, cls, data, name=None, overlay_type=None,
                       model_name_plural=None):
        if data is None or len(data) == 0:
            return None
        if name is None:
            name = cls.model_name_plural.title()
        if overlay_type is None:
            overlay_type = cls.model_name
        if model_name_plural is None:
            model_name_plural = cls.model_name_plural
        return {
            'id': model_name_plural,
            'name': name,
            'overlay_type': overlay_type,
            'data': data,
            'attach_url': '%s/api/0/forms/%s/data/%s/%s/' %
            (settings.SERVER_URL,
             obj.form.id,
             obj.id,
             model_name_plural)}
    
    class Meta:
        fields = (
            'id',
            'overlay_type',
            'url',
            'geometry',
            'owner',
            'project_id')

    def get_overlay_type(self, obj):
        #raise Exception(obj)
        return obj._meta.verbose_name
    
    def get_owner(self, obj):
        return obj.owner.username

    def get_detail_url(self, obj):
        return '%s/api/0/forms/%s/data/%s/' % (settings.SERVER_URL,
                                               obj.form.id, obj.id)
    
    def update(self, instance, validated_data):
        raise_errors_on_nested_writes('update', self, validated_data)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save(self.context.get('request').user)
        return instance
    
    def create(self, validated_data):
        #raise Exception(validated_data)
        serializers.raise_errors_on_nested_writes('create', self, validated_data)

        ModelClass = self.Meta.model
        info = model_meta.get_field_info(ModelClass)
        many_to_many = {}
        for field_name, relation_info in info.relations.items():
            if relation_info.to_many and (field_name in validated_data):
                many_to_many[field_name] = validated_data.pop(field_name)

        try:
            instance = ModelClass(**validated_data)
        except TypeError as exc:
            msg = (
                'Got a `TypeError` when calling `%s.objects.create()`. '
                'This may be because you have a writable field on the '
                'serializer class that is not a valid argument to '
                '`%s.objects.create()`. You may need to make the field '
                'read-only, or override the %s.create() method to handle '
                'this correctly.\nOriginal exception text was: %s.' %
                (
                    ModelClass.__name__,
                    ModelClass.__name__,
                    self.__class__.__name__,
                    exc
                )
            )
            raise TypeError(msg)
        if many_to_many:
            for field_name, value in many_to_many.items():
                setattr(instance, field_name, value)
        return instance

def create_record_serializer(form, **kwargs):
    """
    generate a dynamic serializer from dynamic model
    """
    field_names, photo_fields, photo_details, audio_fields, audio_details = [], [], [], [], []
    display_field = None
    
    for f in form.fields:
        if f.is_display_field:
            display_field = f
        field_names.append(f.col_name)
        if f.data_type.id == Field.DataTypes.PHOTO:
            photo_fields.extend([f.col_name, f.col_name + "_detail"])
        elif f.data_type.id == Field.DataTypes.AUDIO:
            audio_fields.extend([f.col_name, f.col_name + "_detail"])
    
    #append display name:
    field_names.extend(['photo_count', 'audio_count'])
    if display_field is not None:
        field_names.append('display_name') 
    if kwargs.get('show_detail'):
        field_names.append('children')
    #else:
    #    field_names.extend(['photo_count', 'audio_count'])
    
    TableModel = form.TableModel
    class Meta:
        model = TableModel
        fields = BaseRecordSerializer.Meta.fields + tuple(field_names) + \
            tuple(photo_fields) + tuple(audio_fields) 
        read_only_fields = ('display_name', 'children', 'photo_count', 'audio_count')
    
    attrs = {
        '__module__': 'localground.apps.site.api.serializers.FormDataSerializer',
        'Meta': Meta
    }
    #set custom display name field getter, according on the display_field:
    if display_field is not None:
        attrs.update({
            'display_name': serializers.CharField(source=display_field.col_name, read_only=True)
        })

    for f in photo_fields:
        if f.find("_detail") != -1:
            source = f.replace("_detail", "")
            attrs.update({
                f: fields.TablePhotoJSONField(read_only=True, source=source)
            })
        else:
            model_field = TableModel()._meta.get_field(f)
            attrs.update({
                f: fields.CustomModelField(
                    type_label="photo",
                    model_field=model_field
                )
            })
    
    for f in audio_fields:
        if f.find("_detail") != -1:
            source = f.replace("_detail", "")
            attrs.update({
                f: fields.TableAudioJSONField(read_only=True, source=source)
            })
        else:
            model_field = TableModel()._meta.get_field(f)
            attrs.update({
                f: fields.CustomModelField(
                    type_label="audio",
                    model_field=model_field
                )
            })
    
    
    return type('record_serializer_default', (BaseRecordSerializer, ), attrs)

def create_compact_record_serializer(form):
    """
    generate a dynamic serializer from dynamic model
    """
    col_names = [f.col_name for f in form.fields]

    class FormDataSerializer(BaseRecordSerializer):
        recs = serializers.SerializerMethodField()
        url = serializers.SerializerMethodField('get_detail_url')
        project_id = serializers.SerializerMethodField()

        class Meta:
            model = form.TableModel
            fields = (
                'id',
                'recs',
                'url',
                'geometry',
                'project_id',
                'overlay_type')

        def get_recs(self, obj):
            recs = []
            for col_name in col_names:
                val = getattr(obj, col_name)
                if isinstance(val, datetime.datetime):
                    val = val.strftime('%m/%d/%Y, %I:%M:%S %p')
                recs.append(val)
            return recs

        def get_detail_url(self, obj):
            return '%s/api/0/forms/%s/data/%s/' % (settings.SERVER_URL,
                                                   form.id, obj.id)

        def get_project_id(self, obj):
            return obj.project.id

        def get_overlay_type(self, obj):
            return 'record'

    return FormDataSerializer
