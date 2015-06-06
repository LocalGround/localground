from django.contrib.gis.db import models


class ProjectMixin(models.Model):
    project = models.ForeignKey('Project', related_name='%(class)s+')

    class Meta:
        abstract = True


class BaseGenericRelationMixin(models.Model):
    from django.contrib.contenttypes import fields
    _photos = None
    _audio = None
    _map_images = None
    _markers = None

    entities = fields.GenericRelation(
        'GenericAssociation',
        content_type_field='source_type',
        object_id_field='source_id',
        related_query_name="%(app_label)s_%(class)s_related_entity")

    class Meta:
        abstract = True

    @property
    def photos(self):
        if self._photos is None:
            from localground.apps.site.models.photo import Photo
            self._photos = self._get_filtered_entities(Photo)
        return self._photos

    @property
    def audio(self):
        if self._audio is None:
            from localground.apps.site.models.audio import Audio
            self._audio = self._get_filtered_entities(Audio)
        return self._audio

    @property
    def videos(self):
        if self._videos is None:
            from localground.apps.site.models.video import Video
            self._videos = self._get_filtered_entities(Video)
        return self._videos

    @property
    def map_images(self):
        if self._map_images is None:
            from localground.apps.site.models.barcoded import Scan
            self._map_images = self._get_filtered_entities(Scan)
        return self._map_images

    @property
    def markers(self):
        if self._markers is None:
            from localground.apps.site.models.marker import Marker
            self._markers = self._get_filtered_entities(Marker)
        return self._markers

    # def entities(self, key):
    #     associations = (models.GenericAssociation.objects
    #                     .filter(source_type=self.get_content_type()).filter(source_id=self.id))
    #     form_classes = ContentType.objects\
    #         .filter(id__in=[a.entity_type_id for a in associations])
