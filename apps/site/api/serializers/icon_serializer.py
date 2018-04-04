import os
import sys
from django.conf import settings
from localground.apps.site.api.serializers.base_serializer \
    import BaseSerializer, ProjectSerializerMixin
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.lib.helpers import upload_helpers, generic


class IconSerializerBase(ProjectSerializerMixin, BaseSerializer):
    ext_whitelist = ['jpg', 'jpeg', 'png', 'svg']
    icon_file = serializers.CharField(
        source='file_name_orig', required=True,
        style={'base_template': 'file.html'},
        help_text='Valid file types are: ' + ', '.join(ext_whitelist)
    )
    size = serializers.IntegerField(
        max_value=models.Icon.size_max,
        min_value=models.Icon.size_min,
        required=False
    )
    file_path = serializers.SerializerMethodField('get_file_path_new')

    def get_file_path_new(self, obj):
        try:
            return obj.media_file_resized.url
        except Exception:
            return None

    class Meta:
        abstract = True
        model = models.Icon
        read_only_fields = ('width', 'height', 'file_type')
        fields = ProjectSerializerMixin.field_list + \
            BaseSerializer.field_list + (
                'url', 'name', 'icon_file', 'file_type', 'file_path', 'size',
                'width', 'height', 'anchor_x', 'anchor_y'
            )


class IconSerializerList(IconSerializerBase):
    anchor_x = serializers.IntegerField(read_only=False, required=False)
    anchor_y = serializers.IntegerField(read_only=False, required=False)
    width = serializers.IntegerField(read_only=True)
    height = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Icon
        read_only_fields = ('width', 'height', 'file_type')
        fields = IconSerializerBase.Meta.fields
        depth = 0

    def create(self, validated_data):
        # Overriding the create method to handle file processing
        owner = self.context.get('request').user
        f = self.initial_data.get('icon_file')

        # ensure filetype is valid:
        upload_helpers.validate_file(f, self.ext_whitelist)

        self.validated_data.update(self.get_presave_create_dictionary())
        self.validated_data.update({
            'host': settings.SERVER_HOST,
            'file_name_orig': f.name,
            'name': self.validated_data.get('name') or f.name,
            'virtual_path': upload_helpers.generate_relative_path(
                owner, 'icons')

        })
        # create unsaved Icon instance
        self.instance = models.Icon(**self.validated_data)

        # Save it to Amazon S3 cloud
        self.instance.process_file(f, self.validated_data)

        # Commit to database
        self.instance.save()

        # Send binaries to Amazon:
        self.instance.send_icons_to_s3()
        return self.instance


class IconSerializerUpdate(IconSerializerBase):
    anchor_x = serializers.IntegerField(
        allow_null=True, max_value=models.Icon.size_max,
        min_value=0, required=False)
    anchor_y = serializers.IntegerField(
        allow_null=True, max_value=models.Icon.size_max,
        min_value=0, required=False)
    width = serializers.IntegerField(read_only=True)
    height = serializers.IntegerField(read_only=True)
    icon_file = serializers.CharField(
        source='file_name_orig', required=False, read_only=True)

    def update(self, instance, validated_data):
        data = self.get_presave_update_dictionary()
        data.update(validated_data)
        # The closest to having the resized_icon parameters extracted
        # but it does not overwrite the existing icon
        resized_icon_parameters = self.instance.process_file(
            instance.media_file_new, validated_data)

        data.update(resized_icon_parameters)
        return super(IconSerializerBase, self).update(instance, data)
