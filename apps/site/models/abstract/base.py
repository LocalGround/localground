from django.contrib.gis.db import models
from django.http import Http404
from localground.apps.lib.helpers import classproperty
from django.contrib.contenttypes.models import ContentType


class Base(models.Model):
    filter_fields = ('id',)
    
    class Meta:
        app_label = 'site'
        abstract = True
        verbose_name = 'base'
        verbose_name_plural = 'bases'

    @classmethod
    def get_model(cls, model_name=None, model_name_plural=None):
        '''
        Finds the corresponding model class, based on the arguments
        '''
        name = model_name or model_name_plural
        if name.find('form_') == -1:
            return cls._get_model_managed(
                model_name=model_name,
                model_name_plural=model_name_plural)
        else:
            id = name.split('_')[-1]
            from localground.apps.site.models import Form
            form = Form.objects.get(id=id)
            return form.TableModel

    @classmethod
    def _get_model_managed(cls, model_name=None, model_name_plural=None):
        if model_name is None and model_name_plural is None:
            raise Exception(
                'Either model_name or model_name_plural is required here.')

        from django.db.models import loading
        models = loading.get_models()
        if model_name_plural:
            #model_name_plural = model_name_plural.replace('-', ' ')
            for m in models:
                try:
                    if model_name_plural == m.model_name_plural:
                        return m
                except:
                    pass
        if model_name:
            #model_name = model_name.replace('-', ' ')
            for m in models:
                try:
                    if model_name == m.model_name:
                        return m
                except:
                    pass
        raise Http404
    
    @classmethod
    def get_filter_fields(cls):
        from localground.apps.lib.helpers import QueryField, FieldTypes
        
        def get_data_type(model_field):
            data_types = {
                'AutoField': FieldTypes.INTEGER,
                'ForeignKey': FieldTypes.INTEGER,
                'CharField': FieldTypes.STRING,
                'DateTimeField': FieldTypes.DATE,
                'PointField': FieldTypes.POINT
            }
            return data_types.get(model_field.get_internal_type()) or model_field.get_internal_type()
        query_fields = {}
        for field in cls.filter_fields:
            for f in cls._meta.fields:
                if f.name == field:
                    query_fields[f.name] = QueryField(
                        f.name, django_fieldname=f.name, title=f.verbose_name,
                        help_text=f.help_text, data_type=get_data_type(f)
                    )
        #raise Exception(query_fields)
        return query_fields

    @classproperty
    def model_name(cls):
        return cls._meta.verbose_name.replace('-', '_')

    @classproperty
    def pretty_name(cls):
        return cls._meta.verbose_name.replace('-', ' ')

    @classproperty
    def model_name_plural(cls):
        return cls._meta.verbose_name_plural

    @classproperty
    def pretty_name_plural(cls):
        return cls._meta.verbose_name_plural.replace('-', ' ')

    @classmethod
    def listing_url(cls):
        return '/profile/{0}/'.format(cls.model_name_plural)

    @classmethod
    def batch_delete_url(cls):
        return '/profile/{0}/delete/batch/'.format(cls.model_name_plural)

    @classmethod
    def create_url(cls):
        return '/profile/{0}/create/'.format(cls.model_name_plural)

    def update_url(self):
        return '/profile/{0}/{1}/update/'.format(
            self.model_name_plural,
            self.id)

    def delete_url(self):
        # use the API to delete:
        return '/api/0/{0}/{1}/'.format(self.model_name_plural, self.id)

    @classmethod
    def get_content_type(cls):
        '''
        Finds the ContentType of the model (does a database query)
        Caching not really working...perhaps use application-level caching?
        '''
        return ContentType.objects.get_for_model(cls, for_concrete_model=False)

    def stash(self, *args, **kwargs):
        # same as append
        self.append(*args, **kwargs)

    def grab(self, cls):
        # same as _get_filtered_entities
        return self._get_filtered_entities(cls)

    def get_form_ids(self):
        from localground.apps.site.models import Photo, Audio, MapImage
        content_ids = [
            ct.id for ct in
            ContentType.objects.get_for_models(Photo, Audio, MapImage).values()
        ]
        return (
            self.entities
            .values_list('entity_type__model', flat=True)
            .distinct()
            .exclude(entity_type__in=content_ids)
        )

    def _get_filtered_entities(self, cls):
        """
        Private method that queries the GenericAssociation model for
        references to the current view for a given media type (Photo,
        Audio, Video, MapImage, Marker).
        """
        qs = (self.entities
              .filter(entity_type=cls.get_content_type())
              .order_by('ordering',))
        ids = [rec.entity_id for rec in qs]
        related_fields = ['owner']
        if hasattr(cls, 'project'):
            related_fields.extend(['project', 'project__owner'])
        objects = cls.objects.select_related(*related_fields).filter(
            id__in=ids)

        entities = []
        stale_references = []
        for rec in qs:
            found = False
            for o in objects:
                if rec.entity_id == o.id:
                    found = True
                    o.ordering = rec.ordering
                    o.turned_on = rec.turned_on
                    break
            if not found:
                stale_references.append(rec.id)

        # Because the ContentTypes framework doesn't use traditional relational
        # database controls (no constraints), it's possible that the referenced
        # objects no longer exist.  If this is the case, delete the irrelevant
        # pointers:
        if len(stale_references) > 0:
            self.entities.filter(id__in=stale_references).delete()

        return objects

    def append(self, item, user, ordering=1, turned_on=False):
        '''
        Creates an association between the object and whatever the item specified
        "ordering" and "turned_on" args are optional.
        '''
        from localground.apps.site.models import GenericAssociation
        from localground.apps.site.models.abstract.media import BaseUploadedMedia
        from localground.apps.lib.helpers import get_timestamp_no_milliseconds

        if not issubclass(item.__class__, BaseUploadedMedia):
            raise Exception(
                'Only items of type Photo, Audio, Record, or Map Image can be appended.')

        assoc = GenericAssociation(
            source_type=self.get_content_type(),
            source_id=self.id,
            entity_type=item.get_content_type(),
            entity_id=item.id,
            ordering=ordering,
            turned_on=turned_on,
            owner=user,
            last_updated_by=user,
            date_created=get_timestamp_no_milliseconds(),
            time_stamp=get_timestamp_no_milliseconds()
        )
        assoc.save()
