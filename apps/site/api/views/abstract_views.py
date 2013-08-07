from localground.apps.lib.helpers import get_timestamp_no_milliseconds

class AuditCreate(object):
	
	def pre_save(self, obj):
		'''
		For database inserts
		'''
		obj.owner = self.request.user
		obj.last_updated_by = self.request.user
		obj.timestamp = get_timestamp_no_milliseconds()
		
	def metadata(self, request):
		"""
		Return a dictionary of metadata about the view.
		Used to return responses for OPTIONS requests.
		"""

		# This is used by ViewSets to disambiguate instance vs list views
		view_name_suffix = getattr(self, 'suffix', None)

		# By default we can't provide any form-like information, however the
		# generic views override this implementation and add additional
		# information for POST and PUT methods, based on the serializer.
		from django.utils.datastructures import SortedDict
		ret = SortedDict()
		ret['name'] = get_view_name(self.__class__, view_name_suffix)
		ret['description'] = get_view_description(self.__class__)
		ret['renders'] = [renderer.media_type for renderer in self.renderer_classes]
		ret['parses'] = [parser.media_type for parser in self.parser_classes]
		return ret
		
class AuditUpdate(AuditCreate):
	def pre_save(self, obj):
		'''
		For database updates
		'''
		obj.last_updated_by = self.request.user
		obj.timestamp = get_timestamp_no_milliseconds()