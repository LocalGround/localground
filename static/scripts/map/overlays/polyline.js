/**
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.polyline = function(opts){
    this.color = 'FF0000'
    this.accessKey = null;
    this.managerID = null;
    this.lineWidth = 3;
    if(opts)
        $.extend(this, opts);
	this.image = this.markerImage = this.iconSmall = this.iconLarge =
        'https://chart.googleapis.com/chart?chc=corp&chs=25x30&cht=lc:nda&chco=' +
	this.color + '&chd=t:0,50,30,80&chls=' + this.lineWidth + '&chxt=5';
    this.bubbleWidth = 480;
    this.bubbleHeight = 360;
    
    this.deleteMenu = new DeleteMenu();
    
    //extend this class with the createmixin functions too:
    extend(localground.polyline.prototype, localground.createmixin.prototype);
};

localground.polyline.prototype = new localground.overlay();

localground.polyline.prototype.renderOverlay = function(opts) {
    var turnedOn = $('#toggle_' + this.getObjectType() + '_all').attr('checked');
    var hideIfMarker = (self.hideIfMarker && this.markerID != null);
    turnedOn = turnedOn && !hideIfMarker;
    
    //to override default behavior:
    if(opts && opts.turnedOn)
        turnedOn = opts.turnedOn;
    if(this.googleOverlay == null) {
	this.createOverlay();
	this.addEventHandlers();
    }
    if(turnedOn) {
	this.googleOverlay.setMap(self.map);
    }
    if(this.isEditMode())
        this.makeEditable();   
};

localground.polyline.prototype.createOverlay = function() {
    this.googleOverlay = new google.maps.Polyline({
	path: this.getGooglePath(),
	strokeColor: this.color,
	strokeOpacity: 1.0,
	strokeWeight: 5
    });
};

localground.polyline.prototype.addEventHandlers = function() {
    var me = this;
    /*google.maps.event.addListener(this.googleOverlay, "click", function(mEvent) {
        self.currentOverlay = me;
        me.closeInfoBubble();
        me.showInfoBubble();
    });*/
    
    google.maps.event.clearListeners(this.googleOverlay.getPath());
    google.maps.event.clearListeners(this.googleOverlay);
    google.maps.event.addListener(this.googleOverlay.getPath(), 'set_at', function(){
	me.updateGeometry(me);
    });
    google.maps.event.addListener(this.googleOverlay.getPath(), 'remove_at', function(){
	me.updateGeometry(me);
    });
    google.maps.event.addListener(this.googleOverlay.getPath(), 'insert_at', function(){
	me.updateGeometry(me);
    });
    
    google.maps.event.addListener(this.googleOverlay, 'rightclick', function(e) {
	// Check if click was on a vertex control point
	if (e.vertex == undefined) { return; }
	if (me.googleOverlay.getPath().getLength() <=2) { return; }
	me.deleteMenu.open(self.map, me.googleOverlay.getPath(), e.vertex);
    });
};

localground.polyline.prototype.zoomToOverlay = function() {
    this.closeInfoBubble();
    self.map.fitBounds(this.getBounds());
    //google.maps.event.trigger(this.googleOverlay, 'click');
};

localground.polyline.prototype.getBounds = function() {
    if (this.googleOverlay) {
	var bounds = new google.maps.LatLngBounds();
	var coordinates = this.googleOverlay.getPath().getArray();
	for (var i = 0; i < coordinates.length; i++) {
	    bounds.extend(coordinates[i]);
	}
	return bounds;
    }
    return null;
};

localground.polyline.prototype.getCenterPoint = function() {
    if (this.googleOverlay) {
	return this.getBounds().getCenter();
    }
    return null;
};

localground.polyline.prototype.makeViewable = function() {
    if(this.googleOverlay) {
        this.googleOverlay.setOptions({'draggable': false, 'editable': false});
	google.maps.event.clearListeners(this.googleOverlay.getPath());
    }
};

localground.polyline.prototype.makeEditable = function() {
    if(!this.isEditMode()) return;
    var me = this;
    if(this.googleOverlay) {
        this.googleOverlay.setOptions({'draggable': false, 'editable': true});
	this.addEventHandlers();
    }
};
localground.polyline.prototype.updateGeometry = function(shape) {
    $.ajax({
	url: shape.url + '.json',
	type: 'PUT',
	data: { geometry: JSON.stringify(shape.getGeoJSON()) },
	success: function(data) {
	    shape.renderListing();
	    //a hack to reset the shape:
	    shape.googleOverlay.setOptions({'editable': false});
	    shape.googleOverlay.setOptions({'editable': true});
	}
    }); 
}

localground.polyline.prototype.renderListingText = function() {
    var $div_text = localground.overlay.prototype.renderListingText.call(this);
    $div_text.append('<br><span>' + this.calculateDistance() + ' miles</span>');
    return $div_text;
};

localground.polyline.prototype.calculateDistance = function() {
    var coords = this.googleOverlay.getPath().getArray();
    var distance = 0;
    for (var i=1; i < coords.length; i++) {
	distance += google.maps.geometry.spherical.computeDistanceBetween(coords[i-1], coords[i]);
    }
    return Math.round( distance/1609.34 * 10 ) / 10;
};

localground.polyline.prototype.getGeoJSON = function(googleOverlay){
    if (googleOverlay == null)  googleOverlay = this.googleOverlay;
    var pathCoords = googleOverlay.getPath().getArray();
    var coords = [];
    for (var i = 0; i < pathCoords.length; i++){
	coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
    }
    return {
	type: 'LineString',
	coordinates: coords
    };
};

localground.polyline.prototype.getGooglePath = function(){
    var path = [];
    for (var i = 0; i < this.geometry.coordinates.length; i++){
	var coord = this.geometry.coordinates[i];
	var ll = new google.maps.LatLng(coord[1], coord[0]);
	path.push(ll);
    }
    return path;
};
