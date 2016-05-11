from localground.apps.settings import *
DEBUG = True
TEMPLATE_DEBUG = DEBUG
GDAL_LIBRARY_PATH='/usr/lib/libgdal.so.1.17.1'

ADMINS = (
    ('Admin', 'your_email@gmail.com'),
)
DEFAULT_FROM_EMAIL = '"Site Support" <vanwars@gmail.com>'
ADMIN_EMAILS = ['your_email@gmail.com',]

# Custom Local Variables
PROTOCOL = 'http'
SERVER_HOST = 'localhost:7777'
SERVER_URL = '%s://%s' % (PROTOCOL, SERVER_HOST)

# Absolute path to the directory root of the local ground instance:
FILE_ROOT = '/localground'
STATIC_ROOT = '%s/%s' % (FILE_ROOT, STATIC_MEDIA_DIR)
APPS_ROOT = '%s/apps' % FILE_ROOT
USER_MEDIA_ROOT = '%s/%s' % (FILE_ROOT, USER_MEDIA_DIR)
FONT_ROOT = '%s/css/fonts/' % STATIC_ROOT
TEMP_DIR = '%s/tmp/' % FILE_ROOT
QR_READER_PATH = '%s/lib/barcodereader' % APPS_ROOT

MAP_FILE = FILE_ROOT + '/mapserver/localground.map'
#TAGGING_AUTOCOMPLETE_JS_BASE_URL = '/%s/scripts/jquery-autocomplete' % STATIC_MEDIA_DIR

# From Google Developer Console:
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = 'YOUR_GOOGLE_OAUTH2_KEY'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'YOUR_GOOGLE_OAUTH2_SECRET'

#OS variables:
USER_ACCOUNT = 'vagrant'	#account to use for creating new OS files / directories
GROUP_ACCOUNT = 'vagrant'	#group to use for creating new OS files / directories

HOST = '127.0.0.1'		        #Your Database Host
PORT = '5432'				#Your Database Port
USERNAME = 'postgres'			#Your Database Username
PASSWORD = 'password'		        #Your Database Password
DATABASE = 'lg_test_database'	        #Your Database Name


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

#Turns on Django Debugging
'''
INSTALLED_APPS += ('debug_toolbar',)
INTERNAL_IPS = ('127.0.0.1', '10.0.2.2') #note the 10.0.2.2 is the IP for Vagrant connections
MIDDLEWARE_CLASSES += ('debug_toolbar.middleware.DebugToolbarMiddleware',)
'''
