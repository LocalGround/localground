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
from django.core.files import File


"""
Hacky workaround - fixtures are deprecated, so I'm manually loading them here
TODO: move fixture loading into actual python code, probably
This is super duper slow and dumb
"""

fixture_dir = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '../../fixtures'))
fixture_filenames = ['test_data.json']  # 'database_initialization.json',


def load_test_fixtures():
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

    def get_client_user(self, user):
        #if self._client_user is None:
        self._client_user = Client(enforce_csrf_checks=True)
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

    def create_layer(
            self, map, dataset=None, display_field=None, symbols=None,
            title='Untitled Layer', ordering=1, group_by='uniform'):
        if dataset and not display_field:
            display_field = dataset.fields[0]
        symbols = symbols or [models.Symbol.SIMPLE.to_dict()]
        return models.Layer.create(
            last_updated_by=map.last_updated_by,
            owner=map.owner,
            styled_map=map,
            symbols=symbols,
            dataset=dataset,
            display_field=display_field,
            title=title,
            group_by=group_by,
            project=map.project,
            ordering=ordering
        )

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

        m = models.Record(
            project=project,
            owner=user,
            extras=extras,
            last_updated_by=user
        )
        if geom.geom_type == "Point":
            m.point = geom
        elif geom.geom_type == "LineString":
            m.polyline = geom
        else:
            m.polygon = geom
        m.save()
        return m

    def create_record(
            self, user=None, project=None, geoJSON=None, point=None,
            extras={"random key": "random value"}, tags=[], dataset=None):
        from localground.apps.site import models
        geom = None
        user = user or self.user
        project = project or self.project
        dataset = dataset or self.create_dataset()
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

        mwa = models.Record(
            project=project,
            owner=user,
            extras=extras,
            last_updated_by=user,
            tags=tags,
            dataset=dataset
        )
        if geom.geom_type == "Point":
            mwa.point = geom
        elif geom.geom_type == "LineString":
            mwa.polyline = geom
        else:
            mwa.polygon = geom
        mwa.save()
        return mwa

    def get_marker(self, marker_id=1):
        from localground.apps.site import models
        return models.Record.objects.get(id=marker_id)

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

    '''
    def create_print(self, layout_id=1, map_provider=1,
                     lat=55, lng=61.4, zoom=17,
                     map_title='A title',
                     instructions='A description',
                     tags=[], generate_pdf=True):
        from localground.apps.site import models
        from django.contrib.gis.geos import Point
        uuid = generic.generateID()
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
            # This comes straight from print serializer
            # because it is needed to work for test data

            # create the instance with valid data
            # the problem is that how can I get a uuid for use in test?

            # create the report and save
            pdf_report = p.generate_pdf()
            pdf_file_path = pdf_report.path + '/' + pdf_report.file_name
            thumb_file_path = pdf_report.path + '/' + 'thumbnail.jpg'
            p.pdf_path_S3.save(
                pdf_report.file_name, File(open(pdf_file_path)))
            p.map_image_path_S3.save(
                'thumbnail_' + uuid + '.jpg', File(open(thumb_file_path)))
        return p
    '''

    def create_print(self, layout_id=1, map_provider=1,
                     lat=55, lng=61.4, zoom=17,
                     map_title='A title',
                     instructions='A description',
                     tags=[], generate_pdf=True):
        from localground.apps.site import models
        from django.contrib.gis.geos import Point
        uuid = generic.generateID()
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
        d = {
            'uuid': p.uuid,
            'virtual_path': p.virtual_path,
            'layout': models.Layout.objects.get(id=layout_id),
            'name': 'Map Title!',
            'description': 'Instructions!!!',
            'map_provider': models.TileSet.objects.get(id=map_provider),
            'zoom': 10,
            'center': Point(lng, lat, srid=4326),
            'project': self.project,
            'northeast': p.northeast,
            'southwest': p.southwest,
            'extents': p.extents,
            'host': p.host,
            'map_image_path': p.map_image_path,
            'pdf_path': p.pdf_path,
            'preview_image_path': p.preview_image_path,
            'map_width': p.map_width,
            'map_height': p.map_height
        }
        p.tags = tags
        p.save()
        if generate_pdf:
            # This comes straight from print serializer
            # because it is needed to work for test data

            # create the instance with valid data
            # the problem is that how can I get a uuid for use in test?

            # create the report and save
            pdf_report = p.generate_pdf()
            pdf_file_path = pdf_report.path + '/' + pdf_report.file_name
            thumb_file_path = pdf_report.path + '/' + 'thumbnail.jpg'
            p.pdf_path_S3.save(
                pdf_report.file_name, File(open(pdf_file_path)))
            p.map_image_path_S3.save(
                'thumbnail_' + uuid + '.jpg', File(open(thumb_file_path)))
        return p

    def create_dataset(self, name='A title',
                    description='A description', user=None,
                    project=None):
        from localground.apps.site import models
        f = models.Dataset.create(
            owner=user or self.user,
            name=name,
            description=description,
            last_updated_by=user or self.user,
            project=project or self.project
        )
        # add tags:
        f.tags = ['a', 'b']
        f.save()
        return f

    def create_dataset_with_fields(
            self,
            name='A title',
            description='A description',
            user=None,
            tags='b',
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
        f = self.create_dataset(
            name, description, user=user, project=project)
        for i in range(0, num_fields):
            field_name = 'Field %s' % (i + 1)
            fld = self.create_field(
                name=field_name,
                data_type=DataType.objects.get(id=(i + 1)),
                ordering=(i + 3),
                dataset=f)
            if i+1 == 6:
                fld.extras = [{"name": "Bad", "value": 1},
                              {"name": "Ok", "value": 2},
                              {"name": "Good", "value": 3}]

            if i+1 == 7:
                fld.extras = [{"name": "Democrat"},
                              {"name": "Republican"},
                              {"name": "Independent"}]
            fld.save()
        return f

    def create_field(self, dataset, name='Field 1', extras=None,
                     data_type=None, ordering=1):
        from localground.apps.site import models
        data_type = data_type or DataType.objects.get(id=1)
        f = models.Field(
            col_alias=name,
            data_type=data_type,
            ordering=ordering,
            dataset=dataset,
            owner=self.user,
            last_updated_by=self.user,
            extras=extras
        )
        f.save()
        return f

    def insert_dataset_data_record(
            self, dataset, project=None, photo=None, audio=None, name=None,
            point=None, geoJSON=None):

        return self.create_record(
            project=project, dataset=dataset, point=point, geoJSON=geoJSON)

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
                     point=None, tags=[], with_media=False):
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
        if with_media:
            import Image
            image = Image.new('RGB', (200, 100))
            image.save('test.jpg')
            photo.process_file(image)
        return photo

    def create_icon(self, user, project, icon_file='icon.jpg', name='test_icon', file_type='jpg', size=100, width=100, height=100, anchor_x=30, anchor_y=50):
        from localground.apps.site import models
        icon = models.Icon(
            project=project,
            owner=user,
            last_updated_by=user,
            file_name_orig=icon_file,
            name=name,
            file_type=file_type,
            size=size,
            width=width,
            height=height,
            anchor_x=anchor_x,
            anchor_y=anchor_y
        )
        icon.save()
        return icon

    def create_video(self, user=None, project=None, name='Video Name',
                     provider='youtube', video_id='jNQXAC9IVRw',
                     video_link='https://www.youtube.com/watch?v=jNQXAC9IVRw',
                     point=None, tags=[]):

        from localground.apps.site import models
        user = user or self.user
        project = project or self.project
        video = models.Video(
            project=project,
            # host=settings.SERVER_HOST,
            owner=user,
            last_updated_by=user,
            name=name,
            description='Video Description',
            provider=provider,
            video_id=video_id,
            video_link=video_link,
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
            # host=settings.SERVER_HOST,
            owner=user,
            last_updated_by=user,
            name=name,
            description='Audio Description',
            # Unsure on what to do with filename orig
            # besides being used for audio tests
            file_name_orig=file_name,
            # file_name_new='new.jpg',
            tags=tags,
            point=point
            # virtual_path='/userdata/media/' + user.username + '/audio/'
        )
        audio.save()
        return audio

    def create_styled_map(self, dataset=None):
        from localground.apps.site.models import StyledMap
        from django.contrib.gis.geos import GEOSGeometry
        datasets = None
        if dataset:
            datasets = [dataset]
        map = models.StyledMap.create(
            datasets=datasets,
            center=GEOSGeometry('POINT(5 23)'),
            zoom=3,
            last_updated_by=self.user,
            owner=self.user,
            project=self.project,
            name='Oakland Map'
        )
        return map

    def create_relation(
            self, source_model, attach_model, ordering=1, turned_on=False):
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
    # fixtures = ['test_data.json']

    def setUp(self, load_fixtures=False):
        ModelMixin.setUp(self, load_fixtures=load_fixtures)

    def test_page_200_status_basic_user(self, urls=None, **kwargs):
        if urls is None:
            urls = self.urls
        for url in urls:
            response = self.client_user.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_page_resolves_to_view(self, urls=None):
        if urls is None:
            urls = self.urls
        for url in urls:
            url = url.split('?')[0]
            func = resolve(url).func
            func_name = '{}.{}'.format(func.__module__, func.__name__)
            view_name = '{}.{}'.format(
                self.view.__module__,
                self.view.__name__)
            self.assertEqual(func_name, view_name)


class ViewMixin(ViewAnonymousMixin):
    # fixtures = ['test_data.json']

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
