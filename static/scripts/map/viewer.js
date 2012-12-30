var self;
var show_markers = false;
localground.viewer = function(){
	self = this;
    this.projects = [];
    this.overlayTypes = {
		PHOTO: 'photo',
		AUDIO: 'audio',
		VIDEO: 'video',
		MARKER: 'marker',
		RECORD: 'record',
		PAPER: 'paper'
	};
    this.keycodes = {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39
    }
	this.initProjectID = null;
	this.initViewID = null;
    this.mode = 'view';
    this.hideIfMarker = false;
    this.infoBubble = null; //http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobubble/examples/example.html
    this.editMarker = null;
    this.currentOverlay = null;
    this.fullExtent = null;
    this.lastProjectSelection = null;
	this.showOutlines = false;
    this.scanID = null;
    this.markers = [];
    this.projects = [];
    this.accessKey = null;
    this.paperManager = new localground.paperManager();
    this.photoManager = new localground.photoManager();
    this.audioManager = new localground.audioManager();
    this.markerManager = new localground.markerManager();
    this.managers = [
        this.paperManager,
        this.markerManager,
        this.photoManager,
        this.audioManager,
    ];
};
localground.viewer.prototype = new localground.basemap();           // Here's where the inheritance occurs 

localground.viewer.prototype.initialize=function(opts){
    self = this;
	$.extend(this, opts);
    
    localground.basemap.prototype.initialize.call(this, opts);
    
    this.map.mapTypeControlOptions.position = google.maps.ControlPosition.TOP_LEFT;  
    
    $('input:checkbox')
        .attr('checked', false)
        .attr('disabled', false);
   
    $('#my-modal').modal({
        keyboard: true,
        backdrop: true
    });
    
	/*if(this.initProjectID != null || this.initViewID != null) {
		$('#opener').trigger('click');
	}*/
	
    $('.unhide').click(function() {
        var object_type = $(this).parent().attr('id').split('_')[1];
        if(object_type == self.overlayTypes.RECORD) {
            $('#panel_' + object_type).children().each(function() {
                $(this).children().each(function() {
                    $(this).show();    
                })   
            });
        }
        else {
            $.each($('#panel_' + object_type).children(), function() {
                $(this).show();    
            });
        }
        $(this).hide();
    });
    
    $('#print').click(function() {
        self.loadPrintForm({iframe: true});
    });
    $('#print').bind("contextmenu", function(event) {
        self.loadPrintForm({iframe: false});
    });
    
    $('#btnUploadMap').click(function() {
        $('#dialogTitle').html('Upload Map Form');
        $('#dialogBody').html(
            $('<div></div>').css({
                height: 100
            }).html('Add a form here'));
        $('#my-modal').modal('show');
    });
    
    $('#upload').click(function() {
        /*$('#dialogTitle').html('Upload Maps, Forms & Media');
        $('#dialogBody').html(
            $('<div></div>').css({
                height: 100
            }).html('Add a form here'));
        $('#my-modal').modal('show');*/
		window.open('/upload/', '_blank');
    });
    
      
    //display where all the prints were generated:
    //if(this.showOutlines)
    //    this.drawOutlines();
    
    this.initProjectsMenu();
        
    google.maps.event.addListener(this.map, 'zoom_changed', function() {
        self.doViewportUpdates();
    });
	
	google.maps.event.addListener(this.map, 'bounds_changed', function() {
        self.doViewportUpdates();
    });
    
    this.infoBubble = new InfoBubble({
        //maxWidth: 650,
        //minWidth: 350,
        borderRadius: 0,
        maxHeight: 385,
        //minHeight: 250,
        padding: 0,
        closeBubbleExtras: function() {
            if(self.currentOverlay) {
                self.currentOverlay.closeInfoBubble();
            }
        }
    });
    
    
    this.initArrowNav();
	
	//if there's only one project, turn it on by default:
	if(this.initProjectID == null && this.projects.length == 1)
		this.initProjectID = this.projects[0].id;	
	if(this.initProjectID != null)
		this.toggleProjectData(this.initProjectID, 'projects', true, false);
	if(this.initViewID != null)
		this.toggleProjectData(this.initViewID, 'views', true, true);
};

localground.viewer.prototype.setPosition = function(minimize) {
    localground.basemap.prototype.setPosition.call(this, minimize);
    $('#panel_data').css({
		'height': $('#map_panel').height() - 74,
		'overflow-y': 'auto'
	});
};

localground.viewer.prototype.doViewportUpdates = function() {
	$.each(self.managers, function() {
		try { this.doViewportUpdates(); }
		catch(e) { }
	});
};

localground.viewer.prototype.initProjectsMenu = function() {
    if(this.projects && this.projects.length > 0) {
        $.each(this.projects, function() {
            var projectID = this.id;
            var $span = $('<span></span>').html(this.name);
            var $cb = $('<input type="checkbox" class="cb_project" />')
                        .attr('id', this.id)
                        .attr('title', this.id)
                        .val(this.id);
            $cb.change(function() {
				return self.toggleProjectData(parseInt($(this).val()), 'projects', $(this).attr('checked'), false);	
			});
            $cb.checked = false;
            var $li = $('<li></li>')
                .append($cb).append($span)
                .css({'cursor': 'pointer'})
                .click(function(){
                    //kind of a weird hack, but it works:
                    var $cb = $(this).find('input');
                    var isChecked = $cb.attr('checked') ? false : true;
                    $cb.attr('checked', isChecked); //toggle checkbox
                    $cb.trigger('change');
                    $cb.attr('checked', isChecked);
                    return false;
                });
            $('#projectList').append($li);   
        });
        self.extendTwitterDropdowns();
        $('#projectListContainer').css({
            'max-height': '250px',
            'overflow-y': 'auto',
            'overflow-x': 'hidden',
            'width': '300px',
            'max-width': '400px'
        });
        $('#projectList').css({
            'width': $('#projectListContainer').width()
        });
    }
    else {
        $('#projects-menu').hide(); 
    }
};

localground.viewer.prototype.toggleProjectData = function(groupID, groupType, 
														  is_checked, turn_on_everything) {
	if(is_checked) {
		$('#' + groupID).attr('checked', true);
		self.lastProjectSelection = groupID;
		var params = {
			include_processed_maps: true,
			include_markers: true,
			include_audio: true,
			include_photos: true,
			include_notes: true
		};
		var url = '/api/0/' + groupType + '/' + groupID + '/';
		if(self.accessKey != null)
			url += self.accessKey + '/';
		$.getJSON(url, params,
			function(result) {
				if(!result.success) {
					alert(result.message);
					return;
				}
				//process paper maps:
				$('#mode_toggle').show();
				self.paperManager.addRecords(result.processed_maps);
				self.paperManager.renderOverlays();     
				//process photos:
				self.photoManager.addRecords(result.photos);  
				self.photoManager.renderOverlays();  
				//process audio:
				self.audioManager.addRecords(result.audio); 
				self.audioManager.renderOverlays();
				//process markers:
				self.markerManager.addRecords(result.markers);
				self.markerManager.renderOverlays();
				//process notes:
				if(result.notes != null) {
					var colors = ['1F78B4', 'B2DF8A', '33A02C', 'FB9A99', 'E31A1C', 'FDBF6F',
                    'A6CEE3'];
					$.each(result.notes, function(idx) {
						var tableManager = new localground.tableManager(this, colors[idx]);
						tableManager.addRecords(this.data);
						tableManager.renderOverlays();
						self.managers.push(tableManager);
					});
				}
				self.resetBounds();
				
				//re-organize this:
				if(turn_on_everything && (self.initProjectID != null || self.initViewID != null)) {
					if(!$('#toggle_paper_all').attr('checked')){
						$('#toggle_paper_all').attr('checked', true);
						$('#toggle_paper_all').trigger('change');	
					}
					if(!$('#toggle_photo_all').attr('checked')){
						$('#toggle_photo_all').attr('checked', true);
						$('#toggle_photo_all').trigger('change');	
					}
					if(!$('#toggle_audio_all').attr('checked')){
						$('#toggle_audio_all').attr('checked', true);
						$('#toggle_audio_all').trigger('change');	
					}
					if(!$('#toggle_marker_all').attr('checked')){
						$('#toggle_marker_all').attr('checked', true);
						$('#toggle_marker_all').trigger('change');	
					}
				}
				self.resetBounds();
				//$('#toggle_photo_all').attr('checked', true);
			},
		'json');
	} //end if checked
	else {
		$.each(self.managers, function() {
			this.removeByProjectID(groupID);    
		});
		self.resetBounds();
		if($('.cb_project:checked').length == 0) {
			$('#mode_toggle').hide();
		}
	}
	return;
};

localground.viewer.prototype.resetBounds = function() {
    this.fullExtent = null, bounds = null;
    $.each(this.managers, function() {
        bounds = this.getLayerBounds();
        if(self.fullExtent == null)
            self.fullExtent = bounds;    
        else if(bounds)
            self.fullExtent.union(bounds);
    });
    if(this.fullExtent != null && !this.fullExtent.isEmpty()) {
		this.map.fitBounds(self.fullExtent);    
    }
};


localground.basemap.prototype.hideDialog = function() {
    $('#my-modal').modal('hide');
};

localground.viewer.prototype.loadPrintForm = function(opts) {
    var basemap_config = this.getOverlaySourceInfo('name', this.map.mapTypeId);
    if(!basemap_config.is_printable){
        this.displayMessage(
            ['The ' + basemap_config.name + ' map is not printable at this time']
        );
        return false;
    }
    $('#do_print').show();
    var layer_overlays = [], scan_overlays = [];
    $.each($('#layerList').find('input'), function() {
        if($(this).attr('checked'))
            layer_overlays.push($(this).val());           
    });
    $.each($('.cb_paper'), function() {
        if($(this).attr('checked'))
            scan_overlays.push($(this).val());           
    });
    var params = {
        center_lat: this.map.getCenter().lat(),
        center_lng: this.map.getCenter().lng(),
        zoom: this.map.getZoom(),
        basemap_id: basemap_config.id
    };
    if(layer_overlays.length > 0)
        params.layer_ids = layer_overlays.join(',');
    if(scan_overlays.length > 0)
        params.scan_ids = scan_overlays.join(',');
    if(self.lastProjectSelection != null)
        params.project_id = self.lastProjectSelection;

    var url = 'http://' + document.location.hostname + '/print/generate/'
    if(opts.iframe) {
        url += 'embed/?' + $.param(params);
    }
    else {
        url += '?' + $.param(params);
        window.open(url, '_blank');
        return false;
    }
    var max_width = 1100;
    var modal_width = Math.min(max_width, $('body').width());
    var modal_height = $('body').height()-135;
    var $iframe = $('<iframe></iframe>')
        .css({
            'width': (modal_width-3),
            'height': modal_height,
            'margin': '0px 0px 0px 0px',
            'display': 'block'
        })
        .attr('id', 'the_frame')
        .attr('frameborder', 0)
        .attr('src', url)
        .load(function() {
            $('#dialogTitle').parent().find('.label').remove();
            var $f =  $iframe.contents().find('#the_form');
            
            //adjust overflow params:
            var has_overflow = $iframe.width() < max_width;
            var of = 'hidden';
            if(has_overflow)
                of = 'auto';
            $('#dialogBody').style('overflow-x', of, 'important');
            $('#inner_div').style('overflow-x', of, 'important');
            $iframe.contents().find('body').style('overflow-x', of, 'important');

            if($f.get(0) == null) {
                //if no form found, then it's a confirmation screen:
                $('#do_print').hide();
            }
        });
        
    $('#dialogTitle').css({
        'display': 'inline-block',
        'vertical-align': 'middle'
        }).html('Configure Your Map');
    $('#dialogTitle').parent().prepend(
        $('<div />')
            .css({
                'display': 'inline-block',
                'margin': '10px 10px; 0px 0px'
            })
            .addClass('label success')
            .append(
                $('<img />')
                    .attr('src', '/static/images/ajax-loader-small-green.gif')
                    .css({ 'vertical-align': 'middle'})
            ).append(' Loading')
        );
    var $innerDiv = $('<div id="inner_div"></div>')
        .css({'overflow': 'hidden', 'height': modal_height})
        //.append($loadingImg)
        .append($iframe);
    $('#dialogBody').empty().append($innerDiv);
    $('#my-modal').css({
        'width':modal_width,
        'margin-left': -1*parseInt(modal_width/2),
        'margin-top': -1*parseInt($('body').height()/2)+10
    }).modal('show');
    return true;
};

localground.viewer.prototype.generatePrint = function(opts) {
    //instead of directly submitting the form, call the button that
    // triggers the form's submit to get the form validation too!
    $('#the_frame').contents().find('#submit').trigger('click');
}

localground.viewer.prototype.initArrowNav = function() {
    $('body').keypress(function(event){
        var lat = self.map.getCenter().lat(),
            lng = self.map.getCenter().lng(),
            top = self.map.getBounds().getNorthEast().lat(),
            right = self.map.getBounds().getNorthEast().lng(),
            bottom = self.map.getBounds().getSouthWest().lat(),
            left = self.map.getBounds().getSouthWest().lng();
        percentage = 0.05;
        var newCenter = null;
        switch(event.keyCode) {
            case self.keycodes.UP:
                newCenter = new google.maps.LatLng(lat + (top-lat)*percentage*2, lng);
                break;
            case self.keycodes.DOWN:
                newCenter = new google.maps.LatLng(lat - (lat-bottom)*percentage*2, lng);
                break;
            case self.keycodes.LEFT:
                newCenter = new google.maps.LatLng(lat, lng + (left-lng)*percentage);
                break;
            case self.keycodes.RIGHT:
                newCenter = new google.maps.LatLng(lat, lng - (lng-right)*percentage);
                break;
            default:
                return true;
        }
        /*var color = '33A02C';
        var img = 'http://chart.apis.google.com/chart?cht=it&chs=10x10&chco=' + 
            color + ',000000ff,ffffff01&chl=&chx=000000,0&chf=bg,s,00000000&ext=.png';
        var icon = new google.maps.MarkerImage(img,
            new google.maps.Size(10, 10),
            new google.maps.Point(0,0),
            new google.maps.Point(5, 5));
        if(this.marker == null)
            this.marker = new google.maps.Marker({
                position: newCenter,
                map: self.map,
                icon: icon
            });
        else
            this.marker.setPosition(newCenter);*/
        self.map.panTo(newCenter);
        return false;
    });
};
