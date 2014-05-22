var self;
var show_markers = false;
localground.viewer = function(){
	self = this;
    this.projects = [];
    this.views = [];
    this.overlay_types = {
		PHOTO: 'photo',
		AUDIO: 'audio',
		VIDEO: 'video',
		MARKER: 'marker',
		RECORD: 'record',
		SCAN: 'map-image'
	};
    this.keycodes = {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39
    }
	this.colors = [
		'1F78B4', 'B2DF8A', '33A02C', 'FB9A99',
		'E31A1C', 'FDBF6F', 'A6CEE3'
	];
	this.colorIndex = 0;
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
    this.views = [];
    this.accessKey = null;
    this.managers = {};
	this.slideshow = null;
	this.dataCount = 0;
    this.currentViewID = null;
	this.owners = [];
	
};
localground.viewer.prototype = new localground.basemap();           // Here's where the inheritance occurs 

localground.viewer.prototype.initialize=function(opts){
	self = this;
	$.extend(this, opts);
    
    localground.basemap.prototype.initialize.call(this, opts);
    this.initSearchBox();
    
    this.map.mapTypeControlOptions.position = google.maps.ControlPosition.TOP_LEFT;
	this.map.streetViewControl = true;
    
    $('input:checkbox')
        .attr('checked', false)
        .attr('disabled', false);
	
	//init slideshow player:	
	this.slideshow = new localground.slideshow();
	this.slideshow.initialize({
		listenerFunction: 'self.slideshow.player',
		flashID: 'audio_player',
		renderFlashPlayer: true
	});
   
    $('.unhide').click(function() {
        var object_type = $(this).parent().attr('id').split('_')[1];
        if(object_type == self.overlay_types.RECORD) {
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
	
	$('#save_view').click(function() {
		self.loadSaveView();
	});
        

    this.initProjectsMenu();
    this.initViewsMenu();
        
    google.maps.event.addListener(this.map, 'zoom_changed', function() {
        self.doViewportUpdates();
    });
	
	google.maps.event.addListener(this.map, 'bounds_changed', function() {
        self.doViewportUpdates();
    });
	
	this.tooltip = new InfoBubble({
		borderRadius: 5,
        maxHeight: 200,
        padding: 5,
		disableAnimation: true,
		disableAutoPan: true,
		hideCloseButton: true,
		arrowSize: 10
    });
	
	/*$('.close').click(function(){
		$(this).parent().parent().hide();
    });*/
    
    this.infoBubble = new InfoBubble({
        borderRadius: 5,
        maxHeight: 385,
        padding: 0,
		disableAnimation: true,
		pixelOffset: new google.maps.Size(130, 120),
        closeBubbleExtras: function() {
            if(self.currentOverlay) {
                self.currentOverlay.closeInfoBubble();
            }
        }
    });

	//init pan map with arrow keys
    this.initArrowNav();
	
	// turn on default project, if requested
	this.initDefaultProject();
	this.initGroupTabs();
	this.initFiltering();
	
	this.setStreetViewCloseButton();
};

localground.viewer.prototype.initSearchBox = function() {
    var $input = $('#addressInput');
    this.map.controls[google.maps.ControlPosition.RIGHT_TOP].push($input.get(0));
    this.searchBox = new google.maps.places.SearchBox($input.get(0));
    google.maps.event.addListener(this.searchBox, 'places_changed', function() {
        self.search();
    });
    $input.keyup(function(event){
        if(event.keyCode == 13){
            self.search();
        }
    });
};


localground.viewer.prototype.setPosition = function(minimize) {
    localground.basemap.prototype.setPosition.call(this, minimize);
    $('#panel_data').css({
		'height': $('#map_panel').height() - 74,
		'overflow-y': 'auto'
	});
};

localground.viewer.prototype.doViewportUpdates = function() {
	for(var key in self.managers) {
		try { self.managers[key].doViewportUpdates(); }
		catch(e) { }	
	}
};

localground.viewer.prototype.initProjectsMenu = function() {
    if(this.projects && this.projects.length > 0) {
        $.each(this.projects, function() {
            var projectID = this.id;
            var $span = $('<span></span>').html(this.name);
            var $cb = $('<input type="checkbox" class="cb_project" />')
                        .attr('id', 'project-' + projectID)
                        .val(projectID);
            $cb.change(function() {
				return self.toggleProjectData(parseInt($(this).val()), 'projects', $(this).attr('checked'), false);	
			});
            $cb.checked = false;
            var $li = $('<li></li>')
                .append($cb).append($span)
                .click(function(){
                    //kind of a weird hack, but it works:
                    var $cb = $(this).find('input');
                    $cb.prop('checked',!$cb.prop('checked'));
                    $cb.trigger('change');
                    return false;
                });



            $('#projectList').append($li);

            $('#project-download-list').append("<li><a href='/api/0/projects/" + projectID +
                                                "/?format=csv'>" + this.name + "</li>");
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

localground.viewer.prototype.initViewsMenu = function() {
    if(this.views && this.views.length > 0) {
        $.each(this.views, function() {
            var viewID = this.id;
            var $span = $('<span></span>').html(this.name);
            var $rb = $('<input type="radio" name="radio_view" />')
                        .attr('id', 'view-' + viewID)
                        .val(viewID);
            $rb.change(function() {
				return self.toggleViewData(parseInt($(this).val()), 'views', $(this).prop('checked'), true);
			});
            $rb.checked = false;
            var $li = $('<li class="view-option"></li>')
                .append($rb).append($span)
                .click(function(){
                    //kind of a weird hack, but it works:
                    $('.view-option').css('border','none');
                    $(this).css('border','dotted');
                    var $cb = $(this).find('input');
                    $cb.prop('checked',!$cb.prop('checked'));
                    $cb.trigger('change');
                    return false;
                });



            $('#viewList').append($li);

            $('#view-download-list').append("<li><a href='/api/0/projects/" + viewID +
                                                "/?format=csv'>" + this.name + "</li>");
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


localground.viewer.prototype.getManager = function(data_list) {
	switch (data_list.id) {
		case 'photos':
			return new localground.photoManager(data_list.id);
		case 'audio':
			return new localground.audioManager(data_list.id);
		case 'markers':
			return new localground.markerManager(data_list.id);
		case 'map-images':
			return new localground.scanManager(data_list.id);
		default:
			return new localground.tableManager({
				id: data_list.id,
				color: self.colors[++self.colorIndex],
				headers: data_list.headers
			});		
	}
};

localground.viewer.prototype.initGroupTabs = function() {
	// a hack so that the dropdown menu doesn't disappear
	// when tabs are clicked.
	$('#group_tabs > li > a').each(function() {
        var $this = $(this);
        $this.click(function (e) {
            e.preventDefault();
            $this.tab('show');
            e.stopPropagation();
        });
    });
}

localground.viewer.prototype.initFiltering = function() {
	var me = this;
	$('#clear_filter').click(function(){
		//clear out values:
		$('#owner_filter').val('');
		$('#name_filter').val('');
		$('#tag_filter').val('');
		$('#description_filter').val('');
		$('#apply_filter').trigger('click');
	});
	$('#apply_filter').click(function(event){
		var owner = $('#owner_filter').val();
		var name = $('#name_filter').val();
		var tags = $('#tag_filter').val();
		var description = $('#description_filter').val();
		
		self.dataCount = 0;
		$.each(self.managers, function(k, v) {
			$.each(v.data, function(){
				var show = (
					me.isMatch(this.owner, owner) &&
					me.isMatch(this.name, name) &&
					me.isMatch(this.tags, tags) &&
					me.isMatch(this.description, description)
				);
				if(show) {
					++self.dataCount;
					this.showOverlay();
				}
				else {
					this.hideOverlay();
				}
			});
		});
		$('#filter_counter').html(self.dataCount);
		$('#filter_menu_button').trigger('click');
	});
}

localground.viewer.prototype.isMatch = function(item, searchTerm) {
	searchTerm = searchTerm.toLowerCase();
	if(searchTerm == null || searchTerm.length == 0) return true;
	if (item == null || item == '') {
		if(searchTerm == "untitled")
			return true;
		return false;
	}
	return item.toLowerCase().indexOf(searchTerm) != -1;
};

localground.viewer.prototype.toggleProjectData = function(groupID, groupType, 
														  is_checked, turn_on_everything) {


	if(is_checked) {
		$('#' + groupID).prop('checked', true);
		this.getProjectData(groupID, groupType, is_checked, turn_on_everything);
	}
	else {
		//remove data from project:
		for(var key in self.managers) {
			self.managers[key].removeByProjectID(groupID);
		}
		self.resetBounds();
		if($('.cb_project:checked').length == 0) {
			$('#map_toolbar').hide();
		}
		self.initFilterData();
	}
	return true;
};

localground.viewer.prototype.toggleViewData = function(groupID, groupType,
														  is_checked, turn_on_everything) {

    //remove data from project:
    for(var key in self.managers) {
        //
        self.managers[key].removeAll(self.currentViewID);
    }
    //don't want to show a view in addition to projects and get things mixed up
    $('.cb_project').prop('checked',false);


    self.resetBounds();
    if($('.rb_views:checked').length == 0) {
        $('#map_toolbar').hide();
    }
    self.initFilterData();

	this.getProjectData(groupID, groupType, is_checked, turn_on_everything);

    self.currentViewID = groupID;

	return true;
};



localground.viewer.prototype.initFilterData = function() {
	self.owners = [];
	var selectedVal = $('#owner_filter').val();
	$.each(this.managers, function(k, v) {
		$.each(v.data, function(){
			if(this.owner && self.owners.indexOf(this.owner) == -1)
				self.owners.push(this.owner);	
		});
	});
	$('#owner_filter').empty();
	$('#owner_filter').append(
		$('<option></option>').attr('value', "").html('Everyone')
	);
	$.each(self.owners, function(){
		var owner = this.toString();
		$('#owner_filter').append(
			$('<option></option>').attr('value', owner).html(owner)
		);	
	});
	//re-filter, just in cases owner filter has expired:
	$('#owner_filter').val(selectedVal);
	$('#apply_filter').trigger('click');
	$('#filter_menu_button').trigger('click'); //close the menu!
}

localground.viewer.prototype.getProjectData = function(groupID, groupType, 
										is_checked, turn_on_everything, access_key) {
	self.lastProjectSelection = groupID;
	var params = {
		format: 'json',
		include_processed_maps: true,
		include_markers: true,
		include_audio: true,
		include_photos: true,
		include_tables: true,
		access_key: access_key
	};
	var url = '/api/0/' + groupType + '/' + groupID + '/';
	if(self.accessKey != null)
		url += self.accessKey + '/';
	$.getJSON(url, params,
		function(result) {
			if(result.detail) {
				alert(result.detail);
				return;
			}
			$.each(result.children, function(k, v) {
				if(self.managers[v.id]) {
					self.managers[v.id].addRecords(v.data);
					self.managers[v.id].renderOverlays();
                    if(turn_on_everything) {
                        $('#toggle_' + v.id + '_all')
								.prop('checked', true).trigger('change');
                    }
				}
				else {
					//initialize new manager object:
					self.managers[v.id] = self.getManager(v);
					self.managers[v.id].initialize(v);
					//turn everything on, if requested (from URL param):
					if(turn_on_everything) {

							$('#toggle_' + v.id + '_all')
								.prop('checked', true).trigger('change');

					}
				}
				
			});
			if (self.mode == 'edit') {
				self.makeEditable();
			}
			$('#map_toolbar').show();
			self.resetBounds();
			self.initFilterData();
		},
	'json');
};

localground.viewer.prototype.resetBounds = function() {
    this.fullExtent = null, bounds = null;
	for(var key in self.managers) {
		bounds = self.managers[key].getLayerBounds();
		if(self.fullExtent == null)
            self.fullExtent = bounds;    
        else if(bounds)
            self.fullExtent.union(bounds);
	}
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
	$('#my-modal').find('.close').unbind('click');
	$('#my-modal').find('.close').click(function(){
		//alert('triggering');
		$('#close_print_modal').trigger('click');
	});
    var layer_overlays = [], scan_overlays = [];
    $.each($('#layerList').find('input'), function() {
        if($(this).attr('checked'))
            layer_overlays.push($(this).val());           
    });
    $.each($('.cb_' + self.overlay_types.SCAN), function() {
        if($(this).attr('checked'))
            scan_overlays.push($(this).val());           
    });
    var params = {
        center_lat: this.map.getCenter().lat(),
        center_lng: this.map.getCenter().lng(),
        zoom: this.map.getZoom(),
        map_provider: basemap_config.id
    };
    if(layer_overlays.length > 0)
        params.layer_ids = layer_overlays.join(',');
    if(scan_overlays.length > 0)
        params.scan_ids = scan_overlays.join(',');
    if(self.lastProjectSelection != null)
        params.project_id = self.lastProjectSelection;

    var url = 'http://' + document.location.hostname + '/maps/print/'
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
};

localground.viewer.prototype.loadSaveView = function() {
	//1. get list of views:
	var url = '/api/0/views/';
	if(self.accessKey != null)
		url += self.accessKey + '/';
	$.getJSON(url + '.json',
		function(result) {
			var $sel = $('#dd_views');
			$sel.empty();
			$.each(result.results, function(){
				$sel.append(
					$('<option></option>').attr('value', this.id).html(this.name)	
				);
			})
		});
	
	//2. populate textbox:
	var entities = [];
	$.each(self.managers, function(k, v) {
		var overlayIDs = v.getTurnedOnOverlayIDs();
		if (overlayIDs.length > 0) {
			entities.push({
				overlay_type: v.overlay_type,
				ids: overlayIDs
			});
		}
	});
	var geoJSON = {
		type: 'Point',
		coordinates: [
				this.map.getCenter().lng(),
				this.map.getCenter().lat()
		]
	};
	$('#entities').val(JSON.stringify(entities));
	$('#view_center').val(JSON.stringify(geoJSON));
	$('#basemap_id').val(this.getMapTypeId());
	
	//3. show dialog:
	$('#save_dialog').modal('show');
	$('#save_dialog').find('.close').unbind('click');
	$('#save_dialog').find('.close').click(function(){
		$('#save_dialog').find('.btn').trigger('click');
		return false;
	}); 
};

localground.viewer.prototype.saveView = function(){
	$.ajax({
        //
		url: '/api/0/views/' + $('#dd_views').val() + '/.json',
		type: 'PATCH',
		data: {
			entities: $('#entities').val(),
			center: $('#view_center').val(),
			basemap: $('#basemap_id').val()
		},
		success: function(data) {
			alert(JSON.stringify(data));
		},
		notmodified: function(data) { alert('Not modified'); },
		error: function(data) { alert('Error: ' + JSON.stringify(data)); }
	});
};

localground.viewer.prototype.initDefaultProject = function() {
	var turn_on_everything = false;
	if(this.initProjectID != null)
		turn_on_everything = true;	
	else if(this.projects.length == 1) //if there's only one project, turn it on by default:
		this.initProjectID = this.projects[0].id;	
	if(this.initProjectID != null)
		this.toggleProjectData(this.initProjectID, 'projects', true, turn_on_everything);
	if(this.initViewID != null)
		this.toggleProjectData(this.initViewID, 'views', true, turn_on_everything);	
};


localground.viewer.prototype.initArrowNav = function() {
	//allows you to pan the map with keybard arrows.
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
        self.map.panTo(newCenter);
        return false;
    });
};

localground.viewer.prototype.makeEditable = function() {
    return;
};

localground.viewer.prototype.makeViewable = function() {
    return;
};

localground.viewer.prototype.setStreetViewCloseButton = function() {
	/*
	A hack to make a more visible "exit streetview" button.
	*/
	window.addEventListener('DOMContentLoaded', function( e ){
	
		// Get close button and insert it into streetView
		// #button can be anyt dom element
		var closeButton = document.querySelector('#streetview_close_button'),
			controlPosition = google.maps.ControlPosition.TOP_LEFT;
		// Assumes map has been initiated 
		var streetView = self.map.getStreetView();
	
		// Hide useless and tiny default close button
		streetView.setOptions({ enableCloseButton: false });
	
		// Add to street view
		streetView.controls[ controlPosition ].push( closeButton );
	
		// Listen for click event on custom button
		// Can also be $(document).on('click') if using jQuery
		google.maps.event.addDomListener(closeButton, 'click', function(){
			streetView.setVisible(false);
		});
	
	});
	
	google.maps.event.addListener(this.map, 'idle', function() {
		$('#streetview_close_button').css({ display: 'block' });
	});
};



