from localground.apps.site.api.serializers.base_serializer import \
    ExtentsSerializerMixin, NamedSerializerMixin, ProjectSerializerMixin, \
    BaseSerializer
from rest_framework import serializers
from localground.apps.site import models
from django.forms import widgets
from localground.apps.site.api import fields
from django.core.files import File


class PrintSerializerMixin(
        ExtentsSerializerMixin, NamedSerializerMixin, ProjectSerializerMixin,
        BaseSerializer):

    def __init__(self, *args, **kwargs):
        super(PrintSerializerMixin, self).__init__(*args, **kwargs)
        if not self.instance:
            return
        try:
            model = self.instance[0]
        except Exception:
            model = self.instance
        # Sets the storage location upon initialization:
        model.pdf_path_S3.storage.location = model.get_storage_location()
        model.map_image_path_S3.storage.location = model.get_storage_location()

    uuid = serializers.SerializerMethodField()
    layout_url = serializers.HyperlinkedRelatedField(
        view_name='layout-detail',
        source='layout',
        read_only=True)
    layout = serializers.PrimaryKeyRelatedField(
        queryset=models.Layout.objects.all())
    map_provider_url = serializers.HyperlinkedRelatedField(
        view_name='tileset-detail',
        source='map_provider',
        read_only=True)
    map_provider = serializers.PrimaryKeyRelatedField(
        queryset=models.TileSet.objects.all())
    pdf = serializers.SerializerMethodField()
    thumb = serializers.SerializerMethodField()
    instructions = serializers.CharField(
        label='instructions',
        source='description',
        required=False,
        allow_blank=True,
        style={'base_template': 'textarea.html', 'rows': 5}
    )
    map_title = serializers.CharField(
        label='map_title',
        source='name',
        required=False,
        allow_blank=True)
    tags = fields.ListField(
        child=serializers.CharField(),
        required=False,
        allow_null=True,
        label='tags',
        style={'base_template': 'tags.html'},
        help_text='Tag your object here'
    )
    zoom = serializers.IntegerField(min_value=1, max_value=20, default=17)
    overlay_type = serializers.SerializerMethodField()

    def get_pdf(self, obj):
        try:
            return obj.pdf_path_S3.url
        except Exception:
            return None

    def get_thumb(self, obj):
        try:
            return obj.map_image_path_S3.url
        except Exception:
            return None

    def get_uuid(self, obj):
        return obj.uuid

    # def get_configuration_url(self, obj):
    #    return obj.configuration_url

    def get_overlay_type(self, obj):
        return obj._meta.verbose_name

    class Meta:
        abstract = True
        fields = (
            'id',
            'uuid',
            'project_id',
            'map_title',
            'instructions',
            'tags',
            'pdf',
            'thumb',
            'zoom',
            'map_provider',
            'map_provider_url',
            'layout',
            'layout_url',
            'center',
            'overlay_type',
            # 'edit_url',
            'project_id'
        )


class PrintSerializer(PrintSerializerMixin):

    class Meta:
        model = models.Print
        fields = PrintSerializerMixin.Meta.fields
        fields_read_only = ('id', 'uuid')
        depth = 0

    center = fields.GeometryField(
        help_text='Assign a GeoJSON string',
        required=True,
        style={'base_template': 'json.html', 'rows': 5}
    )

    def create(self, validated_data):
        from django.contrib.gis.geos import GEOSGeometry
        point = GEOSGeometry(validated_data.get('center'))
        # Do some extra work to generate the PDF and calculate the map extents:
        instance = models.Print.insert_print_record(
            self.context.get('request').user,
            validated_data.get('project'),
            validated_data.get('layout'),
            validated_data.get('map_provider'),
            validated_data.get('zoom'),
            validated_data.get('center'),
            self.context.get('request').get_host(),
            map_title=validated_data.get('name'),
            instructions=validated_data.get('description'),
            do_save=False
        )
        d = {
            'uuid': instance.uuid,
            'virtual_path': instance.virtual_path,
            'layout': validated_data.get('layout'),
            'name': validated_data.get('name'),
            'description': validated_data.get('description'),
            'map_provider': validated_data.get('map_provider'),
            'zoom': validated_data.get('zoom'),
            'center': validated_data.get('center'),
            'project': validated_data.get('project'),
            'northeast': instance.northeast,
            'southwest': instance.southwest,
            'extents': instance.extents,
            'host': instance.host,
            'map_image_path': instance.map_image_path,
            'pdf_path': instance.pdf_path,
            'preview_image_path': instance.preview_image_path,
            'map_width': instance.map_width,
            'map_height': instance.map_height
        }
        d.update(self.get_presave_create_dictionary())
        self.instance = self.Meta.model.objects.create(**d)
        pdf_report = instance.generate_pdf()
        pdf_file_path = pdf_report.path + '/' + pdf_report.file_name
        thumb_file_path = pdf_report.path + '/' + 'thumbnail.jpg'

        # Transfer the PDF from file system to Amazon S3
        self.instance.pdf_path_S3.save(
            pdf_report.file_name, File(open(pdf_file_path)))
        self.instance.map_image_path_S3.save(
            'thumbnail_' + instance.uuid + '.jpg', File(open(thumb_file_path)))
        # serializer.save(**d)
        return self.instance


class PrintSerializerDetail(PrintSerializerMixin):
    center = fields.GeometryField(
                help_text='Assign a GeoJSON center point',
                style={'base_template': 'json.html', 'rows': 5},
                read_only=True
            )
    zoom = serializers.IntegerField(
        min_value=1, max_value=20, default=17, read_only=True)
    layout = serializers.SerializerMethodField()
    map_provider = serializers.SerializerMethodField()

    class Meta:
        model = models.Print
        fields = PrintSerializerMixin.Meta.fields
        depth = 0

    def get_map_provider(self, obj):
        return obj.map_provider.id

    def get_layout(self, obj):
        return obj.layout.id
