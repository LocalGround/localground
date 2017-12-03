from django.db import models
from django.conf import settings


class SaveMixin(object):
    # Need to override the FileField and ImageField in order to dynamically
    # set the S3 storage location.
    def pre_save(self, model_instance, add):
        self.storage.location = '/{0}/{1}/{2}/'.format(
            settings.AWS_S3_MEDIA_BUCKET,
            model_instance.owner.username,
            model_instance.model_name_plural
        )
        # print self.storage.location
        return super(SaveMixin, self).pre_save(model_instance, add)

    @property
    def url(self):
        raise Exception(self.instance)
        self._require_file()
        return self.storage.url(self.name)


class LGFileField(SaveMixin, models.FileField):
    @property
    def url(self):
        raise Exception(self.instance)
        self._require_file()
        return self.storage.url(self.name)


class LGImageField(SaveMixin, models.ImageField):

    @property
    def url(self):
        raise Exception(self.instance)
        self._require_file()
        return self.storage.url(self.name)
