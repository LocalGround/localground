/**
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.polygon = function(opts){
    this.color = 'FF0000'
    this.accessKey = null;
    this.managerID = null;
    if(opts)
        $.extend(this, opts);
	this.image = this.markerImage = this.iconSmall = this.iconLarge =
	'https://chart.googleapis.com/chart?chc=corp&chs=25x30&cht=lc&chco=' +
	this.color + ',' + this.color + '&chd=t:90,75,60,75,90%7C90,20,30,90&' +
	'chls=4%7C4&cht=lc:nda';
    this.bubbleWidth = 480;
    this.bubbleHeight = 360;
    this.deleteMenu = new DeleteMenu();
};

localground.polygon.prototype = new localground.overlay();

localground.polygon.prototype.renderOverlay = function(opts) {
    var turnedOn = $('#toggle_' + this.getObjectType() + '_all').attr('checked');
    var hideIfMarker = (self.hideIfMarker && this.markerID != null);
    turnedOn = turnedOn && !hideIfMarker;
    
    //to override default behavior:
    if(opts && opts.turnedOn)
        turnedOn = opts.turnedOn;
    if(this.googleOverlay == null) {
	this.googleOverlay = new google.maps.Polygon({
	    path: this.getGooglePath(),
	    strokeColor: this.color,
	    strokeOpacity: 1.0,
	    strokeWeight: 5,
	    fillColor: this.color,
	    fillOpacity: 0.35
	  });
	this.addEventHandlers();
    }
    else if(turnedOn) {
	this.googleOverlay.setMap(self.map);
    }
    if(this.isEditMode())
        this.makeEditable();   
};

localground.polygon.prototype.addEventHandlers = function() {
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
	me.deleteMenu.open(self.map, me.googleOverlay.getPath(), e.vertex);

    });
};

localground.polygon.prototype.createNew = function(googleOverlay, projectID) {
    var me = this;
    $.ajax({
        url: '/api/0/markers/?format=json',
        type: 'POST',
        data: {
            geometry: JSON.stringify(me.getGeoJSON(googleOverlay)),
            project_id: projectID,
            color: me.color,
            format: 'json'
        },
        success: function(data) {
	    data.managerID = 'markers';
            $.extend(me, data);
            //add to marker manager:
            me.getManager().addNewOverlay(me);
            //remove temporary marker:
            googleOverlay.setMap(null);
        },
        notmodified: function(data) { alert('Not modified'); },
        error: function(data) { alert('Error'); }
    }); 
};

localground.polygon.prototype.zoomToOverlay = function() {
    this.closeInfoBubble();
    self.map.fitBounds(this.getBounds());
    //google.maps.event.trigger(this.googleOverlay, 'click');
};

localground.polygon.prototype.getBounds = function() {
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

localground.polygon.prototype.getCenterPoint = function() {
    if (this.googleOverlay) {
	return this.getBounds().getCenter();
    }
    return null;
};

localground.polygon.prototype.makeViewable = function() {
    if(this.googleOverlay) {
        this.googleOverlay.setOptions({'draggable': false, 'editable': false});
	google.maps.event.clearListeners(this.googleOverlay.getPath());
    }
};

localground.polygon.prototype.makeEditable = function() {
    if(!this.isEditMode()) return;
    var me = this;
    if(this.googleOverlay) {
        this.googleOverlay.setOptions({'draggable': false, 'editable': true});
	this.addEventHandlers();
    }
};
localground.polygon.prototype.updateGeometry = function(polygon) {
    $.ajax({
	url: polygon.url + '.json',
	type: 'PUT',
	data: { geometry: JSON.stringify(polygon.getGeoJSON()) },
	success: function(data) {
	    polygon.renderListing();
	}
    }); 
}

localground.polygon.prototype.renderListingText = function() {
    var $div_text = localground.overlay.prototype.renderListingText.call(this);
    $div_text.append('<br><span>' + this.calculateArea() + ' miles</span>');
    return $div_text;
};

localground.polygon.prototype.calculateArea = function() {
    /*var coords = this.googleOverlay.getPath().getArray();
    var distance = 0;
    for (var i=1; i < coords.length; i++) {
	distance += google.maps.geometry.spherical.computeDistanceBetween(coords[i-1], coords[i]);
    }
    return Math.round( distance/1609.34 * 10 ) / 10;*/
    return 0.0;
};

localground.polygon.prototype.getGeoJSON = function(googleOverlay){
    if (googleOverlay == null)  googleOverlay = this.googleOverlay;
    var pathCoords = googleOverlay.getPath().getArray();
    var coords = [];
    for (var i = 0; i < pathCoords.length; i++){
	coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
    }
    //add last coordinate again:
    coords.push([pathCoords[0].lng(), pathCoords[0].lat()])
    return {
	type: 'Polygon',
	coordinates: [coords]
    };
};

localground.polygon.prototype.getGooglePath = function(){
    var path = [];
    var coords = this.geometry.coordinates[0];
    for (var i = 0; i < coords.length; i++){
	var coord = coords[i];
	var ll = new google.maps.LatLng(coord[1], coord[0]);
	path.push(ll);
    }
    path.pop();
    return path;
};

