from django.contrib.gis.db import models
from datetime import datetime
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import fields
from localground.apps.site.models import BaseAudit


class GenericAssociation(BaseAudit):

    """
    http://weispeaks.wordpress.com/2009/11/04/overcoming-limitations-in-django-using-generic-foreign-keys/
    Uses the contenttypes framework to create one big "meta-association table"
    between media elements (photos, audio files, mapimages, etc.) and groups.  See
    the reference above for more information about the contenttypes framework.
    """
    ordering = models.IntegerField(default=1)

    # analogous to the "subject" in a triplet,
    # (e.g. "The 'source' has an 'entity.'")
    source_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    source_id = models.PositiveIntegerField()
    source_object = fields.GenericForeignKey('source_type', 'source_id')

    # analogous to the "object" in a triplet
    entity_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_related")
    entity_id = models.PositiveIntegerField()
    entity_object = fields.GenericForeignKey('entity_type', 'entity_id')

    def to_dict(self):
        return {
            'username': self.id,
            'ordering': self.ordering
        }

    def can_view(self, user, access_key=None):
        return (
            self.source_object.can_view(
                user=user,
                access_key=access_key) or self.source_object.project.can_view(
                user=user,
                access_key=access_key))

    def can_edit(self, user):
        return (
            self.source_object.can_edit(user=user)
            or
            self.source_object.project.can_edit(user=user)
        )

    def __unicode__(self):
        return '{0}. {1} --> {2}'.format(
            self.source_id, self.source_type, self.entity_type)

    def _reorder_siblings_on_delete(self):
        # splice model from list:
        from localground.apps.site.models import Audio
        sibling_models = self.source_object.get_media_siblings(
            self.entity_type.id)
        current_index = sibling_models.index(self)
        sibling_models.pop(current_index)

        # commit re-ordered values to database:
        counter = 1
        for model in sibling_models:
            model.ordering = counter
            model.save()
            counter += 1

    def delete(self, **kwargs):
        self._reorder_siblings_on_delete()
        super(GenericAssociation, self).delete(**kwargs)

    class Meta:
        app_label = 'site'
        unique_together = (
            'source_type',
            'source_id',
            'entity_type',
            'entity_id')
