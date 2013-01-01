localground.scanManager = function(){
	this.batchTurnOnLimit = 10;
	this.data = [];
};

localground.scanManager.prototype = new localground.manager();

localground.scanManager.prototype.addRecords = function(data) {
    var me = this;
    $.each(data, function(){
        me.data.push(new localground.scan(this));        
    });
};

localground.scanManager.prototype.getLayerBounds = function() {
    var bounds = new google.maps.LatLngBounds();
    $.each(this.data, function() {
        if(this.googleOverlay && this.isVisible()) {
            bounds.union(this.googleOverlay.getBounds());
        }
    });
    if(bounds == new google.maps.LatLngBounds())
        return self.map.getBounds();
    return bounds;
};

localground.scanManager.prototype.makeViewable = function() {
	localground.manager.prototype.makeViewable.call(this);
    $('.image-cycler').css({display: 'none'});
};

localground.scanManager.prototype.toggleOverlays = function(isOn) {
    //iterate through each table and turn on/off:
    var me = this;
    $.each(this.data, function(index) {
        //for paper maps, only turn on the first 10,
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

            