import time
import os
import stat
from django.conf import settings
from pwd import getpwnam
from rest_framework import exceptions
from localground.apps.lib.helpers import generic
'''
Utility File Path Methods
'''


def build_media_path(host, model_name_plural, path):
    return '%s://%s%s' % (
        settings.PROTOCOL,
        host,
        path
    )


'''
It looks like there are files being uploaded to localground first
before it is being modified to change the location and then
upload the stuff to the amazon cloud server
because file_root and user_media_dir points to
the local server storage instead of the amazon s3 settings.

Therefore, we have to make gradual changes
that will transfer files to the cloud instead of keeping them
inside the local server
'''


def get_absolute_path(virtual_path):
    return settings.FILE_ROOT + virtual_path


def generate_relative_path(owner, model_name_plural, uuid=None):
    if uuid is None:
        return '/%s/media/%s/%s/' % (
            settings.USER_MEDIA_DIR,
            owner.username,
            model_name_plural
        )
    else:
        return '/%s/media/%s/%s/%s/' % (
            settings.USER_MEDIA_DIR,
            owner.username,
            model_name_plural,
            uuid
        )


def generate_absolute_path(owner, model_name_plural, uuid=None):
    if uuid is None:
        return '%s/media/%s/%s/' % (
            settings.USER_MEDIA_ROOT,
            owner.username,
            model_name_plural
        )
    else:
        return '%s/media/%s/%s/%s/' % (
            settings.USER_MEDIA_ROOT,
            owner.username,
            model_name_plural,
            uuid
        )


def make_directory(path):
    '''
    I had problems making os.makedirs(path) work in terms of
    setting the appropriate permissions, so I'm using this looping
    function instead.  FYI, the user account needs to be the apache
    account.  Any other way ends in tears.
    '''
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
                os.mkdir(p)
                os.chmod(p, permissions)


def simplify_file_name(file):
    file_name, ext = os.path.splitext(file.name.lower())
    file_name = file_name.split('/')[-1]
    file_name = ''.join(
        char for char in file_name if char.isalnum()
    ).lower()
    return '{0}{1}'.format(file_name, ext)


def simplify_filename(file):
    file_name, ext = os.path.splitext(file.name.lower())
    file_name = ''.join(
        char for char in file_name if char.isalnum()).lower()
    return '{0}{1}'.format(file_name, ext)


def save_file_to_disk(owner, model_name_plural, file, uuid=None):
    # create directory if it doesn't exist:
    media_path = generate_absolute_path(owner, model_name_plural, uuid=uuid)
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


def validate_file(f, whitelist):
    if f:
        ext = os.path.splitext(f.name)[1]
        ext = ext.lower().replace('.', '')
        if ext not in whitelist:
            msg = '{0} is not a valid map image file type. '
            msg += 'Valid options are: {1}'
            raise exceptions.UnsupportedMediaType(
                f, msg.format(ext, whitelist))
