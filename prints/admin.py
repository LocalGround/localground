from django.contrib.gis import admin as geoadmin
from django.contrib import admin
from models import Print
admin.site.disable_action('delete_selected')

class PrintAdmin(geoadmin.GeoModelAdmin):
    save_on_top     = True
    search_fields    = ('id',)
    list_display    = ('id', 'time_stamp', 'map_title', 'owner', 'map_provider', 'zoom')
    ordering = ('owner', 'id', 'map_provider')
    fieldsets = [
        ('User Prefs',    {'fields': ['owner', 'time_stamp', 'map_title', 'description', 'map_provider']}),
        ('Map Metadata', {'fields': ['zoom', 'map_width', 'map_height', 'map_image_path', 'pdf_path', 'preview_image_path', 'deleted']}),
        ('Geometry',    {'fields': ['extents', 'center', 'northeast', 'southwest']}),
    ]

    modifiable = False
    map_width   = 200
    map_height  = 200
    
admin.site.register(Print, PrintAdmin)
