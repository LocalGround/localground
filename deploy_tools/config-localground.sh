#!/bin/bash

##################################
##				##
#	  CONFIG LOCALGROUND	 #
##				##
##################################
#
# This section creates settings settings_local.py
#
## TODO: Config Amazon S3

## echo settings_local.py
	if ! echo "from localground.apps.settings import *

DEBUG = $DJANGO_DEBUG
TEMPLATE_DEBUG = DEBUG
GDAL_LIBRARY_PATH='$GDAL_LIBRARY_PATH'

ADMINS = (
    ('Admin', '$emailaddr'),
)

DEFAULT_FROM_EMAIL = '$emailaddr'
ADMIN_EMAILS = ['$emailaddr',]

# Custom Local Variables
# uses for internal links (server_url)
SERVER_HOST = '$domain'
PROTOCOL = 'https'
SERVER_URL = '%s://%s' % (PROTOCOL, SERVER_HOST)

# API Keys
SENDGRID_API_KEY = '$SENDGRID_API_KEY'
MAPBOX_API_KEY = '$MAPBOX_API_KEY'
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '$SOCIAL_AUTH_GOOGLE_OAUTH2_KEY'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = '$SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET'

# Amazon S3 keys
#AWS_ACCESS_KEY_ID = "$AWS_ACCESS_KEY_ID"
#AWS_SECRET_ACCESS_KEY = "$AWS_SECRET_ACCESS_KEY"
#AWS_STORAGE_BUCKET_NAME = "$AWS_STORAGE_BUCKET_NAME"
#AWS_QUERYSTRING_AUTH = False
#AWS_S3_CUSTOM_DOMAIN = AWS_STORAGE_BUCKET_NAME + ".s3.amazonaws.com"

#STATICFILES_LOCATION = 'static'
#MEDIAFILES_LOCATION = 'media'
#STATICFILES_STORAGE = 'myproject.custom_storages.StaticStorage'
#DEFAULT_FILE_STORAGE = 'myproject.custom_storages.MediaStorage'

# Django app runs behind a reverse proxy.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
ALLOWED_HOSTS = ['*'] #TODO: CHECK
REGISTRATION_OPEN = $REGISTRATION_OPEN

# Absolute path to the directory root of the local ground instance:
FILE_ROOT = '/var/www/localground'
STATIC_ROOT = '%s/%s' % (FILE_ROOT, STATIC_MEDIA_DIR)
APPS_ROOT = '%s/apps' % FILE_ROOT
USER_MEDIA_ROOT = '%s/%s' % (FILE_ROOT, USER_MEDIA_DIR)
FONT_ROOT = '%s/css/fonts/' % STATIC_ROOT
TEMP_DIR = '%s/tmp/' % FILE_ROOT
QR_READER_PATH = '%s/lib/barcodereader' % APPS_ROOT

MAP_FILE = FILE_ROOT + '/mapserver/localground.map'
#TAGGING_AUTOCOMPLETE_JS_BASE_URL = '/%s/scripts/jquery-autocomplete' % STATIC_MEDIA_DIR

# OS variables:
USER_ACCOUNT = '$USER'		#account to use for creating new OS files / directories
GROUP_ACCOUNT = '$GROUP_ACCOUNT'	#group to use for creating new OS files / directories

# Database Config
HOST = '127.0.0.1'		        #Your Database Host
PORT = '5432'				#Your Database Port
USERNAME = '$USER'			#Your Database Username
PASSWORD = '$DB_PASS'		        #Your Database Password
DATABASE = '$DB_NAME'	        	#Your Database Name

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
" > $userDir$rootDir/apps/settings_local.py
then
		echo -e $"✗ FAIL: There is an ERROR creating $userDir$rootDir/apps/settings_local.py file. \n" | tee -a "$log_file"
		exit;
	else
		echo -e $"✓ SUCCESS: New settings_local.py file Created! \n" | tee -a "$log_file"
fi
