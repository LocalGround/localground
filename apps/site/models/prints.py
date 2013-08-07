from django.contrib.gis.db import models   
from localground.apps.site.managers import PrintManager
from django.conf import settings
from localground.apps.site.models.abstract.media import BaseMedia
from localground.apps.site.models.abstract.mixins import ProjectMixin
from localground.apps.site.models.abstract.geometry import BaseExtents
import Image
from tagging_autocomplete.models import TagAutocompleteField
from django.contrib.gis.geos import Polygon

												   
class Print(BaseExtents, BaseMedia, ProjectMixin):
	uuid = models.CharField(unique=True, max_length=8)
	name = models.CharField(max_length=255, blank=True, verbose_name="Map Title")
	description = models.TextField(null=True, blank=True, verbose_name="Instructions")
	tags = TagAutocompleteField(blank=True, null=True)
	map_provider = models.ForeignKey('WMSOverlay',
							db_column='fk_provider', related_name='prints_print_wmsoverlays')
	layout = models.ForeignKey('Layout')
	map_width = models.IntegerField()
	map_height = models.IntegerField()
	map_image_path = models.CharField(max_length=255)
	pdf_path = models.CharField(max_length=255)
	preview_image_path = models.CharField(max_length=255)
	form_column_widths = models.CharField(max_length=200, null=True, blank=True)
	sorted_field_ids = models.CharField(max_length=100, null=True, blank=True,
									db_column='form_column_ids')
	form = models.ForeignKey('Form', null=True, blank=True)
	deleted = models.BooleanField(default=False)
	layers = models.ManyToManyField('WMSOverlay', null=True, blank=True)
	objects = PrintManager()
	
	@classmethod
	def filter_fields(cls):
		from localground.apps.lib.helpers import QueryField, FieldTypes
		return [
			QueryField('project__id', id='project_id', title='Project ID', data_type=FieldTypes.INTEGER),
			QueryField('map_title', id='map_title', title='Map Title', operator='like'),
			QueryField('owner__username', id='owned_by', title='Owned By'),
			QueryField('map_image_path', id='map_image_path', title='File Name'),
			QueryField('date_created', id='date_created_after', title='After',
										data_type=FieldTypes.DATE, operator='>='),
			QueryField('date_created', id='date_created_before', title='Before',
										data_type=FieldTypes.DATE, operator='<=')
		]
	
	@classmethod
	def inline_form(cls):
		from django import forms
		class PrintInlineForm(forms.ModelForm):
			class Meta:
				from localground.apps.site.widgets import TagAutocomplete
				model = cls
				fields = ('name', 'description', 'tags')
				widgets = {
					'id': forms.HiddenInput,
					#'name': forms.Textarea(attrs={'rows': 3}), #any valid html attributes as attrs
					'description': forms.Textarea(attrs={'rows': 3}), #any valid html attributes as attrs
					'tags': TagAutocomplete()
				}
		return PrintInlineForm
	
	def get_form_column_widths(self):
		if self.form_column_widths is None or len(self.form_column_widths) == 0:
			return []
		else:
			return [int(w) for w in self.form_column_widths.split(',')]
			
	def get_fields_sorted_by_print(self):
		widths = self.get_form_column_widths()
		if self.sorted_field_ids is None or len(self.sorted_field_ids) == 0:
			return []
		else:
			ordered_ids = [int(id) for id in self.sorted_field_ids.split(',')]
			fields_sorted = []
			fields = list(self.form.get_fields())
			for i, id in enumerate(ordered_ids):
				for f in fields:
					if f.id == id:
						f.display_width = widths[i]
						fields_sorted.append(f)
			return fields_sorted                
		
	def get_abs_directory_path(self):
		return '%s%s' % (settings.FILE_ROOT, self.virtual_path)
	
	def get_abs_virtual_path(self):
		return 'http://%s%s' % (self.host, self.virtual_path)
		
	def generate_relative_path(self):
		return '/%s/%s/%s/' % (settings.USER_MEDIA_DIR,
									 self._meta.verbose_name_plural, self.uuid)
	
	def configuration_url(self):
		import urllib
		data = urllib.urlencode({
			'center_lat': self.center.y,
			'center_lng': self.center.x,
			'zoom': self.zoom,
			'map_provider': self.map_provider.id,
			'project_id': self.project.id,
			'map_title': self.name,
			'instructions': self.description
		})
		return 'http://' + self.host + '/maps/print/?' + data
		
	def thumb(self):
		path = '%s%s' % (self.virtual_path, self.preview_image_path)
		return self._encrypt_media_path(path)
	
	def map(self):
		path = '%s%s' % (self.virtual_path, self.map_image_path)
		return self._encrypt_media_path(path)
	
	def pdf(self):
		path = '%s%s' % (self.virtual_path, self.pdf_path)
		return self._encrypt_media_path(path)
	
	def to_dict_slim(self):
		return {
			'id': self.id,
			'map_title': self.map_title 
		}
	
	def to_dict(self, include_print_users=False, include_map_groups=False,
				include_processed_maps=False, include_markers=False):
		dict = {
			'id': self.uuid,
			'uuid': self.uuid,
			'map_title': self.map_title,
			'pdf': self.pdf(),
			'thumbnail': self.thumb(),
			#'kml': '/' + settings.USER_MEDIA_DIR + '/prints/' + self.id + '/' + self.id + '.kml',
			'map': self.map(),
			'mapWidth': self.map_width,
			'mapHeight': self.map_height,
			'zoomLevel': self.zoom,
			'north': self.northeast.y,
			'south': self.southwest.y,
			'east': self.northeast.x,
			'west': self.southwest.x,
			'center_lat': self.center.y,
			'center_lng': self.center.x,
			'time_stamp': self.time_stamp.strftime('%m/%d/%y %I:%M%p'),#.isoformat(), #m/d/Y
			#'time_stamp': str(self.time_stamp),
			'provider': self.map_provider.id, #ensure select_related
		}
		if self.owner is not None:
			dict.update({'owner': self.owner.username})  #ensure select_related 
		if include_print_users:
			users = self.get_auth_users()
			dict.update({'print_users': [u.to_dict() for u in users]})
		if include_map_groups:
			groups = self.get_map_groups()
			dict.update({'map_groups': [g.to_dict() for g in groups]})
		if include_processed_maps:
			dict.update({'processed_maps': self.get_scans(to_dict=True)})
		if include_markers:
			dict.update({'markers': self.get_marker_dictionary_list()})    
		return dict
	
	def get_scans(self, to_dict=False):
		from localground.apps.site.models import Scan
		scans = list(Scan.objects.filter(deleted=False)
					 .filter(source_print=self)
					 .order_by('-time_stamp'))
		if to_dict:
			return [s.to_dict() for s in scans]
		return scans
	
	def delete(self, *args, **kwargs):
		#first remove directory, then delete from db:
		import shutil, os
		path = self.get_abs_directory_path()
		if os.path.exists(path):
			dest = '%s/deleted/%s' % (settings.USER_MEDIA_ROOT, self.uuid)
			if os.path.exists(dest):
				from localground.apps.lib.helpers import generic
				dest = dest + '.dup.' + generic.generateID()
			shutil.move(path, dest)
					
		super(Print, self).delete(*args, **kwargs) 
	
	class Meta:
		ordering = ['id']
		verbose_name = "print"
		verbose_name_plural = "prints"
		app_label = 'site'
		
	def __unicode__(self):
		return 'Print #' + self.uuid
	
	
	@classmethod
	def generate_print(cls, user, project, layout, map_provider, zoom,
							center, host, map_title=None, instructions=None,
							form=None, layer_ids=None, scan_ids=None,
							has_extra_form_page=False, do_save=True):
		from localground.apps.site import models
		from localground.apps.lib.helpers import generic, StaticMap, Report
		import os

		#create directory:
		uuid        = generic.generateID()
		path        = settings.USER_MEDIA_ROOT + '/prints/' + uuid
		os.mkdir(path) #create new directory
	
		layers, scans = None, None
		if layer_ids is not None:
			layers = models.WMSOverlay.objects.filter(id__in=layer_ids)
		if scan_ids is not None:
			scans = models.Scan.objects.filter(id__in=scan_ids)
		if instructions is not None: #preserve line breaks in the pdf report
			instructions = '<br/>'.join(instructions.splitlines())
		
		#set variables from database layout configuration
		map_width = layout.map_width_pixels
		map_height = layout.map_height_pixels
		qr_size = layout.qr_size_pixels
		border_width = layout.border_width
		
		m = StaticMap()
		#use static map helper function to calculate additional geometric calculations
		info = m.get_basemap_and_extents(
					map_provider, zoom, center, map_width, map_height)
		map_image = info.get('map_image')
		northeast = info.get('northeast')
		southwest = info.get('southwest')
		bbox = (northeast.coords, southwest.coords)
		bbox = [element for tupl in bbox for element in tupl]
		extents = Polygon.from_bbox(bbox)
		overlay_image = m.get_map(layers, southwest=southwest, northeast=northeast,
								  scans=scans, height=map_height, width=map_width,
								  show_north_arrow=True)
		
		map_image.paste(overlay_image, (0, 0), overlay_image)
		

		if layout.is_data_entry:
			map_image = map_image.convert("L") #convert to black and white
		
		map_image.save(path + '/map.jpg')
		
		#add border around map:
		map_image = StaticMap.draw_border(map_image, border_width)
		map_width, map_height = map_image.size
		map_image.save(path + '/map_with_border.jpg')
		
		#generate thumbnail:
		size = map_width/3, map_height/3
		thumbnail = map_image.copy()
		thumbnail.thumbnail(size, Image.ANTIALIAS)
		thumbnail.save(path + '/thumbnail.jpg')
		
		#generate QR code
		qr_image_1 = StaticMap.generate_qrcode(uuid, 1, path, qr_size, border_width)
		qr_image_2 = StaticMap.generate_qrcode(uuid, 2, path, qr_size, border_width)
		qr_size = qr_image_1.size[0]
		
		#generate PDF
		filename = file_name='Print_' + uuid + '.pdf'
		pdf_report = Report(
			path, file_name=filename, is_landscape=layout.is_landscape,
			author=user.username, title=map_title)
		
		##########
		# Page 1 #
		##########
		# build from the bottom up:
		#   (x & y dependencies are additive from bottom up)
		
		#add footer:
		if layout.is_data_entry:
			pdf_report.add_footer(qr_image_1, uuid, instructions)
			
		#add form:
		if layout.is_mini_form and form is not None:
			pdf_report.add_form(4, form, is_mini_form=True) 
			
		#add map:
		pdf_report.add_map(map_image, is_data_entry=layout.is_data_entry,
						   has_mini_form=layout.is_mini_form)
		
		#add header:
		pdf_report.add_header(is_data_entry=layout.is_data_entry, is_map_page=True)
		
		##########
		# Page 2 #
		##########
		if has_extra_form_page:
			pdf_report.new_page()
			
			#reorient back to portrait:
			pdf_report.set_orientation(False)
			
			#add footer:
			pdf_report.add_footer(qr_image_2, uuid, instructions)
			
			#add form:
			pdf_report.add_form(13, form, is_mini_form=False) 
			
			#add header:
			pdf_report.add_header(is_data_entry=layout.is_data_entry, is_map_page=False)

		pdf_report.save()
		
		p = Print()
		p.uuid = uuid
		p.project = project
		p.zoom = zoom
		p.map_width = map_width
		p.map_height = map_height
		p.map_provider = map_provider
		p.host = host
		p.map_image_path = 'map.jpg'
		p.pdf_path = filename
		p.preview_image_path = 'thumbnail.jpg'
		p.name = map_title
		p.description = instructions
		p.center = center
		p.northeast = northeast
		p.southwest = southwest
		p.owner = user
		p.last_updated_by = user
		p.extents = extents
		p.layout = layout
		p.virtual_path = p.generate_relative_path()
		if layout.is_data_entry and form is not None:
			p.form = form
			cols = form.get_fields(print_only=True)
			p.form_column_widths = ','.join([str(c.display_width) for c in cols])
			p.sorted_field_ids = ','.join([str(c.id) for c in cols])
		
		
		if do_save:
			p.save()
		
		if layers:
			for l in layers: p.layers.add(l)
		if do_save:
			p.save()
		return p
		
	
	