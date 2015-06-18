from swampdragon.serializers.model_serializer import ModelSerializer


class PhotoRTSerializer(ModelSerializer):
    class Meta:
        model = 'site.Photo'
        publish_fields = ('name', 'description')
        update_fields = ('name')
