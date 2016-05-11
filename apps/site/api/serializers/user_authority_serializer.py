from django.conf import settings
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api.serializers.base_serializer import AuditSerializerMixin

class UserAuthorityMixin(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    project_id = serializers.IntegerField(source="object_id", read_only=True, label="object id")

    class Meta:
        model = models.UserAuthorityObject
        fields = ('id', 'authority', 'project_id', 'url', 'granted_by')

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
        return '%s/api/0/projects/%s/user-permissions/%s/' % (
            settings.SERVER_URL,
            view.kwargs.get('project_id'),
            obj.id)

class UserAuthorityListSerializer(UserAuthorityMixin):
    
    class Meta:
        model = models.UserAuthorityObject
        fields = UserAuthorityMixin.Meta.fields + ('user', )
        read_only_fields = ('granted_by', )

class UserAuthorityDetailSerializer(UserAuthorityMixin):
    
    class Meta:
        model = models.UserAuthorityObject
        fields = UserAuthorityMixin.Meta.fields
        read_only_fields = ('granted_by', 'user')
