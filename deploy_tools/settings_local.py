from localground.apps.settings import *
DEBUG = True
TEMPLATE_DEBUG = DEBUG
GDAL_LIBRARY_PATH='{{GDAL_PATH}}'

ADMINS = (
    ('Admin', '{{ADMIN_EMAIL_ADDRESS}}'),
)
DEFAULT_FROM_EMAIL = '"Site Support" <vanwars@gmail.com>'
ADMIN_EMAILS = ['{{ADMIN_EMAIL_ADDRESS}}',]

# Custom Local Variables
SERVER_HOST = '{{SERVER_HOST}}'
SERVER_URL = 'http://%s' % SERVER_HOST

# Absolute path to the directory root of the local ground instance:
FILE_ROOT = '{{FILE_ROOT}}'
STATIC_ROOT = '%s/%s' % (FILE_ROOT, STATIC_MEDIA_DIR)
APPS_ROOT = '%s/apps' % FILE_ROOT
USER_MEDIA_ROOT = '%s/%s' % (FILE_ROOT, USER_MEDIA_DIR)
FONT_ROOT = '%s/css/fonts/' % STATIC_ROOT
TEMP_DIR = '%s/tmp/' % FILE_ROOT
QR_READER_PATH = '%s/lib/barcodereader' % APPS_ROOT

MAP_FILE = FILE_ROOT + '/mapserver/localground.map'
TAGGING_AUTOCOMPLETE_JS_BASE_URL = '/%s/scripts/jquery-autocomplete' % STATIC_MEDIA_DIR

#OS variables:
USER_ACCOUNT = '{{USER_ACCOUNT}}'	#account to use for creating new OS files / directories
GROUP_ACCOUNT = '{{WEBSERVER_ACCOUNT}}'	#group to use for creating new OS files / directories

HOST = '{{DB_HOST}}'				#Your Database Host
PORT = '{{DB_PORT}}'				#Your Database Port
USERNAME = '{{DB_USER}}'			#Your Database Username
PASSWORD = '{{DB_PASSWORD}}'		#Your Database Password
DATABASE = '{{DB_NAME}}'			#Your Database Name

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis', #Code works w/PostGIS
        'NAME': DATABASE, 
        'USER': USERNAME,
        'PASSWORD': PASSWORD,
        'HOST': HOST,
        'PORT': PORT, 
    }
}

TEMPLATE_DIRS = (
    '%s/templates' % APPS_ROOT,
)
FIXTURE_DIRS = (
    '%s/fixtures' % APPS_ROOT,
)

#Turns on Django Debugging
'''
INSTALLED_APPS += ('debug_toolbar',)
INTERNAL_IPS = ('127.0.0.1', )
MIDDLEWARE_CLASSES += ('debug_toolbar.middleware.DebugToolbarMiddleware',)
'''
