from django.contrib.gis.db import models
from localground.apps.site.models import Base


class StatusCode(Base):

    READY_FOR_PROCESSING = 1
    PROCESSED_SUCCESSFULLY = 2
    PROCESSED_MANUALLY = 3
    ERROR_UNKNOWN = 4
    DIRECTORY_MISSING = 5
    PRINT_NOT_FOUND = 6
    QR_CODE_NOT_READ = 7
    QR_RECT_NOT_FOUND = 8
    MAP_RECT_NOT_FOUND = 9
    FILE_WRITE_PRIVS = 10

    @classmethod
    def get_status(cls, code_id):
        return StatusCode.objects.get(id=code_id)

    name = models.CharField(max_length=255)
    description = models.CharField(max_length=2000, null=True, blank=True)

    class Meta:
        app_label = 'site'
        ordering = ('id',)


class UploadSource(Base):
    WEB_FORM = 1
    EMAIL = 2
    MANUAL = 3

    @classmethod
    def get_source(cls, source_id):
        return UploadSource.objects.get(id=source_id)

    name = models.CharField(max_length=255)

    class Meta:
        app_label = 'site'


class UploadType(Base):
    name = models.CharField(max_length=255)

    class Meta:
        app_label = 'site'


class ErrorCode(Base):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=2000, null=True, blank=True)

    class Meta:
        app_label = 'site'


class ObjectTypes():
    """
    A look-up table of supported media models (and their string
    representations). Not sure how useful this class really is.
    """
    PHOTO = 'photo'
    AUDIO = 'audio'
    VIDEO = 'video'
    MARKER = 'marker'
    SCAN = 'mapimage'
    PRINT = 'print'
    RECORD = 'record'
