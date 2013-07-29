localground.kmlManager = function(data){
    this.name = 'Other Files';
    this.overlayType = 'kml';
    this.data = [];
    this.batchTurnOnLimit = 10;
};

localground.kmlManager.prototype = new localground.manager();

localground.kmlManager.prototype.addRecords = function(data, opts) {
    var me = this;
    $.each(data, function(){
        if(opts.view_id)
            this.view_id = opts.view_id;
        me.data.push(new localground.kml(this));        
    });
};

localground.kmlManager.prototype.getLayerBounds = function() {
    var bounds = new google.maps.LatLngBounds();
    $.each(this.data, function() {
        if(this.googleOverlay && this.isVisible()) {
            bounds.union(this.googleOverlay.getDefaultViewport());
        }
    });
    if(bounds == new google.maps.LatLngBounds())
        return self.map.getBounds();
    return bounds;
};

localground.kmlManager.prototype.makeViewable = function() {
	return false;
};

localground.kmlManager.prototype.toggleOverlays = function(isOn) {
    //iterate through each table and turn on/off:
    var me = this;
    $.each(this.data, function(index) {
        //for kmls, only turn on the first 10,
        //since they're currently so large
        if(isOn) {
            if(index <= me.batchTurnOnLimit)
                this.toggleOverlay(true);
        }
        else {
            this.toggleOverlay(false);    
        }
    });  
};

            