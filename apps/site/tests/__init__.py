from django import test
from django.core.urlresolvers import resolve
from rest_framework import status
from localground.apps.site import models
from django.contrib.auth.models import User
from localground.apps.lib.helpers import get_timestamp_no_milliseconds


class Client(test.Client):

    '''
    Extended Client to support PATCH method based on this code discussion:
    https://code.djangoproject.com/ticket/17797
    '''

    def patch(self, path, data='', content_type='application/octet-stream',
              follow=False, **extra):
        """
        Send a resource to the server using PATCH.
        """
        response = self.generic('PATCH', path, data=data,
                                content_type=content_type, **extra)
        if follow:
            response = self._handle_redirects(response, **extra)
        return response


class ModelMixin(object):
    user_password = 'top_secret'
    fixtures = ['initial_data.json', 'test_data.json']

    def setUp(self):
        self._superuser = None
        self._user = None
        self._project = None
        self._csrf_token = None
        self._client_anonymous = None
        self._client_user = None
        self._client_superuser = None

    @property
    def user(self):
        if self._user is None:
            self._user = self.get_user()
        return self._user

    @property
    def superuser(self):
        if self._superuser is None:
            self._superuser = self.create_superuser()
        return self._superuser

    @property
    def project(self):
        if self._project is None:
            self._project = self.get_project()
        return self._project

    @property
    def csrf_token(self):
        if self._csrf_token is None:
            c = Client()
            response = c.get('/accounts/login/')
            self._csrf_token = unicode(response.context['csrf_token'])
        return self._csrf_token

    @property
    def client_anonymous(self):
        if self._client_anonymous is None:
            self._client_anonymous = Client(enforce_csrf_checks=True)
        return self._client_anonymous

    @property
    def client_user(self):
        if self._client_user is None:
            self._client_user = Client(enforce_csrf_checks=True)
            self._client_user.login(
                username='tester',
                password=self.user_password)
            self._client_user.cookies['csrftoken'] = self.csrf_token
        return self._client_user

    @property
    def client_superuser(self):
        if self._client_superuser is None:
            self._client_superuser = Client(enforce_csrf_checks=True)
            self._client_superuser.login(
                username=self.superuser.username,
                password=self.user_password
            )
            self._client_superuser.cookies['csrftoken'] = self.csrf_token
        return self._client_superuser

    def create_user(self, username='tester'):
        return User.objects.create_user(
            username,
            first_name='test',
            email='',
            password=self.user_password)

    def create_superuser(self, username='superuser'):
        return User.objects.create_superuser(
            username,
            first_name='superuser',
            email='',
            password=self.user_password)

    def get_user(self, username='tester'):
        return User.objects.get(username=username)

    def create_project(self, user, name='Test Project', authority_id=1):
        import random
        slug = random.sample('0123456789abcdefghijklmnopqrstuvwxyz', 16)
        p = models.Project(
            name=name,
            owner=user,
            last_updated_by=user,
            access_authority=models.ObjectAuthority.objects.get(
                id=authority_id),
            slug=slug)
        p.save()
        return p

    def create_snapshot(self, user, name='Test Snapshot', authority_id=1):
        import random
        from django.contrib.gis.geos import Point
        lat = 37.8705
        lng = -122.2819
        slug = ''.join(random.sample('0123456789abcdefghijklmnopqrstuvwxyz', 16))
        v = models.Snapshot(
            name=name,
            owner=user,
            last_updated_by=user,
            access_authority=models.ObjectAuthority.objects.get(
                id=authority_id),
            slug=slug,
            center=Point(
                lng,
                lat,
                srid=4326),
            zoom=19,
            basemap=models.WMSOverlay.objects.get(
                id=4),
        )
        v.save()
        return v
    
    def create_layer(self, user, name='Test Layer', authority_id=1):
        import random
        slug = random.sample('0123456789abcdefghijklmnopqrstuvwxyz', 16)
        l = models.Layer(
            name=name,
            owner=user,
            last_updated_by=user,
            access_authority=models.ObjectAuthority.objects.get(
                id=authority_id)
        )
        l.save()
        return l

    def create_presentation(
            self,
            user,
            name='Test Presentation',
            authority_id=1):
        import random
        slug = random.sample('0123456789abcdefghijklmnopqrstuvwxyz', 16)
        p = models.Presentation(
            name=name,
            owner=user,
            last_updated_by=user,
            access_authority=models.ObjectAuthority.objects.get(
                id=authority_id),
            slug=slug)
        p.save()
        return p

    def _add_group_user(self, group, user, authority_id):
        uao = models.UserAuthorityObject(
            object_id=group.id,
            content_type=group.get_content_type(),
            user=user,
            authority=models.UserAuthority.objects.get(id=authority_id),
            time_stamp=get_timestamp_no_milliseconds(),
            granted_by=group.owner
        )
        uao.save()

    def add_group_viewer(self, group, user):
        self._add_group_user(group, user, models.UserAuthority.CAN_VIEW)

    def add_group_editor(self, group, user):
        self._add_group_user(group, user, models.UserAuthority.CAN_EDIT)

    def add_group_manager(self, group, user):
        self._add_group_user(group, user, models.UserAuthority.CAN_MANAGE)

    def get_project(self, project_id=1):
        return models.Project.objects.get(id=project_id)

    def create_marker(self, user, project):
        from django.contrib.gis.geos import Point
        # create a marker:
        lat = 37.8705
        lng = -122.2819
        m = models.Marker(
            project=project,
            owner=user,
            color='CCCCCC',
            last_updated_by=user,
            point=Point(lng, lat, srid=4326)
        )
        m.save()
        return m

    def get_marker(self, marker_id=1):
        return models.Marker.objects.get(id=marker_id)

    def create_print(self, layout_id=1, map_provider=1,
                     lat=55, lng=61.4, zoom=17,
                     map_title='A title',
                     instructions='A description'):
        from django.contrib.gis.geos import Point
        p = models.Print.insert_print_record(
            self.user,
            self.project,
            models.Layout.objects.get(id=layout_id),
            models.WMSOverlay.objects.get(id=map_provider),
            zoom,
            Point(lng, lat, srid=4326),
            'http://localground.stage',
            map_title=map_title,
            instructions=instructions,
            form=None,
            layer_ids=None,
            scan_ids=None
        )
        p.generate_pdf(has_extra_form_page=False)
        return p

    def create_form(self, name='A title',
                    description='A description', user=None,
                    authority_id=models.ObjectAuthority.PRIVATE):

        oa = models.ObjectAuthority.objects.get(
            id=authority_id
        )
        import random
        slug = random.sample('0123456789abcdefghijklmnopqrstuvwxyz', 16)
        if user is None:
            user = self.user
        f = models.Form(
            owner=user,
            name=name,
            slug=slug,
            description=description,
            last_updated_by=user,
            access_authority=oa
        )
        f.save()
        f.projects.add(self.project)
        f.save()
        return f

    def create_form_with_fields(
            self,
            name='A title',
            description='A description',
            user=None,
            authority_id=models.ObjectAuthority.PRIVATE,
            num_fields=2):
        '''
        TEXT = 1
        INTEGER = 2
        DATE_TIME = 3
        BOOL = 4
        DECIMAL = 5
        RATING = 6
        '''
        if user is None:
            user = self.user
        f = self.create_form(name, description, user=user,
                             authority_id=authority_id)
        for i in range(0, num_fields):
            # add 2 fields to form:
            fld = self.create_field(name='Field %s' % (i + 1),
                                data_type=models.DataType.objects.get(id=(i + 1)),
                                ordering=(i + 1),
                                form=f)
            fld.save()
        f.clear_table_model_cache()
        return f
    
    def create_field(self, form, name='Field 1', data_type=None, ordering=1):
        data_type = data_type or models.DataType.objects.get(id=1)
        f = models.Field(
            col_alias=name,
            data_type=data_type,
            display_width=10,
            ordering=ordering,
            form=form,
            owner=self.user,
            last_updated_by=self.user
        )
        f.save()
        return f
    

    def insert_form_data_record(self, form, project=None):

        from django.contrib.gis.geos import Point
        # create a marker:
        lat = 37.8705
        lng = -122.2819
        record = form.TableModel()
        record.num = 1
        record.point = Point(lng, lat, srid=4326)
        if project:
            record.project = project

        # generate different dummy types depending on the data_type
        for field in form.fields:
            if field.data_type.id in [
                    models.DataType.INTEGER,
                    models.DataType.RATING]:
                setattr(record, field.col_name, 5)
            elif field.data_type.id == models.DataType.BOOL:
                setattr(record, field.col_name, True)
            elif field.data_type.id == models.DataType.DATE_TIME:
                setattr(
                    record,
                    field.col_name,
                    get_timestamp_no_milliseconds())
            elif field.data_type.id == models.DataType.DECIMAL:
                setattr(record, field.col_name, 3.14159)
            else:
                setattr(record, field.col_name, 'some text')
        record.save(user=self.user)
        return record

    def create_imageopt(self, scan):
        p = scan.source_print
        img = models.ImageOpts(
            source_scan=scan,
            file_name_orig='some_file_name.png',
            host=scan.host,
            virtual_path=scan.virtual_path,
            extents=p.extents,
            zoom=p.zoom,
            northeast=p.northeast,
            southwest=p.southwest,
            center=p.center
        )
        img.save(user=scan.owner)
        return img

    def create_scan(self, user, project):
        p = self.create_print(map_title='A scan-linked print')
        scan = models.Scan(
            project=project,
            owner=user,
            last_updated_by=user,
            source_print=p,
            name='Scan Name',
            description='Scan Description',
            status=models.StatusCode.get_status(
                models.StatusCode.PROCESSED_SUCCESSFULLY),
            upload_source=models.UploadSource.get_source(
                models.UploadSource.WEB_FORM))
        scan.save()
        scan.processed_image = self.create_imageopt(scan)
        scan.save()
        return scan

    def create_photo(self, user, project, name='Photo Name',
                     file_name='my_photo.jpg'):
        photo = models.Photo(
            project=project,
            owner=user,
            last_updated_by=user,
            name=name,
            description='Photo Description',
            file_name_orig=file_name
        )
        photo.save()
        return photo

    def create_audio(self, user, project, name='Audio Name',
                     file_name='my_audio.jpg'):
        audio = models.Audio(
            project=project,
            owner=user,
            last_updated_by=user,
            name=name,
            description='Audio Description',
            file_name_orig=file_name
        )
        audio.save()
        return audio

class ViewAnonymousMixin(ModelMixin):
    fixtures = ['initial_data.json', 'test_data.json']

    def setUp(self):
        ModelMixin.setUp(self)

    def test_page_200_status_basic_user(self, urls=None, **kwargs):
        if urls is None:
            urls = self.urls
        for url in urls:
            #print url
            response = self.client_user.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            
    def test_page_resolves_to_view(self, urls=None):
        if urls is None:
            urls = self.urls
        for url in urls:
            func = resolve(url).func
            func_name = '{}.{}'.format(func.__module__, func.__name__)
            view_name = '{}.{}'.format(
                self.view.__module__,
                self.view.__name__)
            # print url, func_name, view_name
            self.assertEqual(func_name, view_name)
            
class ViewMixin(ViewAnonymousMixin):
    fixtures = ['initial_data.json', 'test_data.json']

    def setUp(self):
        ViewAnonymousMixin.setUp(self)

    def test_page_403_or_302_status_anonymous_user(self, urls=None):
        if urls is None:
            urls = self.urls
        for url in urls:
            response = self.client_anonymous.get(url)
            self.assertIn(response.status_code, [
                status.HTTP_302_FOUND,
                status.HTTP_403_FORBIDDEN
            ])


# import tests from other directories:
from localground.apps.site.api.tests import *
from localground.apps.site.tests.views import *
from localground.apps.site.tests.security import *
