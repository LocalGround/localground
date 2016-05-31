from django import test
from django.core.urlresolvers import resolve
from rest_framework import status
from localground.apps.site import models
from django.contrib.auth.models import User
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
import os, json
from django.core import serializers
from localground.apps.lib.helpers import generic



"""
Really hacky workaround - fixtures are deprecated, so I'm manually loading them here
TODO: move fixture loading into actual python code, probably
This is super duper slow and dumb
"""
fixture_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../fixtures'))
fixture_filenames = ['test_data.json'] #'database_initialization.json', 

def load_test_fixtures():
    #print 'loading test fixtures...'
    for fixture_filename in fixture_filenames:
        fixture_file = os.path.join(fixture_dir, fixture_filename)
    
        fixture = open(fixture_file, 'rb')
        objects = serializers.deserialize('json', fixture, ignorenonexistent=True)
        for obj in objects:
            obj.save()
        fixture.close()

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
    #fixtures = ['test_data.json']

    def setUp(self, load_fixtures=False):
        self._superuser = None
        self._user = None
        self._project = None
        self._csrf_token = None
        self._client_anonymous = None
        self._client_user = None
        self._client_superuser = None
        if load_fixtures:
            load_test_fixtures()


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
            user = self.get_user()
            self._client_user.login(
                username=user.username,
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
        try:
            return User.objects.get(username=username)
        except:
            return self.create_user()

    def create_project(self, user, name='Test Project', authority_id=1, tags=[]):
        import random
        from localground.apps.site import models
        slug = ''.join(random.sample('0123456789abcdefghijklmnopqrstuvwxyz', 16))
        p = models.Project(
            name=name,
            owner=user,
            tags=tags,
            last_updated_by=user,
            access_authority=models.ObjectAuthority.objects.get(
                id=authority_id),
            slug=slug)
        p.save()
        return p
    
    def grant_project_permissions_to_user(self, project, granted_to, authority_id=1):
        uao = models.UserAuthorityObject()
        uao.user = granted_to
        uao.authority = models.UserAuthority.objects.get(id=authority_id)
        uao.granted_by = project.owner
        uao.time_stamp = get_timestamp_no_milliseconds()
        uao.content_type = project.get_content_type()
        uao.object_id = project.id
        uao.save()
        return uao

    def create_snapshot(self, user, name='Test Snapshot', authority_id=1):
        import random
        from django.contrib.gis.geos import Point
        lat = 37.87
        lng = -122.28
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
        slug = ''.join(random.sample('0123456789abcdefghijklmnopqrstuvwxyz', 16))
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
        slug = ''.join(random.sample('0123456789abcdefghijklmnopqrstuvwxyz', 16))
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
        return self.create_project(self.get_user())
        #return models.Project.objects.get(id=project_id)

    def create_marker(self, user, project, name="Marker Test", geoJSON=None, point=None, extras={"key": "value"}, tags=[]):
        geom = None
        if geoJSON is None and point is None:
            from django.contrib.gis.geos import Point
            lat = 37.87
            lng = -122.28
            geom = Point(lng, lat, srid=4326)
        elif point:
            geom = point
        else:
            from django.contrib.gis.geos import GEOSGeometry
            geom = GEOSGeometry(json.dumps(geoJSON))
            
        m = models.Marker(
            project=project,
            name=name,
            owner=user,
            color='CCCCCC',
            extras=extras,
            last_updated_by=user,
            tags=tags
        )
        if geom.geom_type == "Point":
            m.point = geom
        elif geom.geom_type == "LineString":
            m.polyline = geom
        else:
            m.polygon = geom
        m.save()
        return m

    def get_marker(self, marker_id=1):
        return models.Marker.objects.get(id=marker_id)

    def create_print(self, layout_id=1, map_provider=1,
                     lat=55, lng=61.4, zoom=17,
                     map_title='A title',
                     instructions='A description',
                     tags=[]):
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
            layer_ids=None,
            mapimage_ids=None
        )
        p.tags = tags
        p.save()
        p.generate_pdf()
        return p

    def create_form(self, name='A title',
                    description='A description', user=None,
                    authority_id=models.ObjectAuthority.PRIVATE,
                    project=None):

        oa = models.ObjectAuthority.objects.get(
            id=authority_id
        )
        import random
        slug = ''.join(random.sample('0123456789abcdefghijklmnopqrstuvwxyz', 16))
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
        project = project or self.project
        f.projects.add(project)
        f.save()
        return f

    def create_form_with_fields(
            self,
            name='A title',
            description='A description',
            user=None,
            authority_id=models.ObjectAuthority.PRIVATE,
            num_fields=2,
            project=None):
        '''
        TEXT = 1
        INTEGER = 2
        DATETIME = 3
        BOOLEAN = 4
        DECIMAL = 5
        RATING = 6
        PHOTO = 7
        AUDIO = 8
        '''
        if user is None:
            user = self.user
        f = self.create_form(name, description, user=user,
                             authority_id=authority_id,
                             project=project)
        for i in range(0, num_fields):
            field_name = 'Field %s' % (i + 1)
            if i == 0: field_name = 'name'
            fld = self.create_field(name=field_name,
                                data_type=models.DataType.objects.get(id=(i + 1)),
                                ordering=(i + 1),
                                form=f)
            fld.save()
        f.remove_table_from_cache()
        return f

    def create_field(self, form, name='Field 1', data_type=None, ordering=1):
        data_type = data_type or models.DataType.objects.get(id=1)
        f = models.Field(
            col_alias=name,
            data_type=data_type,
            ordering=ordering,
            form=form,
            owner=self.user,
            last_updated_by=self.user
        )
        f.save()
        return f


    def insert_form_data_record(self, form, project=None, photo=None, audio=None, name=None):

        from django.contrib.gis.geos import Point
        # create a marker:
        lat = 37.87
        lng = -122.28
        record = form.TableModel()
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
            elif field.data_type.id == models.DataType.PHOTO:
                setattr(record, field.col_name, photo)
            elif field.data_type.id == models.DataType.AUDIO:
                setattr(record, field.col_name, audio)
            else:
                setattr(record, field.col_name, name or 'some text')
        record.save(user=self.user)
        return record

    def create_imageopt(self, mapimage):
        p = mapimage.source_print
        img = models.ImageOpts(
            source_mapimage=mapimage,
            file_name_orig='some_file_name.png',
            host=mapimage.host,
            virtual_path=mapimage.virtual_path,
            extents=p.extents,
            zoom=p.zoom,
            northeast=p.northeast,
            southwest=p.southwest,
            center=p.center
        )
        img.save(user=mapimage.owner)
        return img

    def create_mapimage(self, user, project, tags=[], name='MapImage Name'):
        p = self.create_print(map_title='A mapimage-linked print')
        mapimage = models.MapImage(
            project=project,
            owner=user,
            last_updated_by=user,
            source_print=p,
            name=name,
            uuid=generic.generateID(),
            tags=tags,
            description='MapImage Description',
            status=models.StatusCode.get_status(
                models.StatusCode.PROCESSED_SUCCESSFULLY),
            upload_source=models.UploadSource.get_source(
                models.UploadSource.WEB_FORM))
        mapimage.save()
        mapimage.processed_image = self.create_imageopt(mapimage)
        mapimage.save()
        return mapimage

    def create_photo(self, user, project, name='Photo Name',
                     file_name='myphoto.jpg', device='HTC',
                     point=None, tags=[]):
        from localground.apps.site import models
        photo = models.Photo(
            project=project,
            owner=user,
            last_updated_by=user,
            name=name,
            description='Photo Description',
            file_name_orig=file_name,
            device=device,
            point=point,
            tags=tags
        )
        photo.save()
        return photo

    def create_audio(self, user, project, name='Audio Name',
                     file_name='my_audio.jpg', tags=[], point=None):
        audio = models.Audio(
            project=project,
            owner=user,
            last_updated_by=user,
            name=name,
            description='Audio Description',
            file_name_orig=file_name,
            tags=tags,
            point=point,
        )
        audio.save()
        return audio
    
    def create_relation(self, entity_type, marker=None, id=1, ordering=1, turned_on=False):
        if marker is None:
            marker = self.marker
        r = models.GenericAssociation(
            entity_type=entity_type,
            entity_id=id,
            source_type=models.Marker.get_content_type(),
            source_id=marker.id,
            ordering=ordering,
            owner=self.user,
            turned_on=turned_on,
            last_updated_by=self.user
        )
        r.save()
        return r

class ViewAnonymousMixin(ModelMixin):
    #fixtures = ['test_data.json']

    def setUp(self, load_fixtures=False):
        ModelMixin.setUp(self, load_fixtures=load_fixtures)

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
    #fixtures = ['test_data.json']

    def setUp(self, load_fixtures=False):
        ViewAnonymousMixin.setUp(self, load_fixtures=load_fixtures)

    def test_page_403_or_302_status_anonymous_user(self, urls=None):
        if urls is None:
            urls = self.urls
        for url in urls:
            response = self.client_anonymous.get(url)
            self.assertIn(response.status_code, [
                status.HTTP_302_FOUND,
                status.HTTP_403_FORBIDDEN
            ])
