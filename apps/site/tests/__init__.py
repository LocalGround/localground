from django import test
from django.conf import settings
from django.core.urlresolvers import resolve
from rest_framework import status
from localground.apps.site import models
from localground.apps.site.models import DataType
from django.contrib.auth.models import User
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
import os
import json
from localground.apps.site import models
from django.core import serializers
from localground.apps.lib.helpers import generic


"""
Hacky workaround - fixtures are deprecated, so I'm manually loading them here
TODO: move fixture loading into actual python code, probably
This is super duper slow and dumb
"""
fixture_dir = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '../../fixtures'))
fixture_filenames = ['test_data.json']  # 'database_initialization.json',


def load_test_fixtures():
    # print 'loading test fixtures...'
    for fixture_filename in fixture_filenames:
        fixture_file = os.path.join(fixture_dir, fixture_filename)

        fixture = open(fixture_file, 'rb')
        objects = serializers.deserialize(
            'json', fixture, ignorenonexistent=True)
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
    # fixtures = ['test_data.json']

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
        except Exception:
            return self.create_user()

    def create_project(self, user=None, name='Test Project',
                       authority_id=1, tags=[]):
        import random
        from localground.apps.site import models
        slug = ''.join(
            random.sample('0123456789abcdefghijklmnopqrstuvwxyz', 16)
        )
        user = user or self.user
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

    def grant_project_permissions_to_user(self,
                                          project, granted_to, authority_id=1):
        from localground.apps.site import models
        uao = models.UserAuthorityObject()
        uao.user = granted_to
        uao.authority = models.UserAuthority.objects.get(id=authority_id)
        uao.granted_by = project.owner
        uao.time_stamp = get_timestamp_no_milliseconds()
        uao.content_type = project.get_content_type()
        uao.object_id = project.id
        uao.save()
        return uao

    '''
    TODO: Fix this method
    def create_layer(self, user=None, name='Test Layer', authority_id=1):
        from localground.apps.site import models
        import random
        slug = ''.join(
            random.sample('0123456789abcdefghijklmnopqrstuvwxyz', 16)
        )
        user = user or self.user
        layer = models.Layer(
            title='my first layer',
            data_source='photos',
            layer_type='basic',
            map_id=1
        )
        layer.save()
        return layer
    '''

    def create_layer(self):
        layer = models.Layer(
            last_updated_by=self.user,
            owner=self.user,
            styled_map=self.create_styled_map()
        )
        layer.save()
        return layer

    def create_generic_association(self):
        marker = self.create_marker()
        photo = self.create_photo()

        gen_ass = models.GenericAssociation(
            source_object=marker,
            entity_object=photo,
            last_updated_by=self.user,
            owner=self.user
        )
        gen_ass.save()
        return gen_ass

    def _add_group_user(self, group, user, authority_id):
        from localground.apps.site import models
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
        from localground.apps.site import models
        self._add_group_user(group, user, models.UserAuthority.CAN_VIEW)

    def add_group_editor(self, group, user):
        from localground.apps.site import models
        self._add_group_user(group, user, models.UserAuthority.CAN_EDIT)

    def add_group_manager(self, group, user):
        from localground.apps.site import models
        self._add_group_user(group, user, models.UserAuthority.CAN_MANAGE)

    def get_project(self, project_id=1):
        return self.create_project(self.get_user())

    def create_marker(self, user=None, project=None, name="Marker Test",
                      geoJSON=None, point=None, extras={"key": "value"},
                      tags=[]):
        from localground.apps.site import models
        geom = None
        user = user or self.user
        project = project or self.project
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
        from localground.apps.site import models
        return models.Marker.objects.get(id=marker_id)

    def create_print_without_image(
            self, layout_id=1, map_provider=1, lat=55, lng=61.4, zoom=17,
            map_title='A title', instructions='A description', tags=[],
            generate_pdf=True):
        from django.conf import settings
        from localground.apps.site import models
        layout = models.Layout.objects.get(id=layout_id)
        tileset = models.TileSet.objects.get(id=map_provider)
        uuid = generic.generateID()
        user = self.user
        p = models.Print(
            uuid=uuid,
            project=self.project,
            zoom=zoom,
            map_width=layout.map_width_pixels,
            map_height=layout.map_height_pixels,
            map_provider=tileset,
            owner=user,
            last_updated_by=user,
            layout=layout,
            host=settings.SERVER_HOST,
            map_image_path='map.jpg',
            pdf_path='Print_' + uuid + '.pdf',
            preview_image_path='thumbnail.jpg',
            name=map_title,
            description=instructions,
            center=None,
            northeast=None,
            southwest=None,
            extents=None,
            virtual_path='/%s/%s/%s/' % (
                settings.USER_MEDIA_DIR, 'prints', uuid
            )
        )
        p.save()
        return p

    def create_print(self, layout_id=1, map_provider=1,
                     lat=55, lng=61.4, zoom=17,
                     map_title='A title',
                     instructions='A description',
                     tags=[], generate_pdf=True):
        from localground.apps.site import models
        from django.contrib.gis.geos import Point
        p = models.Print.insert_print_record(
            self.user,
            self.project,
            models.Layout.objects.get(id=layout_id),
            models.TileSet.objects.get(id=map_provider),
            zoom,
            Point(lng, lat, srid=4326),
            settings.SERVER_HOST,
            map_title=map_title,
            instructions=instructions,
            mapimage_ids=None
        )
        p.tags = tags
        p.save()
        if generate_pdf:
            p.generate_pdf()
        return p

    def create_form(self, name='A title',
                    description='A description', user=None,
                    project=None):

        from localground.apps.site import models
        f = models.Form(
            owner=user or self.user,
            name=name,
            description=description,
            last_updated_by=user or self.user,
            project=project or self.project
        )
        f.save()
        return f

    def create_form_with_fields(
            self,
            name='A title',
            description='A description',
            user=None,
            num_fields=2,
            project=None):
        '''
        TEXT = 1
        INTEGER = 2
        DATETIME = 3
        BOOLEAN = 4
        DECIMAL = 5
        RATING = 6
        CHOICE = 7
        PHOTO = 8
        AUDIO = 9
        '''
        if user is None:
            user = self.user
        f = self.create_form(name, description, user=user,
                             project=project)
        for i in range(0, num_fields):
            field_name = 'Field %s' % (i + 1)
            if i == 0: field_name = 'name'
            fld = self.create_field(name=field_name,
                                data_type=DataType.objects.get(id=(i + 1)),
                                ordering=(i + 1),
                                form=f)
            fld.save()
        f.remove_table_from_cache()
        return f

    def create_field(self, form, name='Field 1',
                     data_type=None, ordering=1, is_display_field=False):
        from localground.apps.site import models
        data_type = data_type or DataType.objects.get(id=1)
        f = models.Field(
            col_alias=name,
            data_type=data_type,
            ordering=ordering,
            is_display_field=is_display_field,
            form=form,
            owner=self.user,
            last_updated_by=self.user
        )
        f.save()
        return f

    def insert_form_data_record(self, form, project=None, photo=None,
                                audio=None, name=None):

        from django.contrib.gis.geos import Point
        # create a marker:
        lat = 37.87
        lng = -122.28
        project = project or self.project
        record = form.TableModel()
        record.point = Point(lng, lat, srid=4326)
        if project:
            record.project = project

        # generate different dummy types depending on the data_type
        for field in form.fields:
            if field.data_type.id in [
                    DataType.DataTypes.INTEGER,
                    DataType.DataTypes.RATING]:
                setattr(record, field.col_name, 5)
            elif field.data_type.id == DataType.DataTypes.BOOLEAN:
                setattr(record, field.col_name, True)
            elif field.data_type.id == DataType.DataTypes.DATETIME:
                setattr(
                    record,
                    field.col_name,
                    get_timestamp_no_milliseconds())
            elif field.data_type.id == DataType.DataTypes.DECIMAL:
                setattr(record, field.col_name, 3.14159)
            elif field.data_type.id == DataType.DataTypes.PHOTO:
                setattr(record, field.col_name, photo)
            elif field.data_type.id == DataType.DataTypes.AUDIO:
                setattr(record, field.col_name, audio)
            elif field.data_type.id == DataType.DataTypes.CHOICE:
                setattr(record, field.col_name, 'blue')
            else:
                setattr(record, field.col_name, name or 'some text')
        record.save(user=self.user)
        return record

    def create_imageopt(self, mapimage):
        from localground.apps.site import models
        user = self.user
        img = models.ImageOpts(
            source_mapimage=mapimage,
            opacity=1,
            name='map image test',
            file_name_orig='map_image_opts1.jpg',
            virtual_path='/userdata/media/' + user.username + '/map-images/',
            host=settings.SERVER_HOST
        )
        img.save(user=mapimage.owner)
        return img

    def create_mapimage(self, user=None, project=None, tags=[],
                        name='MapImage Name', generate_print=False):

        from localground.apps.site import models
        if generate_print:
            p = self.create_print(
                map_title='A mapimage-linked print'
            )
        else:
            p = self.create_print_without_image(
                map_title='A mapimage-linked print'
            )
        user = user or self.user
        project = project or self.project
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
                models.UploadSource.WEB_FORM),
            virtual_path='/userdata/media/' + user.username + '/map-images/',
            host=settings.SERVER_HOST,
            file_name_orig='map_image.jpg',
            file_name_thumb='map_image_thumb.jpg'
        )
        mapimage.save()
        mapimage.processed_image = self.create_imageopt(mapimage)
        mapimage.save()
        return mapimage

    def create_photo(self, user=None, project=None, name='Photo Name',
                     file_name='myphoto.jpg', device='HTC',
                     point=None, tags=[]):
        from localground.apps.site import models
        user = user or self.user
        project = project or self.project
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

    def create_video(self, user=None, project=None, name='Video Name',
                     provider='youtube', video_id='4232534',
                     point=None, tags=[]):
        from localground.apps.site import models
        user = user or self.user
        project = project or self.project
        video = models.Video(
            project=project,
            #host=settings.SERVER_HOST,
            owner=user,
            last_updated_by=user,
            name=name,
            description='Video Description',
            provider=provider,
            video_id=video_id,
            point=point,
            tags=tags
        )
        video.save()
        return video

    def create_audio(self, user=None, project=None, name='Audio Name',
                     file_name='my_audio.wav', tags=[], point=None):
        from localground.apps.site import models
        user = user or self.user
        project = project or self.project
        audio = models.Audio(
            project=project,
            host=settings.SERVER_HOST,
            owner=user,
            last_updated_by=user,
            name=name,
            description='Audio Description',
            file_name_orig=file_name,
            file_name_new='new.wav',
            tags=tags,
            point=point,
            virtual_path='/userdata/media/' + user.username + '/audio/'
        )
        audio.save()
        return audio

    def create_styled_map(self):
        from localground.apps.site.models import StyledMap
        from django.contrib.gis.geos import GEOSGeometry
        map = models.StyledMap(
            center= GEOSGeometry('POINT(5 23)'),
            zoom=3,
            last_updated_by=self.user,
            owner = self.user,
            project = self.project,
            name='Oakland Map'
        )
        map.save()
        return map

    def create_relation(self, source_model, attach_model, ordering=1, turned_on=False):
        from localground.apps.site import models
        r = models.GenericAssociation(
            source_type=type(source_model).get_content_type(),
            source_id=source_model.id,
            entity_type=type(attach_model).get_content_type(),
            entity_id=attach_model.id,
            ordering=ordering,
            owner=self.user,
            turned_on=turned_on,
            last_updated_by=self.user
        )
        r.save()
        return r

    def delete_relation(self, source_model, attach_model):
        from localground.apps.site import models
        queryset = models.GenericAssociation.objects.filter(
            entity_type=type(attach_model).get_content_type(),
            entity_id=attach_model.id,
            source_type=type(source_model).get_content_type(),
            source_id=source_model.id
        )
        queryset.delete()

    def get_relation(self, source_model, attach_model):
        from localground.apps.site import models
        return models.GenericAssociation.objects.filter(
            entity_type=type(attach_model).get_content_type(),
            entity_id=attach_model.id,
            source_type=type(source_model).get_content_type(),
            source_id=source_model.id
        ).first()

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
