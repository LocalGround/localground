localground.scan = function(opts){
    //initialize object properties to null (for readability):
    this.counter = 0; //tracks which processed image the map is currently using
	this.managerID = this.overlayType = self.overlayTypes.SCAN;
    this.id = null;
    this.overlay_path = null;
    this.north = null;
    this.south = null;
    this.east = null;
    this.west = null;
    this.zoomLevel = null;
    $.extend(this, opts);
};

localground.scan.prototype = new localground.overlay();

localground.scan.prototype.renderOverlay = function() {
    if(this.north != null && this.googleOverlay == null) {
        this.googleOverlay = new google.maps.GroundOverlay(
            this.overlay_path, 
            new google.maps.LatLngBounds(
                new google.maps.LatLng(this.south, this.west),
                new google.maps.LatLng(this.north, this.east)
            ));
    }
};

localground.scan.prototype.renderListing = function() {
	localground.overlay.prototype.renderListing.call(this);
			
	//append image cycler to the div:
	var me = this;
	$cycleDiv = $('<span></span>')
		.addClass('image-cycler')
		.css({display: 'none', 'margin-left': '3px'})
		.append(
			$('<span title="show previous image alternative"></span>')
				.addClass('previous-image sprite-light ui-icon-circle-triangle-w')
				.css({float: 'none', display: 'inline-block'})
				.click(function() {
					me.counter--;
					if(me.counter <= 0) { me.counter = me.map_images.length-1; }    
					me.updateOverlay(me.map_images[me.counter]);	
				})
		).append(
			$('<span title="show next image alternative"></span>')
				.addClass('next-image sprite-light ui-icon-circle-triangle-e')
				.css({float: 'none', display: 'inline-block'})
				.click(function() {
					me.counter++;
					if(me.counter >= me.map_images.length) { me.counter = 0; }
					me.updateOverlay(me.map_images[me.counter]);
				})
		);
	this.getListingCheckbox().after($cycleDiv);
}

localground.scan.prototype.renderListingImage = function() {
	return null;
};

localground.scan.prototype.zoomToOverlay = function() {
    if(this.googleOverlay != null) {
        self.map.setCenter(this.googleOverlay.getBounds().getCenter());
        self.map.setZoom(this.zoomLevel);
    }
};

localground.scan.prototype.inView = function() {
    if(this.googleOverlay &&
       self.map.getBounds().contains(this.googleOverlay.getBounds().getCenter())) {
        return true;    
    }
    return false;   
};


localground.scan.prototype.toggleOverlay = function(isOn) {
	//call default renderer:
	localground.overlay.prototype.toggleOverlay.call(this, isOn);
	
	//extra processing for edit mode:
	var $elem = this.getListingCheckbox();
	if(this.isEditMode() && isOn) {
		var me = this;
		//get alternate image options:
		if(me.map_images == null) {
            $.getJSON('/api/0/map-images/get-image-options/', {uuid: me.uuid},
                function(result) {
					me.map_images = result.map_images;
					me.counter = 0;
					$.each(me.map_images, function(idx) {
						if(me.map_image_id == this.map_image_id) {
							me.counter = idx;
							return;
						}
					});
					if(me.map_images.length > 1) {
						$elem.next().css({display: 'inline-block'}); //show image cycler
					}
				});
        }
        else {
            if(item.map_images.length > 1 && this.mode == 'edit') {
				$elem.next().css({display: 'inline-block'}); //show image cycler
            }
        }
    }
    else {
		$elem.next().css({display: 'none'}); //hide image cycler
    }	
};

localground.scan.prototype.updateOverlay = function(config) {
    var imageBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(config.south, config.west),
        new google.maps.LatLng(config.north, config.east)
    );
    var imageURL = config.overlay_path;
	if(this.googleOverlay == null) {
        this.googleOverlay = new google.maps.GroundOverlay(imageURL, imageBounds);
    }
    else {
        this.googleOverlay.setMap(null);
        this.googleOverlay = new google.maps.GroundOverlay(imageURL, imageBounds);
        this.googleOverlay.setMap(self.map);
    }
    //save new configuration:
    var params = {scan_uuid: this.uuid, map_image_id: config.map_image_id}
    var me = this;
	$.post(
        '/api/0/map-images/save-image-option/', params,
        function(result) {
            if(result.success)
                me.map_image_id = config.map_image_id;   
        },
    'json');
};

localground.scan.prototype.makeEditable = function() {
	if(this.googleOverlay.map != null) {
		if(this.map_images && this.map_images.length > 1) {
			this.getListingElement().find('.image-cycler').css({display: 'inline-block'});
		}
		else {
			this.toggleOverlay(true); //query for map image options...
		}
	}
};
