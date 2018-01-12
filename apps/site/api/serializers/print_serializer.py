from localground.apps.site.api.serializers.base_serializer import \
    ExtentsSerializer
from rest_framework import serializers
from localground.apps.site import models
from django.forms import widgets
from localground.apps.site.api import fields
from django.core.files import File


class PrintSerializerMixin(serializers.ModelSerializer):

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

    def get_fields(self, *args, **kwargs):
        fields = super(PrintSerializerMixin, self).get_fields(*args, **kwargs)
        # note: queryset restricted at runtime
        fields['project_id'].queryset = self.get_projects()
        return fields

    uuid = serializers.SerializerMethodField()
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Project.objects.all(), source='project')
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
    # edit_url = serializers.SerializerMethodField('get_configuration_url')
    overlay_type = serializers.SerializerMethodField()
    center = fields.GeometryField(
                help_text='Assign a GeoJSON center point',
                style={'base_template': 'json.html', 'rows': 5},
                required=True
            )

    def get_pdf(self, obj):
        return obj.pdf_path_S3.url

    def get_thumb(self, obj):
        return obj.map_image_path_S3.url
        # return obj.thumb()

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


class PrintSerializer(ExtentsSerializer, PrintSerializerMixin):

    class Meta:
        model = models.Print
        fields = PrintSerializerMixin.Meta.fields
        fields_read_only = ('id', 'uuid')
        depth = 0

    def create(self, validated_data):
        '''# Overriding the create method to handle file processing
        owner = self.context.get('request').user

        # looks like media_file is the only one being saved
        # onto the amazon cloud storage, but not the others
        f = self.initial_data.get('media_file')

        # ensure filetype is valid:
        upload_helpers.validate_file(f, self.ext_whitelist)

        # Save it to Amazon S3 cloud
        self.validated_data.update(self.get_presave_create_dictionary())
        self.validated_data.update({
            'attribution': validated_data.get('attribution') or owner.username
        })
        self.instance = self.Meta.model.objects.create(**self.validated_data)
        self.instance.process_file(f)
        '''
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
        print 'PDF Report saved at: ' + pdf_file_path

        print(pdf_file_path)
        # Transfer the PDF from file system to Amazon S3
        self.instance.pdf_path_S3.save(
            pdf_report.file_name, File(open(pdf_file_path)))
        self.instance.map_image_path_S3.save(
            'thumbnail_' + instance.uuid + '.jpg', File(open(thumb_file_path)))
        print 'PDF Report saved to S3: ' + pdf_report.file_name
        # serializer.save(**d)
        return self.instance


class PrintSerializerDetail(ExtentsSerializer, PrintSerializerMixin):
    center = fields.GeometryField(
                help_text='Assign a GeoJSON center point',
                style={'base_template': 'json.html', 'rows': 5},
                read_only=True
            )
    zoom = serializers.IntegerField(
        min_value=1, max_value=20, default=17, read_only=True)
    layout = serializers.SerializerMethodField()
    map_provider = serializers.SerializerMethodField()
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Project.objects.all(),
        source='project',
        required=False)

    class Meta:
        model = models.Print
        fields = PrintSerializerMixin.Meta.fields
        depth = 0

    def get_map_provider(self, obj):
        return obj.map_provider.id

    def get_layout(self, obj):
        return obj.layout.id

    def get_project(self, obj):
        return obj.project.id
