/**
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.polyline = function(opts){
    this.review_count = 0;
    this.photo_count = 0;
    this.audio_count = 0;
    this.video_count = 0;
    this.record_count = 0;
    this.map_image_count = 0;
    this.photoIDs = null;
    this.audioIDs = null;
    this.recordIDs = null;
    this.color = 'FF0000'
    this.accessKey = null;
    this.managerID = null;
    if(opts)
        $.extend(this, opts);
	this.image = this.markerImage = this.iconSmall = this.iconLarge =
        'https://chart.googleapis.com/chart?chc=corp&chs=25x30&cht=lc:nda&chco=' +
	this.color + '&chd=t:0,60,0,60&chls=4&chxt=5';
    this.bubbleWidth = 480;
    this.bubbleHeight = 360;
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
	this.googleOverlay = new google.maps.Polyline({
	    path: this.getGooglePath(),
	    strokeColor: this.color,
	    strokeOpacity: 1.0,
	    strokeWeight: 5
	  });
	
	this.addMarkerEventHandlers();
    }
    else if(turnedOn) {
	this.googleOverlay.setMap(self.map);
    }
    if(this.isEditMode())
        this.makeEditable();   
};

localground.polyline.prototype.addMarkerEventHandlers = function() {
    var me = this;
    /*google.maps.event.addListener(this.googleOverlay, "click", function(mEvent) {
        self.currentOverlay = me;
        me.closeInfoBubble();
        me.showInfoBubble();
    });*/
};

localground.polyline.prototype.createNew = function(googleOverlay, projectID) {
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
	google.maps.event.clearListeners(this.googleOverlay.getPath(), 'set_at');
    }
};

localground.polyline.prototype.makeEditable = function() {
    if(!this.isEditMode()) return;
    var me = this;
    if(this.googleOverlay) {
        this.googleOverlay.setOptions({'draggable': true, 'editable': true});
	google.maps.event.clearListeners(this.googleOverlay.getPath(), 'set_at');
	google.maps.event.addListener(this.googleOverlay.getPath(), "set_at", function(mEvent) {
	    $.ajax({
		url: me.url + '.json',
		type: 'PUT',
		data: { geometry: JSON.stringify(me.getGeoJSON()) },
		success: function(data) {
		    //no action needed
		}
	    }); 
        });
    }
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
}
