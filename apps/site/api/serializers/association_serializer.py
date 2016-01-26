from django.conf import settings
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api.serializers.base_serializer import AuditSerializerMixin

class AssociationSerializer(AuditSerializerMixin, serializers.ModelSerializer):
    relation = serializers.SerializerMethodField()
    object_id = serializers.IntegerField(source="entity_id", required=True, label="object id")

    class Meta:
        model = models.GenericAssociation
        fields = ('object_id', 'ordering', 'turned_on', 'relation')

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
            raise serializers.ValidationError('%s must be a whole number' % object_id)
        try:
            # get access to URL params throught the view
            cls = Base.get_model(
                model_name_plural=view.kwargs.get('entity_name_plural')
            )
        except:
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
        return '%s/api/0/%s/%s/%s/%s/' % (settings.SERVER_URL,
                                          view.kwargs.get('group_name_plural'),
                                          obj.source_id,
                                          view.kwargs.get('entity_name_plural'),
                                          obj.entity_id)


class AssociationSerializerDetail(AssociationSerializer):
    parent = serializers.SerializerMethodField()
    child = serializers.SerializerMethodField()

    class Meta:
        model = models.GenericAssociation
        fields = ('ordering', 'turned_on', 'parent', 'child')

    def get_parent(self, obj):
        view = self.context.get('view')
        return '%s/api/0/%s/%s/' % (settings.SERVER_URL,
                                    view.kwargs.get('group_name_plural'),
                                    obj.source_id)

    def get_child(self, obj):
        view = self.context.get('view')
        return '%s/api/0/%s/%s/' % (settings.SERVER_URL,
                                    view.kwargs.get('entity_name_plural'),
                                    obj.entity_id)