from django.contrib.gis.db import models


class StatusCode(models.Model):
    
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

    def __unicode__(self):
        return str(self.id) + ': ' + self.name

    class Meta:
        app_label = 'site'
        ordering = ('id',)


class UploadSource(models.Model):
    WEB_FORM = 1
    EMAIL = 2
    MANUAL = 3
    
    @classmethod
    def get_source(cls, source_id):
        return UploadSource.objects.get(id=source_id)
    
    name = models.CharField(max_length=255)

    def __unicode__(self):
        return str(self.id) + '. ' + self.name

    class Meta:
        app_label = 'site'


class UploadType(models.Model):
    name = models.CharField(max_length=255)

    def __unicode__(self):
        return str(self.id) + '. ' + self.name

    class Meta:
        app_label = 'site'


class ErrorCode(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=2000, null=True, blank=True)

    def __unicode__(self):
        return str(self.id) + ': ' + self.name

    class Meta:
        app_label = 'site'


class ObjectTypes():

    """
    A look-up table of supported media models (and their string representations).
    Not sure how useful this class really is.
    """
    PHOTO = 'photo'
    AUDIO = 'audio'
    VIDEO = 'video'
    MARKER = 'marker'
    SCAN = 'mapimage'
    PRINT = 'print'
    RECORD = 'record'


class ReturnCode():

    """
    Not really sure if this is used.
    """
    id = None
    name = None
    description = None

    def __init__(self, id, name, description):
        self.id = id
        self.name = name
        self.description = description


class ReturnCodes():

    """
    A look-up table of return codes for various operations on media models.
    Probably a better way to do this.
    """
    SUCCESS = 1
    UNAUTHORIZED = 2
    OBJECT_DOES_NOT_EXIST = 3
    OBJECT_TYPE_DOES_NOT_EXIST = 4
    LAT_LNG_REQUIRED = 5
    UNKNOWN_ERROR = 999

    messages = {}
    messages[SUCCESS] = 'Success'
    messages[UNAUTHORIZED] = 'You are not authorized to perform \
                                            this action'
    messages[OBJECT_DOES_NOT_EXIST] = 'Object not found'
    messages[OBJECT_TYPE_DOES_NOT_EXIST] = 'Object type not found'
    messages[LAT_LNG_REQUIRED] = 'Valid latitude and longitude \
                                                values are required'
    messages[UNKNOWN_ERROR] = 'Unknown error'

    @staticmethod
    def get_message(code):
        return ReturnCodes.messages.get(code)
