from django.contrib.gis.db import models
from localground.apps.site.managers import PrintManager
from django.conf import settings
from localground.apps.site.models.abstract.base import BaseAudit
from localground.apps.site.models.abstract.mixins import MediaMixin
from localground.apps.site.models.abstract.mixins import ProjectMixin
from localground.apps.site.models.abstract.mixins import \
    GenericRelationMixin
from localground.apps.site.models.abstract.mixins import ExtentsMixin
from PIL import Image
from django.contrib.postgres.fields import ArrayField
from django.contrib.gis.geos import Polygon

from django.core.files import File
from localground.apps.site.fields import LGImageField
from localground.apps.site.fields import LGFileField


class Print(ExtentsMixin, MediaMixin, ProjectMixin,
            GenericRelationMixin, BaseAudit):
    uuid = models.CharField(unique=True, max_length=8)
    name = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Map Title")
    description = models.TextField(
        null=True,
        blank=True,
        verbose_name="Instructions")
    tags = ArrayField(models.TextField(), default=list)
    map_provider = models.ForeignKey(
        'TileSet',
        db_column='fk_provider',
        related_name='prints_print_tilesets')
    layout = models.ForeignKey('Layout')
    northeast = models.PointField(null=True)
    southwest = models.PointField(null=True)
    center = models.PointField(null=True)
    zoom = models.IntegerField(null=True)
    map_width = models.IntegerField()
    map_height = models.IntegerField()
    map_image_path = models.CharField(max_length=255)
    pdf_path = models.CharField(max_length=255)
    map_image_path_S3 = LGImageField(null=True)
    pdf_path_S3 = LGFileField(null=True)
    preview_image_path = models.CharField(max_length=255)
    deleted = models.BooleanField(default=False)

    filter_fields = MediaMixin.filter_fields + \
        ('name', 'description', 'tags', 'uuid')

    objects = PrintManager()

    @property
    def embedded_mapimages(self):
        from localground.apps.site.models import MapImage
        if not hasattr(self, '_embedded_mapimages'):
            self._embedded_mapimages = self.grab(MapImage)
        return self._embedded_mapimages
    '''
    Those old functions for local storage will eventually be removed
    after successful implementation of the new path
    to the Amazon S3 cloud.
    '''
    def get_abs_directory_path(self):
        return '%s%s' % (settings.FILE_ROOT, self.virtual_path)

    def get_abs_virtual_path(self):
        return '//%s%s' % (self.host, self.virtual_path)

    def generate_relative_path(self):
        return '/%s/%s/%s/' % (settings.USER_MEDIA_DIR,
                               self._meta.verbose_name_plural, self.uuid)
    '''
    Thumb, Map, and PDF must change destination from
    local ground's own storage to Amazon S3

    Find a way to convert the original file source into boto
    then put the destination from the file source to S3
    '''
    def thumb(self):
        path = '%s%s' % (self.virtual_path, self.preview_image_path)
        return self._build_media_path(path)

    def map(self):
        path = '%s%s' % (self.virtual_path, self.map_image_path)
        return self._build_media_path(path)

    # move the PDF file from upload source endpoint to
    # destination endpoint with Amazon S3
    def pdf(self):
        path = '%s%s' % (self.virtual_path, self.pdf_path)
        return self._build_media_path(path)

    def delete(self, *args, **kwargs):
        # first remove directory, then delete from db:
        import shutil
        import os
        path = self.get_abs_directory_path()
        if os.path.exists(path):
            dest = '%s/deleted/%s' % (settings.USER_MEDIA_ROOT, self.uuid)
            if os.path.exists(dest):
                from localground.apps.lib.helpers import generic
                dest = dest + '.dup.' + generic.generateID()
            try:
                shutil.move(path, dest)
            except (Exception):
                raise Exception(
                    'error moving path from %s to %s' % (path, dest)
                )
        super(Print, self).delete(*args, **kwargs)

    class Meta:
        ordering = ['id']
        verbose_name = "print"
        verbose_name_plural = "prints"
        app_label = 'site'

    def __unicode__(self):
        return 'Print #' + self.uuid

    @classmethod
    def insert_print_record(
        cls, user, project, layout, map_provider, zoom, center, host,
            map_title=None,  instructions=None, mapimage_ids=None,
            do_save=True):
        from localground.apps.site import models
        from localground.apps.lib.helpers import generic, StaticMap, \
            Extents, AcetateLayer

        layers, mapimages = None, None
        if mapimage_ids is not None:
            mapimages = models.MapImage.objects.filter(id__in=mapimage_ids)
        if instructions is not None:  # preserve line breaks in the pdf report
            instructions = '<br/>'.join(instructions.splitlines())

        # use static map helper function to calculate additional geometric
        # calculations
        m = StaticMap()
        map_image = m.get_basemap(
            map_provider, zoom, center,
            layout.map_width_pixels, layout.map_height_pixels
        )
        extents = Extents.get_extents_from_center_lat_lng(
            center, zoom,
            layout.map_width_pixels, layout.map_height_pixels
        )
        bbox = (extents.northeast.coords, extents.southwest.coords)
        bbox = [element for tupl in bbox for element in tupl]
        extents_polygon = Polygon.from_bbox(bbox)

        # Save the print
        p = Print()
        p.uuid = generic.generateID()
        p.project = project
        p.zoom = zoom
        p.map_width = layout.map_width_pixels
        p.map_height = layout.map_height_pixels
        p.map_provider = map_provider
        p.owner = user
        p.last_updated_by = user
        p.layout = layout
        p.host = host
        p.map_image_path_S3 = 'map.jpg'
        p.map_image_path = 'map.jpg'
        p.pdf_path_S3 = 'Print_' + p.uuid + '.pdf'
        p.pdf_path = 'Print_' + p.uuid + '.pdf'
        p.preview_image_path = 'thumbnail.jpg'
        p.name = map_title
        p.description = instructions
        p.center = center
        p.northeast = extents.northeast
        p.southwest = extents.southwest
        p.extents = extents_polygon
        p.virtual_path = p.generate_relative_path()

        if do_save:
            p.save()
            # todo: come back to this (if we want MapServer to render layers)
            if layers:
                for layer in layers:
                    p.stash(l, user)
            if mapimages:
                for mapimage in mapimages:
                    p.stash(mapimage, user)
        return p

    def generate_pdf(self):
        from localground.apps.site import models
        from localground.apps.lib.helpers import Extents, generic, StaticMap, \
            Report, AcetateLayer
        import os

        # use static map helper function to calculate additional geometric
        # calculations
        m = StaticMap()
        map_width = self.layout.map_width_pixels
        map_height = self.layout.map_height_pixels
        path = settings.USER_MEDIA_ROOT + '/prints/' + self.uuid
        os.mkdir(path)  # create new directory
        file_name = 'Print_' + self.uuid + '.pdf'

        mapimages = self.embedded_mapimages
        map_image = m.get_basemap(
            self.map_provider, self.zoom, self.center, map_width, map_height
        )
        extents = Extents.get_extents_from_center_lat_lng(
            self.center, self.zoom, map_width, map_height
        )

        bbox = (extents.northeast.coords, extents.southwest.coords)
        bbox = [element for tupl in bbox for element in tupl]
        qr_size = self.layout.qr_size_pixels
        border_width = self.layout.border_width

        '''

        #TODO: Replace w/new acetate layer functionality:
        overlay_image = m.get_map(
            layers,
            southwest=extents.southwest,
            northeast=extents.northeast,
            mapimages=mapimages,
            height=map_height,
            width=map_width,
            show_north_arrow=True)
        map_image.paste(overlay_image, (0, 0), overlay_image)
        '''

        a = AcetateLayer(
            file_path=path,
            center=self.center,
            project_id=self.project.id,
            zoom=self.zoom,
            width=map_width,
            height=map_height
        )
        overlay_image = a.generate_acetate_layer()
        if overlay_image is not None:
            map_image.paste(overlay_image, (0, 0), overlay_image)

        if self.layout.is_data_entry:
            map_image = map_image.convert("L")  # convert to black and white

        map_image.save(path + '/map.jpg')

        # add border around map:
        map_image = StaticMap.draw_border(map_image, border_width)
        map_width, map_height = map_image.size
        map_image.save(path + '/map_with_border.jpg')

        # generate thumbnail:
        size = map_width / 3, map_height / 3
        thumbnail = map_image.copy()
        thumbnail.thumbnail(size, Image.ANTIALIAS)
        thumbnail.save(path + '/thumbnail.jpg')

        # generate QR code
        qr_image_1 = StaticMap.generate_qrcode(
            self.uuid,
            1,
            path,
            qr_size,
            border_width)
        qr_size = qr_image_1.size[0]

        # generate PDF
        pdf_report = Report(
            path,
            file_name=self.pdf_path,
            file_name_S3=self.pdf_path_S3,
            is_landscape=self.layout.is_landscape,
            author=self.owner.username,
            title=self.name)
        print(self.pdf_path_S3)
        # Transfer the PDF from file system to Amazon S3
        self.pdf_path_S3.save(self.pdf_path, File(open(self.pdf_path_S3)))

        ##########
        # Page 1 #
        ##########
        # build from the bottom up:
        #   (x & y dependencies are additive from bottom up)

        # add footer:
        if self.layout.is_data_entry:
            pdf_report.add_footer(qr_image_1, self.uuid, self.description)

        # add map:
        pdf_report.add_map(map_image, is_data_entry=self.layout.is_data_entry)

        # add header:
        pdf_report.add_header(
            is_data_entry=self.layout.is_data_entry,
            is_map_page=True)

        pdf_report.save()
