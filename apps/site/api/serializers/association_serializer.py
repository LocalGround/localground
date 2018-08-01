from django.conf import settings
from rest_framework import serializers, exceptions
from localground.apps.site import models
from localground.apps.site.api.serializers.base_serializer import \
    AuditSerializerMixin, ReorderingMixin


class AssociationSerializer(AuditSerializerMixin, serializers.ModelSerializer):
    relation = serializers.SerializerMethodField()
    object_id = serializers.IntegerField(
        source="entity_id", required=True, label="object id")

    class Meta:
        model = models.GenericAssociation
        read_only_fields = ('ordering',)
        fields = ('object_id', 'ordering', 'relation')

    def create(self, validated_data):
        record = models.Record.objects.get(id=validated_data.get('source_id'))
        validated_data['ordering'] = len(
            record.get_media_siblings(validated_data.get('entity_type')))
        return super(AssociationSerializer, self).create(validated_data)

    def validate(self, attrs):
        """
        Ensure that the media being attached is legit
        """
        from localground.apps.site.models import Base
        view = self.context.get('view')
        object_id = attrs.get('entity_id') or view.kwargs.get('id')
        try:
            object_id = int(object_id)
        except Exception:
            raise serializers.ValidationError(
                '%s must be a whole number' % object_id)
        try:
            # get access to URL params throught the view
            cls = Base.get_model(
                model_name_plural=view.kwargs.get('entity_name_plural')
            )
        except Exception:
            raise serializers.ValidationError(
                '\"%s\" is not a valid media type' %
                view.kwargs.get('entity_type'))
        try:
            cls.objects.get(id=object_id)
        except cls.DoesNotExist:
            raise serializers.ValidationError(
                '%s #%s does not exist in the system' %
                (cls.model_name, object_id))
        return attrs

    def get_relation(self, obj):
        view = self.context.get('view')
        try:
            dataset_id = int(view.kwargs.get('group_name_plural'))
            return '%s/api/0/datasets/%s/data/%s/%s/%s/' % (
                settings.SERVER_URL,
                view.kwargs.get('group_name_plural'),
                obj.source_id,
                view.kwargs.get('entity_name_plural'),
                obj.entity_id
            )
        except ValueError:
            return '%s/api/0/%s/%s/%s/%s/' % (
                settings.SERVER_URL,
                view.kwargs.get('group_name_plural'),
                obj.source_id,
                view.kwargs.get('entity_name_plural'),
                obj.entity_id
            )


class AssociationSerializerDetail(ReorderingMixin, AssociationSerializer):
    parent = serializers.SerializerMethodField()
    child = serializers.SerializerMethodField()

    def update(self, instance, validated_data):
        view = self.context.get('view')
        entity_type = models.Base.get_model(
            model_name_plural=view.kwargs.get('entity_name_plural')
        ).get_content_type()

        # re-sort list of entities:
        if validated_data.get('ordering') is not None:
            validated_data['ordering'] = self.reorder_siblings_on_update(
                instance,
                instance.source_object.get_media_siblings(entity_type.id),
                validated_data.get('ordering')
            )
        return super(
            AssociationSerializerDetail, self).update(instance, validated_data)

    class Meta:
        model = models.GenericAssociation
        fields = ('ordering', 'parent', 'child')

    def get_parent(self, obj):
        view = self.context.get('view')
        try:
            dataset_id = int(view.kwargs.get('group_name_plural'))
            return '%s/api/0/datasets/%s/data/%s/' % (
                settings.SERVER_URL,
                view.kwargs.get('group_name_plural'),
                obj.source_id
            )
        except ValueError:
            return '%s/api/0/%s/%s/' % (
                settings.SERVER_URL,
                view.kwargs.get('group_name_plural'),
                obj.source_id
            )

    def get_child(self, obj):
        view = self.context.get('view')
        return '%s/api/0/%s/%s/' % (
            settings.SERVER_URL,
            view.kwargs.get('entity_name_plural'),
            obj.entity_id
        )
