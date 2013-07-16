# Django settings for localground project.

DEBUG = True
TEMPLATE_DEBUG = DEBUG
GDAL_LIBRARY_PATH='/usr/lib/libgdal.so'     #replace with your GDAL path

ADMINS = (
    ('Jane Admin', 'email@yoursite.com'),
)
DEFAULT_FROM_EMAIL = '"Site Support" <support@yoursite.com>'
ADMIN_EMAILS = ['admin1@yoursite.com', 'admin2@yoursite.com']
EMAIL_HOST = 'localhost'
EMAIL_PORT = 25
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
EMAIL_USE_TLS = False
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
REGISTRATION_OPEN = True
ONLY_SUPERUSERS_CAN_REGISTER_PEOPLE = False
ACCOUNT_ACTIVATION_DAYS = 5
SESSION_COOKIE_NAME = 'sessionid'

# Custom Local Variables
SERVER_HOST = 'yoursite.com'
SERVER_URL = 'http://%s' % SERVER_HOST

FILE_ROOT = '/home/directory/for/localground'
STATIC_MEDIA_DIR = 'static'
STATIC_URL = '/static/'
USER_MEDIA_DIR = 'userdata'

# Absolute path to the directory root of the local ground instance:
STATIC_ROOT = '%s/%s' % (FILE_ROOT, STATIC_MEDIA_DIR)
APPS_ROOT = '%s/apps' % FILE_ROOT
USER_MEDIA_ROOT = '%s/%s' % (FILE_ROOT, USER_MEDIA_DIR)
FONT_ROOT = '%s/css/fonts/' % STATIC_ROOT
TEMP_DIR = '%s/tmp/' % FILE_ROOT
QR_READER_PATH = '%s/barcodereader/' % FILE_ROOT

MAP_FILE = FILE_ROOT + '/mapserver/localground.map'
TAGGING_AUTOCOMPLETE_JS_BASE_URL = '/%s/scripts/jquery-autocomplete' % STATIC_MEDIA_DIR

DEFAULT_BASEMAP_ID = 12
#OS variables:
USER_ACCOUNT = 'linux-user-account'     #account to use for creating new OS files / directories
GROUP_ACCOUNT = 'linux-user-group'      #group to use for creating new OS files / directories

FILE_UPLOAD_MAX_MEMORY_SIZE = 4621440   #default is 2621440
CLOUDMADE_KEY = 'CLOUDMADE_KEY'         #http://support.cloudmade.com/answers/api-keys-and-authentication
IS_GOOGLE_REGISTERED_NONPROFIT = False


MANAGERS = ADMINS
AUTH_PROFILE_MODULE = 'site.UserProfile'

HOST = '127.0.0.1'          #Your Database Host
PORT = '#####'              #Your Database Port
USERNAME = 'DB_USER'        #Your Database Username
PASSWORD = 'DB_PASSWORD'    #Your Database Password
DATABASE = 'DB_NAME'        #Your Database Name

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

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = None

DATE_INPUT_FORMATS = ('%m/%d/%Y', '%Y-%m-%d', '%m/%d/%y', '%m-%d-%y', '%m-%d-%Y')
TIME_INPUT_FORMATS = ('%I:%M:%S %p', '%H:%M:%S', '%H:%M')

#dynamically build datetime formats from tuples above:
DATETIME_INPUT_FORMATS = []
for date_format in DATE_INPUT_FORMATS:
    for time_format in TIME_INPUT_FORMATS:
        DATETIME_INPUT_FORMATS.append(date_format + ' ' + time_format)  
DATETIME_INPUT_FORMATS = tuple(DATETIME_INPUT_FORMATS)

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

SITE_ID = 1

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale
USE_L10N = True

JQUERY_PATH = 'http://code.jquery.com/jquery-1.8.0.min.js'
JQUERY_UI_PATH = 'http://code.jquery.com/ui/1.9.2/jquery-ui.min.js'
BOOTSTRAP_JS_PATH = '/static/bootstrap2.2.2/js/complete/bootstrap.min.js'

# Make this unique, and don't share it with anybody.
SECRET_KEY = '+z2(@u0ev(4k5p())l38j$ea6o$@irxtc_8qgp-^a60qn239**'

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader'
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'localground.apps.middleware.impersonate.ImpersonateMiddleware'
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.core.context_processors.request',
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.contrib.messages.context_processors.messages',
    'localground.apps.middleware.context_processors.persistant_queries', #for our application-level context objects
)

ROOT_URLCONF = 'localground.apps.site.urls'

TEMPLATE_DIRS = (
    '%s/templates' % APPS_ROOT,
)
FIXTURE_DIRS = (
    '%s/fixtures' % APPS_ROOT,
)

LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/'

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.gis',
    'django.contrib.messages',
    'localground',
    'localground.apps',
    'localground.apps.site',
    'localground.apps.registration',     #taken from the django-registration module
    'tagging',                      #for tagging of blog posts in Django
    'django.contrib.admin',
    'localground.apps.jobs',
    'rest_framework',
)

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAdminUser',),
    'PAGINATE_BY': 10,
    'DEFAULT_RENDERER_CLASSES': (
        #'localground.apps.site.api.renderers.BrowsableAPIRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.JSONPRenderer',
        'localground.apps.site.api.renderers.CSVRenderer',
        'rest_framework.renderers.XMLRenderer'
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly',
    ),
    'DEFAULT_FILTER_BACKENDS': ('rest_framework.filters.DjangoFilterBackend',)
}

# Local settings override project settings
try:
    LOCAL_SETTINGS
except NameError:
    try:
        from settings_local import *
    except ImportError:
        pass


