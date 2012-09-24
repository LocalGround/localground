from django.contrib.gis import admin as geoadmin
from django.contrib import admin
from models import *

class StatusAdmin(geoadmin.GeoModelAdmin):
    list_display    = ('id', 'name', 'description')
    ordering = ('id',)
    
class ScanAdmin(admin.ModelAdmin):
    save_on_top     = True
    list_filter     = ('owner', 'deleted', 'status', 'source_print')
    list_per_page   = 40
    search_fields    = ('uuid',)
    list_display    = ('uuid', 'time_stamp', 'name', 'deleted')
    ordering = ('-time_stamp', 'source_print')
    fieldsets = [
        ('User Prefs',    {'fields': ['uuid', 'owner', 'name', 'description']}),
        ('Processing Info', {'fields': ['file_name_orig', 'file_name_thumb', 'status', 'source_print', 'content_type',
                                        'email_sender', 'email_subject', 'email_body', 'upload_source',\
                                        'map_rect', 'qr_rect', 'qr_code']})
    ]
    
class ErrorCodeAdmin(geoadmin.GeoModelAdmin):
    list_display    = ('id', 'name', 'description')
    ordering        = ('id', 'name',)

class ProcessingMessageAdmin(geoadmin.GeoModelAdmin):
    list_display    = ('scan', 'time_stamp', 'error_code')
    ordering        = ('-time_stamp', 'scan',)
    
class PhotoAdmin(admin.ModelAdmin):
    '''
    user name, content_type, file_name_orig, path_orig, time_stamp
    '''
    save_on_top     = True
    list_filter     = ('owner',)
    list_per_page   = 50
    search_fields   = ('file_name_orig',)
    list_display    = ('owner', 'name', 'file_name_orig', 'time_stamp')
    ordering = ('file_name_orig', '-time_stamp')
    
admin.site.register(Scan, ScanAdmin)
#admin.site.register(Scan)
admin.site.register(StatusCode, StatusAdmin)
admin.site.register(UploadSource)
admin.site.register(UploadType)
admin.site.register(Audio)
admin.site.register(Video)
admin.site.register(Attachment)
admin.site.register(Photo, PhotoAdmin)
admin.site.register(ErrorCode, ErrorCodeAdmin)
#admin.site.register(ProcessingMessage, ProcessingMessageAdmin)