from django.conf import settings
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api.serializers.base_serializer import AuditSerializerMixin

class SharingSerializerMixin(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    project_id = serializers.IntegerField(source="object_id", read_only=True, label="object id")

    class Meta:
        model = models.UserAuthorityObject
        fields = ('user', 'authority', 'project_id', 'url', 'granted_by')

    def validate(self, attrs):
        # first, ensure that there isn't already an UserAuthorityObject
        # with the given user_id
        kwargs = self.context.get('view').kwargs
        uaos = models.UserAuthorityObject.objects.filter(
            object_id=kwargs.get('project_id'),
            content_type=models.Project.get_content_type(),
            user=attrs.get('user')
        )
        if len(uaos) > 0:
            raise serializers.ValidationError('user id=%s has already been given permission' % attrs.get('user').id)
        return attrs   

    def get_url(self, obj):
        view = self.context.get('view')
        return '%s/api/0/projects/%s/users/%s/' % (
            settings.SERVER_URL,
            view.kwargs.get('project_id'),
            obj.user.id)

class SharingListSerializer(SharingSerializerMixin):
    
    class Meta:
        model = models.UserAuthorityObject
        fields = SharingSerializerMixin.Meta.fields
        read_only_fields = ('granted_by', )

class SharingDetailSerializer(SharingSerializerMixin):
    
    class Meta:
        model = models.UserAuthorityObject
        fields = SharingSerializerMixin.Meta.fields
        read_only_fields = ('granted_by', 'user')
