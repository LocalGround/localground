from django.contrib.gis.db import models
from localground.apps.site.models.abstract.audit import BaseAudit
from localground.apps.site.models.abstract.mixins import ProjectMixin

from tagging_autocomplete.models import TagAutocompleteField
import base64
from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
import os
import stat

'''
Utility File Path Methods
'''
def encrypt_media_path(host, model_name_plural, path):
        from django.http import HttpResponse
        import time
        timestamp = int(time.time())
        path = path + '#' + str(timestamp)
        return '%s://%s/profile/%s/%s/' % (
            settings.PROTOCOL,
            host,
            model_name_plural.replace(' ', '-'),
            base64.b64encode(path)
        )

def encrypt_url(virtual_path, file_name):
    return encrypt_media_path(virtual_path + file_name)

def get_absolute_path(virtual_path):
    return settings.FILE_ROOT + virtual_path

def absolute_virtual_path(virtual_path, file_name):
    return encrypt_media_path(virtual_path + file_name)

def generate_relative_path(owner, model_name_plural):
    return '/%s/media/%s/%s/' % (
        settings.USER_MEDIA_DIR,
        owner.username,
        model_name_plural
    )

def generate_absolute_path(owner, model_name_plural):
    return '%s/media/%s/%s' % (
        settings.USER_MEDIA_ROOT,
        owner.username,
        model_name_plural
    )

def make_directory(path):
    '''
    I had problems making os.makedirs(path) work in terms of
    setting the appropriate permissions, so I'm using this looping
    function instead.  FYI, the user account needs to be the apache
    account.  Any other way ends in tears.
    '''
    from pwd import getpwnam
    uid = os.getuid()
    gid = getpwnam(settings.GROUP_ACCOUNT).pw_gid
    # same as 775:
    permissions = stat.S_IRWXU | stat.S_IRWXG | stat.S_IROTH | stat.S_IXOTH
    if not os.path.exists(path):
        p = ""
        paths = path.split("/")
        paths.reverse()
        while len(paths) > 0:
            p += paths.pop() + '/'
            if not os.path.exists(p):
                # print '"%s" does not exist' % p
                os.mkdir(p)
                os.chown(p, uid, gid)
                os.chmod(p, permissions)

def save_file_to_disk(owner, model_name_plural, file):
    # create directory if it doesn't exist:
    media_path = generate_absolute_path(owner, model_name_plural)
    if not os.path.exists(media_path):
        make_directory(media_path)

    # derive file name:
    file_name, ext = os.path.splitext(file.name.lower())
    file_name = ''.join(
        char for char in file_name if char.isalnum()).lower()
    if os.path.exists(media_path + '/%s%s' % (file_name, ext)):
        from time import time
        seconds = int(time())
        file_name = '%s_%s' % (file_name, seconds)
    file_name_new = '%s%s' % (file_name, ext)

    # write request file stream to disk:
    destination = open(media_path + '/' + file_name_new, 'wb+')
    for chunk in file.chunks():
        destination.write(chunk)
    destination.close()
    return file_name_new

class BaseMedia(BaseAudit):

    '''
    Important:  the "groups" generic relation is needed to ensure cascading
    deletes.  For example, if a photo gets deleted, you also want to ensure
    that its associations w/any markers / views also get deleted.  The reverse
    relationship needs to be defined here in order for this to occur:
    http://stackoverflow.com/questions/6803018/why-wont-my-genericforeignkey-cascade-when-deleting
    '''
    host = models.CharField(max_length=255)
    virtual_path = models.CharField(max_length=255)
    file_name_orig = models.CharField(max_length=255)
    content_type = models.CharField(max_length=50)
    groups = GenericRelation(
        'GenericAssociation',
        content_type_field='entity_type',
        object_id_field='entity_id',
        related_query_name="%(app_label)s_%(class)s_related"
    )
    filter_fields = ('id', 'project', 'date_created', 'file_name_orig',)

    @classmethod
    def inline_form(cls, user):
        from localground.apps.site.forms import get_inline_form
        return get_inline_form(cls, user)

    class Meta:
        abstract = True
        app_label = 'site'

    def get_absolute_path(self):
        return get_absolute_path(self.virtual_path)

    def absolute_virtual_path(self):
        return absolute_virtual_path(self.virtual_path, self.file_name_new)

    def absolute_virtual_path_orig(self):
        return absolute_virtual_path(self.virtual_path, self.file_name_orig)

    def save_upload(self, *args, **kwargs):
        raise NotImplementedError

    def generate_relative_path(self):
        return generate_relative_path(self.owner, self.model_name_plural)

    def generate_absolute_path(self):
        return generate_absolute_path(self.owner, self.model_name_plural)

    def _encrypt_media_path(self, path, host=None):
        return encrypt_media_path(self.host, self.model_name_plural, path)

    def encrypt_url(self, file_name):
        # return self.virtual_path + file_name
        return self._encrypt_media_path(self.virtual_path + file_name)

    @classmethod
    def make_directory(cls, path):
        make_directory(path)

    def can_view(self, user, access_key=None):
        return self.project.can_view(user=user, access_key=access_key)

    def can_edit(self, user):
        return self.project.can_edit(user)


class BaseNamedMedia(BaseMedia, ProjectMixin):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    tags = TagAutocompleteField(blank=True, null=True)
    filter_fields = BaseMedia.filter_fields + ('name', 'description', 'tags')

    class Meta:
        app_label = 'site'
        abstract = True


class BaseUploadedMedia(BaseNamedMedia):
    file_name_new = models.CharField(max_length=255)
    attribution = models.CharField(max_length=500, blank=True,
                                   null=True, verbose_name="Author / Creator")
    filter_fields = BaseNamedMedia.filter_fields + ('attribution', 'point')

    class Meta:
        abstract = True
        app_label = 'site'

    def save_file_to_disk(self, file):
        return save_file_to_disk(self.owner, self.model_name_plural, file)

    @classmethod
    def inline_form(cls, user):
        from localground.apps.site.forms import get_inline_media_form
        return get_inline_media_form(cls, user)

    def get_object_type(self):
        return self._meta.verbose_name
