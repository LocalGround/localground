# Django settings for localground project.
# https://django-oauth-toolkit.readthedocs.org/en/latest/tutorial/tutorial.html
import os

DEBUG = True
TEMPLATE_DEBUG = DEBUG
#GDAL_LIBRARY_PATH = os.environ.get('GDAL_PATH', '/usr/lib/libgdal.so')     #replace with your GDAL path

ADMINS = (
    ('Jane Admin', os.environ.get('ADMIN_EMAIL_ADDRESS', 'email@yoursite.com')),
)
DEFAULT_FROM_EMAIL = '"Site Support" <%s>' % os.environ.get('ADMIN_EMAIL_ADDRESS', 'email@yoursite.com')
ADMIN_EMAILS = [os.environ.get('ADMIN_EMAIL_ADDRESS', 'email@yoursite.com'), ]
EMAIL_HOST = os.environ.get('HOST', '127.0.0.1') 
EMAIL_PORT = os.environ.get('EMAIL_PORT', '25') 
EMAIL_HOST_USER = ''
LOGIN_REDIRECT_URL = '/'
EMAIL_HOST_PASSWORD = ''
EMAIL_USE_TLS = False
EMAIL_BACKEND = 'sgbackend.SendGridBackend'
SENDGRID_API_KEY = "SENDGRID API KEY"
REGISTRATION_OPEN = True
ONLY_SUPERUSERS_CAN_REGISTER_PEOPLE = False
ACCOUNT_ACTIVATION_DAYS = 5
SESSION_COOKIE_NAME = 'sessionid'

#TEST_RUNNER = 'django.test.simple.DjangoTestSuiteRunner'
TEST_RUNNER = 'django.test.runner.DiscoverRunner'

# Custom Local Variables
PROTOCOL = 'https'
SERVER_HOST = os.environ.get('SERVER_HOST', 'yoursite.com')
SERVER_URL = '%s//%s' % (PROTOCOL, SERVER_HOST)

FILE_ROOT = os.environ.get('FILE_ROOT', '/home/directory/for/localground') 
STATIC_MEDIA_DIR = 'static'
STATIC_URL = '/static/'
USER_MEDIA_DIR = 'userdata'

# Absolute path to the directory root of the local ground instance:
STATIC_ROOT = '%s/%s' % (FILE_ROOT, STATIC_MEDIA_DIR)
APPS_ROOT = '%s/apps' % FILE_ROOT
USER_MEDIA_ROOT = '%s/%s' % (FILE_ROOT, USER_MEDIA_DIR)
FONT_ROOT = '%s/css/fonts/' % STATIC_ROOT
TEMP_DIR = '%s/tmp/' % FILE_ROOT
QR_READER_PATH = '%s/lib/barcodereader' % APPS_ROOT

MAP_FILE = FILE_ROOT + '/mapserver/localground.map'
TAGGING_AUTOCOMPLETE_JS_BASE_URL = '/%s/scripts/jquery-autocomplete' % STATIC_MEDIA_DIR

# From Google Developer Console:
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = 'YOUR_CLIENT_KEY'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'YOUR_SECRET'

#SWAMP_DRAGON_CONNECTION = ('swampdragon.connections.sockjs_connection.DjangoSubscriberConnection', '/data')

DEFAULT_BASEMAP_ID = 12

#OS variables:
USER_ACCOUNT = os.environ.get('USER', 'linux-user-account')     #account to use for creating new OS files / directories
GROUP_ACCOUNT = os.environ.get('USER', 'linux-user-group')    #group to use for creating new OS files / directories

FILE_UPLOAD_MAX_MEMORY_SIZE = 4621440                       #default is 2621440
IS_GOOGLE_REGISTERED_NONPROFIT = False


MANAGERS = ADMINS
AUTH_PROFILE_MODULE = 'site.UserProfile'

DB_HOST = os.environ.get('DB_HOST', '127.0.0.1')               #Your Database Host
DB_PORT = os.environ.get('DB_PORT', '5432')                    #Your Database Port
DB_USER = os.environ.get('DB_USER', 'DB_USER')         #Your Database Username
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'DB_PASSWORD')     #Your Database Password
DB_NAME = os.environ.get('DB_NAME', 'DB_NAME')             #Your Database Name

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis', #Code works w/PostGIS
        'NAME': DB_NAME, 
        'USER': DB_USER,
        'PASSWORD': DB_PASSWORD,
        'HOST': DB_HOST,
        'PORT': DB_PORT, 
    }
}

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# On Unix systems, a value of None will cause Django to use the same
# timezone as the operating system.
# If running in a Windows environment this must be set to the same as your
# system time zone.
TIME_ZONE = 'UTC'

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

JQUERY_PATH = '//code.jquery.com/jquery-1.12.0.min.js'
JQUERY_UI_PATH = '//code.jquery.com/ui/1.9.2/jquery-ui.min.js'
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
    'corsheaders.middleware.CorsMiddleware',
    'localground.apps.middleware.impersonate.ImpersonateMiddleware'
)

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.core.context_processors.request',
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'localground.apps.middleware.context_processors.persistant_queries', #for our application-level context objects
    'social.apps.django_app.context_processors.backends',
    'social.apps.django_app.context_processors.login_redirect',
)



AUTHENTICATION_BACKENDS = (
    'social.backends.google.GoogleOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_PIPELINE = (
    'social.pipeline.social_auth.social_details',
    'social.pipeline.social_auth.social_uid',
    'social.pipeline.social_auth.auth_allowed',
    'social.pipeline.social_auth.social_user',
    'social.pipeline.user.get_username',
    'social.pipeline.social_auth.associate_by_email',  # <--- enable this one
    'social.pipeline.user.create_user',
    'social.pipeline.social_auth.associate_user',
    'social.pipeline.social_auth.load_extra_data',
    'social.pipeline.user.user_details'
)

ROOT_URLCONF = 'localground.apps.site.urls'

TEMPLATE_DIRS = (
    '%s/templates' % APPS_ROOT,
)
#FIXTURE_DIRS = (
#    '%s/fixtures' % APPS_ROOT,
#)

LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/'
SOCIAL_AUTH_LOGIN_REDIRECT_URL = '/'

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.gis',
    'django.contrib.staticfiles',
    'localground',
    'localground.apps',
    'localground.apps.management',
    'localground.apps.site',
    #'localground.apps.registration',        #taken from the django-registration module
    'tagging',                              #for tagging of blog posts in Django
    'django.contrib.admin',
    'rest_framework',
    'corsheaders',
    'djcelery',
    'social.apps.django_app.default',
)

REST_FRAMEWORK = {
    'PAGINATE_BY': 10,
    'PAGINATE_BY_PARAM': 'page_size',
    'MAX_PAGINATE_BY': 8000,
    'DEFAULT_METADATA_CLASS': 'localground.apps.site.api.metadata.CustomMetadata',
    'DEFAULT_RENDERER_CLASSES': (
        'localground.apps.site.api.renderers.BrowsableAPIRenderer',
        'rest_framework.renderers.JSONRenderer',
        'rest_framework_jsonp.renderers.JSONPRenderer',
        'localground.apps.site.api.renderers.CSVRenderer',
        'rest_framework_xml.renderers.XMLRenderer',
        'localground.apps.site.api.renderers.GeoJSONRenderer',
        'localground.apps.site.api.renderers.KMLRenderer',
        'localground.apps.site.api.renderers.ZIPRenderer',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
        'localground.apps.site.api.permissions.CheckProjectPermissions',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'rest_framework.filters.DjangoFilterBackend',
    ),
    # Commenting out authentication classes for now. It was throwing a
    # really weird error for shared projects
    #
    #'DEFAULT_AUTHENTICATION_CLASSES': (
    #    'rest_framework.authentication.BasicAuthentication',
    #    'rest_framework.authentication.SessionAuthentication',
    #),
    'TEST_REQUEST_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'localground.apps.site.api.renderers.GeoJSONRenderer',
        'rest_framework_xml.renderers.XMLRenderer'
    )
}
SWAMP_DRAGON_CONNECTION = ('swampdragon.connections.sockjs_connection.DjangoSubscriberConnection', '/data')
SWAMP_DRAGON_REDIS_PORT = 6379 #default
SWAMP_DRAGON_PORT = 9999 #default
DRAGON_URL='http://sd.localground.org:7777/' #remove port for prod
#Other swampdragon settings that may be important for production server
#SWAMP_DRAGON_REDIS_HOST - defaults to localhost
#SWAMP_DRAGON_HOST - defaults to localhost
#SWAMP_DRAGON_REDIS_DB - redis db number, defaults to 0
#SWAMP_DRAGON - dict exposed to javascript users if you embed
#                        {% load swampdragon_tags %} in a template with 
#                        {% swampdragon_settings %} somewhere in the page
SWAMP_DRAGON = {'um': 'okay'}

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_HEADERS = (
    'x-requested-with',
    'content-type',
    'accept',
    'origin',
    'authorization',
    'x-csrftoken',
    'accept-encoding' #needed for Safari to work
)

ACCOUNT_ACTIVATION_DAYS = 7

# Local settings override project settings
try:
    LOCAL_SETTINGS
except NameError:
    try:
        from settings_local import *
    except ImportError:
        pass


