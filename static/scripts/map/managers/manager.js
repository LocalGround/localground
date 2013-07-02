/**
 * Abstract class for all managers.
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.manager = function(){
    this.id;
	this.name;
	this.overlay_type;
	this.data = [];
};

localground.manager.prototype.initialize = function(opts) {
    this.id = opts.id;
	this.name = opts.name;
	this.overlay_type = opts.overlay_type;
	this.addRecords(opts.data);
	this.renderOverlays();
};

localground.manager.prototype.getDataElementByID = function(id) {
	$elem = null;
	$.each(this.data, function() {
		if(this.id == id) {
			$elem = this;
			return;
		}
	});
	return $elem;
};

localground.manager.prototype.addDataContainer = function() {
    //add a section within the id="panel_record" div for the data:
    if(this.getListingContainer().get(0) == null) {
        var me = this;
		//alert(this.getObjectType());
		var $container = $('<div />').attr('id', 'panel_' + this.getObjectType())
							.addClass('listing_container')
							.css({
								'border-left': 'solid 0px #ccc',
								'margin-bottom': '5px',
								'padding': '5px 0px 0px 0px'
							});
        var $heading = $('<div />').attr('id', 'header_' + this.getObjectType())
							.css({
								'border-bottom': 'solid 1px #ccc',
								'padding-bottom': '5px',
								'margin-bottom': '5px'
							});
        $heading.append($('<div />')
					.addClass('show-hide sprite-small ui-icon-right-triangle-small')
					.attr('type', 'checkbox')
					.attr('title', 'show / hide')
					.click(function() {
						me.showHide($(this));
					}));
		$heading.append($('<input />')
					.attr('type', 'checkbox')
					.attr('id', 'toggle_' + this.id + '_all')
					.change(function() {
						me.toggleOverlays($(this).attr('checked'));  
					}));
        
        $heading.append($('<h4 />').html(this.name).css({'display': 'inline'}));
        $heading.append($('<img />')
                            .attr('src', '/static/images/icon-searchbox.png')
                            .attr('title', 'zoom to visible')
                            .addClass('zoom-magnifying-glass pull-right')
                            .click(function() {
                                me.zoomToLayer();    
                            }));
                                    
        $('#panel_data').append($container)
		$container.append($heading);
        var $body = $('<div />').attr('id', this.getObjectType())
                        .addClass('overlayPanel');
        $body.append(
            $('<div />')
                .css({height: 20})
                .addClass('unhide')
                .append(
                    $('<a />')
                        .attr('href', '#')
                        .addClass('pull-right')
                        .html('show hidden')
                        .click(function() {
                            $.each(me.getListingContainer().children(), function() {
                                $(this).show();    
                            });
                            $(this).parent().hide();    
                        })
                    )
            );
        $container.append($body);
    }   
};

localground.manager.prototype.renderOverlays = function() {
    this.addDataContainer();
	$.each(this.data, function() {
        //return if item has already been drawn:
        if($('#' + this.getObjectType() + '_' + this.id).get(0) != null) {
            return;
        }
        this.renderOverlay();
        this.renderListing();         
    });
    this.updateVisibility();
};

localground.manager.prototype.removeByProjectID = function(projectID) {
	for(var i = this.data.length-1; i >= 0; i--) {
		overlay = this.data[i];    
		if(overlay.project_id == projectID) {
			//close bubble:
			if(overlay == self.currentOverlay)
				self.currentOverlay.closeInfoBubble();
			//remove marker:
			if(overlay.googleOverlay) {
				overlay.googleOverlay.setMap(null);
				google.maps.event.clearListeners(overlay.googleOverlay, 'drag');
				google.maps.event.clearListeners(overlay.googleOverlay, 'dragstart');
				google.maps.event.clearListeners(overlay.googleOverlay, 'dragend');
			}
			//remove listing:
			if(overlay.getListingElement())
				overlay.getListingElement().remove();
			this.data.splice(i,1);
		}
	}
	this.updateVisibility();
};

localground.manager.prototype.addNewOverlay = function(overlay) {
	this.data.push(overlay);
     
	//create new data container if one doesn't already exist:     
	this.addDataContainer();  
	
	//render the overlay:
	overlay.renderOverlay({turnedOn: true});
	overlay.renderListing();
	
	//update visibility of container:
	this.updateVisibility();
};

localground.manager.prototype.atLeastOneVisible = function() {
	/*
	  Not sure what the purpose of this function is...
	*/
	var oneVisible = false;
	$.each(this.data, function() {
		if(this.isVisible()) {
			oneVisible = true;
			return;
		}
	});
	return oneVisible;
};

localground.manager.prototype.updateVisibility = function() {
    //if(this.data.length > 0 && this.atLeastOneVisible())
	var panel = this.getListingPanel();
	if(this.data.length > 0)
        panel.show();
    else if(panel)
        panel.hide();
};

localground.manager.prototype.getObjectType = function() {
	return this.overlay_type;
};

localground.manager.prototype.getListingPanel = function() {
	return $('#panel_' + this.getObjectType());
};

localground.manager.prototype.getListingHeader = function() {
	return $('#header_' + this.getObjectType());
};

localground.manager.prototype.getListingContainer = function() {
	return $('#' + this.getObjectType());
};

localground.manager.prototype.addRecords = function(data) {
    alert('abstract: to be implemented in child class');
};

localground.manager.prototype.getLayerBounds = function() {
    var hasVisibleData = false;
    var bounds = new google.maps.LatLngBounds();
    $.each(this.data, function() {
        if(this.googleOverlay && this.isVisible()) {
            bounds.extend(this.googleOverlay.position);
			hasVisibleData = true;
        }
    });
	if(hasVisibleData)
		return bounds;
	return null;
};

localground.manager.prototype.zoomToLayer = function() {
    self.map.fitBounds(this.getLayerBounds());    
};

localground.manager.prototype.toggleOverlays = function(isOn) {
    //iterate through each table and turn on/off:
    $.each(this.data, function() {
        this.toggleOverlay(isOn);          
    });  
};

localground.manager.prototype.showHide = function($elem) {
    if($elem.hasClass('ui-icon-bottom-triangle-small')) {
        $elem.removeClass('ui-icon-bottom-triangle-small')
            .addClass('ui-icon-right-triangle-small');
        $elem.parent().next().slideUp();
    }
    else {
        $elem.removeClass('ui-icon-right-triangle-small')
            .addClass('ui-icon-bottom-triangle-small');
        $elem.parent().next().slideDown();    
    }
};

localground.manager.prototype.makeEditable = function() {
	$.each(this.data, function() {
		this.makeEditable();	
	});
};

localground.manager.prototype.makeViewable = function() {
	$.each(this.data, function() {
		this.makeViewable();	
	});	
};

localground.manager.prototype.getLoadingImage = function(w, h) {
	return $('<div id="load_msg"></div>')
				.css({
					'width': (w-3),
					'height': h,
					'text-align': 'center'
				})
				.append($('<img />')
					.attr('src', '/static/images/ajax-loader.gif')
			);	
};
localground.manager.prototype.getLoadingImageSmall = function() {
	return $('<img />').css({
					'display': 'inline-block'
				}).attr('src', '/static/images/ajax-loader-small.gif');
};

localground.manager.prototype.doViewportUpdates = function() {
	//implemented in child classes
	return;
};