localground.kml = function(opts){
    //initialize object properties to null (for readability):
    this.overlayType = 'kml';
    this.id = null;
    this.zoomLevel = null;
	this.url = null;
    $.extend(this, opts);
};

localground.kml.prototype = new localground.overlay();

localground.kml.prototype.renderOverlay = function() {
    if(this.url != null && this.googleOverlay == null) {
        this.googleOverlay = new google.maps.KmlLayer({
			url: this.url
		});
	}
	//this.googleOverlay.setMap(self.map);
};

localground.kml.prototype.renderListing = function() {
	localground.overlay.prototype.renderListing.call(this);
};

localground.kml.prototype.renderListingImage = function() {
	return null;
};

localground.kml.prototype.zoomToOverlay = function() {
    if(this.googleOverlay != null) {
	//alert(this.googleOverlay.getDefaultViewport());
	//alert(this.googleOverlay.getDefaultViewport().getCenter());
        //self.map.setCenter(this.googleOverlay.getDefaultViewport().getCenter());
        //self.map.setZoom(this.zoomLevel);
	self.map.fitBounds(this.googleOverlay.getDefaultViewport());
    }
};

localground.kml.prototype.inView = function() {
    if(this.googleOverlay &&
       self.map.getBounds().contains(this.googleOverlay.getDefaultViewport().getCenter())) {
        return true;    
    }
    return false;   
};


localground.kml.prototype.toggleOverlay = function(isOn) {
    var $cb = $('#cb_' + this.getObjectType() + '_' + this.id);
    //if checked, make markers visible and check everything:
    if(isOn) {
        if(this.isVisible() && this.googleOverlay && this.googleOverlay.getMap() == null) {
			if(this.googleOverlay) {
				this.googleOverlay.setMap(self.map);   
			}
            $cb.attr('checked', true);
        }
    }
    else {
        $cb.attr('checked', false);
        if(this.googleOverlay)
			this.googleOverlay.setMap(null);
    }
};

localground.kml.prototype.makeEditable = function() {
	//do nothing
	return false;
};
