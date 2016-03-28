from django import forms
from django.utils.safestring import mark_safe
from django.utils.encoding import force_unicode
from django.contrib.gis.geos import GEOSGeometry, GEOSException
from django.forms.widgets import Widget, TextInput, Textarea, HiddenInput
#from tagging_autocomplete.widgets import TagAutocomplete
from django.conf import settings
from localground.apps.site.widgets.permissions import UserAutocomplete

DEFAULT_WIDTH = 300
DEFAULT_HEIGHT = 200

DEFAULT_LAT = 55.16
DEFAULT_LNG = 61.4


class ArrayFieldTagWidget(forms.TextInput):
   
    def __init__(self, *args, **kwargs):
        # Accept a `delimiter` argument, and grab it (defaulting to a comma)
        self.delimiter = kwargs.pop("delimiter", ",")
        super(ArrayFieldTagWidget, self).__init__(*args, **kwargs)

    def render(self, name, value, attrs=None):
        html = '<input type="text" id="%s" name="%s" value="%s" />' % (
            attrs['id'], name, value)

        js = u'''<script type="text/javascript">
                    $('#%s').selectize({delimiter: '%s', persist: false,
                                                create: function(input) {return {
                                                value: input,text: input}}});
                </script>''' % (attrs['id'], self.delimiter)

        return mark_safe("\n".join([html, js]))
        # return mark_safe(html)

    class Media:
        extend = False
        js = (
            '/%s/scripts/thirdparty/selectize/selectize.min.js' %
            settings.STATIC_MEDIA_DIR,
        )
        css = {
            'all': (
                '/%s/scripts/thirdparty/selectize/selectize.css' %
                settings.STATIC_MEDIA_DIR,
            )}


class PointWidget(Textarea):

    def __init__(self, *args, **kw):
        self.map_width = kw.get("map_width", DEFAULT_WIDTH)
        self.map_height = kw.get("map_height", DEFAULT_HEIGHT)
        self.geom_type = 'POINT'
        self.srid = kw.get("srid", 4326)
        #self.widgetType = 'google'
        # if kw.get("hidden") is not None:
        #    self.widgetType = 'hidden';

        # remove kwargs that aren't relevant to Textarea:
        if kw.get('map_width'):
            kw.pop('map_width')
        if kw.get('map_height'):
            kw.pop('map_height')
        #if kw.get('hidden'): kw.pop('hidden')
        if kw.get('srid'):
            kw.pop('srid')

        super(
            PointWidget,
            self).__init__(
            *
            args,
            **kw)  # init parent Textarea class
        self.inner_widget = forms.widgets.HiddenInput()

    def render(self, name, value, *args, **kwargs):
        # value is either None, a string/unicode value, or a GEOSGeometry
        if value is None:  # no value
            lat, lng, zoom = DEFAULT_LAT, DEFAULT_LNG, 5
        elif isinstance(value, basestring):  # value is unicode/string
            try:
                value = GEOSGeometry(value)
                lat, lng, zoom = value.y, value.x, 13
            except (GEOSException, ValueError):
                value = None
                lat, lng, zoom = DEFAULT_LAT, DEFAULT_LNG, 5
        else:  # value is GEOSGeometry
            lat, lng, zoom = value.y, value.x, 13
        js = '''
		<script type="text/javascript">
		//<![CDATA[
			var map_%(name)s;
			var marker;
			function savePosition_%(name)s(point)
			{
				var input = document.getElementById("id_%(name)s");
				input.value = 'SRID=%(srid)s;POINT(' +  point.lng().toFixed(6) + ' ' + point.lat().toFixed(6) + ')';
				map_%(name)s.panTo(point);
			}

			function load_%(name)s() {
				var point = new google.maps.LatLng(%(lat)f, %(lng)f);

				var options = {
					zoom: %(zoom)s,
					center: point,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapTypeControl: false,
					navigationControl: true,
					streetViewControl: false
				};

				map_%(name)s = new google.maps.Map(document.getElementById("map_%(name)s"), options);

				marker = new google.maps.Marker({
						map: map_%(name)s,
						position: new google.maps.LatLng(%(lat)f, %(lng)f),
						draggable: true

				});
				google.maps.event.addListener(marker, 'dragend', function(mouseEvent) {
					savePosition_%(name)s(mouseEvent.latLng);
				});

				google.maps.event.addListener(map_%(name)s, 'click', function(mouseEvent){
					marker.setPosition(mouseEvent.latLng);
					savePosition_%(name)s(mouseEvent.latLng);
				});
			}

			function search() {
				var address = $('#addressInput').val();
				var geocoder = new google.maps.Geocoder();
				if (geocoder) {
					geocoder.geocode( { 'address': address}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
								map_%(name)s.setCenter(results[0].geometry.location);
								map_%(name)s.setZoom(17);
								marker.setPosition(results[0].geometry.location);
								savePosition_%(name)s(results[0].geometry.location);
							}
							else {
								alert("No results found for: " + address);
							}
						}
						else {
							alert("Geocode was not successful for the following reason: " + status);
						}
						return false;
					});
				}
			}

			$(document).ready(function(){
				load_%(name)s();
				$('input:text').keypress(function(event){
					if(event.keyCode == 13){
						event.preventDefault();
						return false;
					}
				});
				$('#addressInput').keypress(function(event){
					if(event.keyCode == 13){
						search();
						event.preventDefault();
						return false;
					}
				}).click(function(){
					//alert($(this).val());
					$(this).val('');
				});
				$('#btnSearch').click(function() { search(); });
			});

		//]]>
		</script>
		''' % dict(name=name, srid=self.srid, lat=lat, lng=lng, zoom=zoom)

        html = self.inner_widget.render(
            "%s" %
            name,
            "SRID=%d;POINT(%f %f)" %
            (self.srid,
             lng,
             lat),
            dict(
                id='id_%s' %
                name))
        html += '<input type="text" id="addressInput" value="Enter address..." style="width: %dpx" />' % (
            self.map_width - 100,)
        html += '<img style="vertical-align:middle;margin-left:-25px;" id="btnSearch" tabIndex="1" src="/%s/images/icon-searchbox.png" alt="Search for Address" />' % settings.STATIC_MEDIA_DIR
        html += '<div class="thumb" id="map_%s" style="width: %dpx; height: %dpx"></div>' % (
            name, self.map_width, self.map_height)

        return mark_safe(js + html)

    class Media:
        js = (
            'http://maps.google.com/maps/api/js?sensor=false',
        )


class PointWidgetHidden(Textarea):
    is_hidden = True

    def __init__(self, *args, **kw):
        self.geom_type = 'POINT'
        self.srid = kw.get("srid", 4326)
        if kw.get('srid'):
            kw.pop('srid')
        super(
            PointWidgetHidden,
            self).__init__(
            *args,
            **kw)  # init parent Textarea class
        # forms.widgets.TextInput()
        self.inner_widget = forms.widgets.HiddenInput()

    def render(self, name, value, *args, **kwargs):
        # value is either None, a string/unicode value, or a GEOSGeometry
        if value is None:  # no value
            lat, lng = DEFAULT_LAT, DEFAULT_LNG
        elif isinstance(value, basestring):  # value is unicode/string
            try:
                value = GEOSGeometry(value)
                lat, lng = value.y, value.x
            except (GEOSException, ValueError):
                value = None
                lat, lng = DEFAULT_LAT, DEFAULT_LNG
        else:  # value is GEOSGeometry
            lat, lng = value.y, value.x

        # renders text form elements (for debugging):
        html = self.inner_widget.render('lat', lat, dict(id='lat'))
        html += self.inner_widget.render('lng', lng, dict(id='lng'))

        return mark_safe(html)

    def value_from_datadict(self, data, files, name):
        """
        Given a dictionary of data and this widget's name, returns the value
        of this widget. Returns None if it's not provided.
        """
        if data.get('lng') is None or data.get('lat') is None:
            return ''
        return 'SRID=' + \
            str(self.srid) + ';POINT(' + data.get('lng') + ' ' + data.get('lat') + ')'


class PointWidgetTextbox(Textarea):

    '''
    Note:  this widget is made expressly for the REST framework, to interoperate
    w/the serializer.  Needed to comment out the value_from_datadict situation.
    Not sure if it would work w/a regular Django form
    '''
    is_hidden = False

    def __init__(self, *args, **kw):
        self.geom_type = 'POINT'
        self.srid = kw.get("srid", 4326)
        if kw.get('srid'):
            kw.pop('srid')
        super(
            PointWidgetTextbox,
            self).__init__(
            *args,
            **kw)  # init parent Textarea class
        # forms.widgets.TextInput()
        self.inner_widget = forms.widgets.TextInput()

    def render(self, name, value, *args, **kwargs):
        # value is either None, a string/unicode value, or a GEOSGeometry
        if value is None:  # no value
            lat, lng = DEFAULT_LAT, DEFAULT_LNG
        else:
            try:
                if isinstance(value, basestring):  # value is unicode/string
                    value = GEOSGeometry(value)
                    lat, lng = value.y, value.x
                elif isinstance(value, dict):
                    lat, lng = value.get('lat'), value.get('lng')
                    #lat, lng = value.get('%s_lat' % name), value.get('%s_lng' % name)
                else:  # value is GEOSGeometry
                    lat, lng = value.y, value.x
            except:
                lat, lng = value, value

        # renders text form elements (for debugging):
        html = self.inner_widget.render(
            'lat',
            lat,
            dict(
                id='id_lat',
                style='width:100px;'))
        html += self.inner_widget.render('lng',
                                         lng,
                                         dict(id='id_lng',
                                              style='width:100px;'))
        return mark_safe(html)


class JSONWidget(Textarea):

    def __init__(self, *args, **kw):
        super(JSONWidget, self).__init__(*args, **kw)
        self.inner_widget = forms.widgets.Textarea()

    def render(self, name, value, *args, **kwargs):
        import json
        val = value
        try:
            if value and (isinstance(value, dict) or isinstance(value, list)):
                val = '%s' % json.dumps(value)
        except:
            pass
        html = self.inner_widget.render(
            name,
            val,
            dict(
                id='id_%s' %
                name,
                style='width:210px;height:100px'))
        return mark_safe(html)


class CustomCheckboxSelectMultiple(forms.CheckboxSelectMultiple):

    '''
    Another many-to-many association widget, except it uses an autocomplete +
    the existing subset already associated with the object, rather than letting
    a user look at every single possibility.
    Required kwargs:
            autocomplete_url:   the url that the auto-completer uses to populate options
            opts_url:           a url that returns a list of dictionary items, called 'results',
                                                    where, each dictionary has an 'id' and a 'value' key pair
    '''

    def __init__(self, *args, **kw):
        self.autocomplete_url = kw.get('autocomplete_url', None)
        self.opts_url = kw.get('opts_url', None)

        # remove kwargs that aren't relevant to parent class:
        if kw.get('autocomplete_url'):
            kw.pop('autocomplete_url')
        if kw.get('opts_url'):
            kw.pop('opts_url')
        super(CustomCheckboxSelectMultiple, self).__init__(*args, **kw)
        #self.inner_widget = forms.widgets.Textarea()

    def render(self, name, value, attrs=None, choices=()):
        from itertools import chain
        from django.utils.html import escape, conditional_escape
        if value is None:
            value = []
        has_id = attrs and 'id' in attrs
        final_attrs = self.build_attrs(attrs, name=name)
        output = [u'<table id="table_%s" class="tbl_multiselect">' % (name)]
        # Normalize to strings
        str_values = set([force_unicode(v) for v in value])
        for i, (option_value, option_label) in enumerate(chain(self.choices, choices)):
            # If an ID attribute was given, add a numeric index as a suffix,
            # so that the checkboxes don't all have the same ID attribute.
            if has_id:
                final_attrs = dict(final_attrs, id='%s_%s' % (attrs['id'], i))
                label_for = u' for="%s"' % final_attrs['id']
            else:
                label_for = ''

            cb = forms.CheckboxInput(
                final_attrs,
                check_test=lambda value: value in str_values)
            option_value = force_unicode(option_value)
            rendered_cb = cb.render(name, option_value)
            option_label = conditional_escape(force_unicode(option_label))
            output.append(
                u'<tr><td>%s </td><td><label style="text-align:left;" %s>%s</label></td></tr>' %
                (rendered_cb, label_for, option_label))
        output.append(u'</table>')
        output.append(
            u'<input type="text" value="" id="%(name)s_new_objects" />' %
            dict(
                name=name))
        output.append(
            u'<a id="%(name)s_add_new" class="btn secondary" href="javascript:%(name)s_add_new(\'%(name)s\')">Add</a>' %
            dict(
                name=name))
        js = '''
		<script type="text/javascript">
		//<![CDATA[
			function %(name)s_cb_colorchange($elem) {
				if ($elem.attr('checked')) {
					$elem.parents('td').addClass('checkbox_selected')
				} else {
					//alert('removing');
					$elem.parents('td').removeClass('checkbox_selected')
				}
			}
			function %(name)s_add_new(name) {
				$.getJSON(
					'%(opts_url)s',
					{ search_text: $('#' + name + '_new_objects').val() },
					function(result) {
						if(result.success) {
							$('#' + name + '_new_objects').val('');
							$.each(result.results, function() {
								var exists = false;
								var id = this.id;
								$.each($('#table_%(name)s input'), function(){
									if(id == $(this).val()) {
										exists = true;
										return;
									}
								});
								if(exists) { return; }

								var i = ($('#table_%(name)s tr').length - 1);
								if(i==-1)
									i = 0;
								var row_html = '<tr><td class="checkbox_selected">' +
									'<input type="checkbox" name="%(name)s" id="id_%(name)s_' + i +
										'" value="' + this.id + '" checked /></td><td>' +
										this.value + '</td></tr>';
								if(i==0)
									 $('#table_%(name)s').append(row_html);
								else
									$('#table_%(name)s tr:last').after(row_html);
							});
							$('input:checkbox').click(function () {
								%(name)s_cb_colorchange($(this));
							});
						}
					},
				"json");
			}

			$(document).ready(function(){
				$.each($('input:checkbox'), function () {
					%(name)s_cb_colorchange($(this));
				});
				$('input:checkbox').click(function () {
					%(name)s_cb_colorchange($(this));
				});

				$("#%(name)s_new_objects").autocomplete(
					"%(autocomplete_url)s",
					{
						multiple: true,
						width: 300,
						minChars: 1,
						matchContains: true,
						matchSubset: false,
						mustMatch: false,
						selectFirst: false
					}
				);
			});
		//]]>
		</script>
		''' % dict(autocomplete_url=self.autocomplete_url, opts_url=self.opts_url,
             name=name)
        return mark_safe(js + u'\n'.join(output))

    class Media:
        js = (
            '/%s/scripts/thirdparty/jquery-autocomplete/jquery.autocomplete.js' %
            settings.STATIC_MEDIA_DIR,
        )
        css = {
            'all': (
                '/%s/scripts/thirdparty/jquery-autocomplete/jquery.autocomplete.css' %
                settings.STATIC_MEDIA_DIR,
            )}


class CustomDateTimeWidget(forms.widgets.DateTimeInput):
    input_type = 'text'
    date_format = '%m/%d/%Y'
    time_format = '%I:%M:%S %p'

    def __init__(self, attrs=None):
        super(CustomDateTimeWidget, self).__init__(attrs)

        self.date_val = None
        self.time_val = None

    def parse_datetime(self):
        from datetime import datetime
        for format_string in settings.DATETIME_INPUT_FORMATS:
            try:
                return datetime.strptime(
                    self.date_val +
                    ' ' +
                    self.time_val,
                    format_string)
            except:
                pass
        # triggers datetime parse error unless empty
        return self.date_val + self.time_val

    def format_date(self, value):
        if value is None:
            return ''
        try:
            return value.strftime(self.date_format)
        except:
            try:
                return self.date_val
            except:
                return ''

    def format_time(self, value):
        if value is None:
            return ''
        try:
            return value.strftime(self.time_format)
        except:
            try:
                return self.time_val
            except:
                return ''

    def render(self, name, value, attrs=None):
        date_widget = mark_safe('<input name="%s_0" id="id_%s_0" value="%s">' %
                                (name, name, self.format_date(value)))
        time_widget = mark_safe('<input name="%s_1" id="id_%s_1" value="%s">' %
                                (name, name, self.format_time(value)))
        return self.format_output([date_widget, time_widget], value)

    def format_output(self, rendered_widgets, value):
        html = u'<p class="datetime">%s %s<br />%s %s</p>' % \
            ('<span>Date:</span>', rendered_widgets[0], '<span>Time:</span>', rendered_widgets[1])
        js = u'''
			<script type="text/javascript">
				$('.datetime')
					.find('input:eq(0)')
					.datepicker({ dateFormat: 'mm/dd/yy' });

				$('.datetime')
					.find('input:eq(1)')
					.timepicker({
						showPeriod: true,
						showLeadingZero: true
					});
			</script>
			'''

        return mark_safe("\n".join([html, js]))

    def value_from_datadict(self, data, files, name):
        """
        Given a dictionary of data and this widget's name, returns the value
        of this widget. Returns None if it's not provided.
        """
        self.date_val = data.get('%s_0' % name, None)
        self.time_val = data.get('%s_1' % name, None)
        return self.parse_datetime()

    class Media:
        extend = False
        js = (
            settings.JQUERY_UI_PATH,
            '/%s/scripts/thirdparty/jquery.ui.timepicker.js' %
            settings.STATIC_MEDIA_DIR)

        css = {
            'all': (
                '/%s/css/themes/bootstrap/jquery-ui-1.8.16.custom.css' %
                settings.STATIC_MEDIA_DIR,
                '/%s/css/themes/bootstrap/timepicker.css' %
                settings.STATIC_MEDIA_DIR)}
