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
    this.bubbleWidth = 350;
    this.bubbleHeight = 250;
    this.overlayType = "polyline";
    this.directionsService = new google.maps.DirectionsService();
    this.waypoints = [];
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
	strokeColor: '#' + this.color,
	strokeOpacity: 1.0,
	strokeWeight: 5
    });
};

localground.polyline.prototype.showInfoBubbleView = function(opts) {
    if (opts == null)
	opts = {};
    $.extend(opts, {
	width: '250px',
	height: '140px'
    });
    //ensures that the marker renders on top:
    this.googleOverlay.setMap(null);
    this.googleOverlay.setMap(self.map);

    //build bubble content:
    var $container = $('<div />');
    $container.append(this.renderDetail());
    var $contentContainer = this.renderInfoBubble(opts);
    $contentContainer.append($container);
};

localground.polyline.prototype.showInfoBubbleEdit = function(opts){
    if (opts == null)
	opts = {};
    $.extend(opts, {
	margin: '25px 0px 0px 0px'
    });
    var $container = this.renderInfoBubble(opts);
    $container.children().empty();
    var me = this;
    var fields = this.getManager().getUpdateSchema();
    var form = new ui.form({
        schema: fields,
        object: this,
        exclude: ['geometry', 'project_id']
    });
    return $container.append(form.render({
        height: this.bubbleHeight - 50,
        margin: '0px'
    }));
};

localground.polyline.prototype.refresh = function() {
    this.image = this.markerImage = this.iconSmall = this.iconLarge =
        'https://chart.googleapis.com/chart?chc=corp&chs=25x30&cht=lc:nda&chco=' +
	this.color + '&chd=t:0,50,30,80&chls=' + this.lineWidth + '&chxt=5';
    this.googleOverlay.setOptions({strokeColor: this.color});
    localground.overlay.prototype.refresh.call(this);
};

localground.polyline.prototype.addEventHandlers = function() {
    var me = this;
    google.maps.event.clearListeners(this.googleOverlay.getPath());
    google.maps.event.clearListeners(this.googleOverlay);
    google.maps.event.addListener(this.googleOverlay, "click", function(mEvent) {
	self.currentOverlay = me;
        me.closeInfoBubble();
        me.showInfoBubble({
	    latLng: mEvent.latLng
	});
    });
    google.maps.event.addListener(this.googleOverlay.getPath(), 'set_at', function(e){
	/*me.waypoints.push({
	    location: me.googleOverlay.getPath().getAt(e)
	});*/
	me.updateGeometry(me);
    });
    google.maps.event.addListener(this.googleOverlay.getPath(), 'remove_at', function(e){
	/*var latLng = me.googleOverlay.getPath().getAt(e);
	for (i=0; i < me.waypoints.length; i++) {
	    if (me.waypoints[i].location == latLng) {
		me.waypoints.removeAt(i);
		return;
	    }
	}*/
	me.updateGeometry(me);
    });
    google.maps.event.addListener(this.googleOverlay.getPath(), 'insert_at', function(e){
	/*me.waypoints.push({
	    location: me.googleOverlay.getPath().getAt(e)
	});*/
	me.updateGeometry(me);
    });
    
    google.maps.event.addListener(this.googleOverlay, 'rightclick', function(e) {
	if (e.vertex == undefined) { return; }
	me.showDeleteMenu(me, e);
    });
};

localground.polyline.prototype.showDeleteMenu = function(shape, e) {
    if (shape.googleOverlay.getPath().getLength() <=2) { return; }
    shape.deleteMenu.open(self.map, shape.googleOverlay, e.vertex);  
};

localground.polyline.prototype.zoomToOverlay = function() {
    localground.overlay.prototype.zoomToOverlay.call(this);
    self.map.fitBounds(this.getBounds());
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
    //return a point near the center of the line:
    if (this.googleOverlay) {
	var coordinates = this.googleOverlay.getPath().getArray();
	return coordinates[Math.floor(coordinates.length/2)];
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
    //shape.snap(shape);
    $.ajax({
	url: shape.url,
	type: 'PUT',
	data: {
	    geometry: JSON.stringify(shape.getGeoJSON()),
	    format: 'json'
	},
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
    return Math.round( distance/1609.34 * 100 ) / 100;
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

localground.polyline.prototype.snap = function(shape){
    var me = shape;
    var pathCoords = shape.googleOverlay.getPath().getArray();
    var start = pathCoords[0];
    var end = pathCoords[pathCoords.length-1];
    var request = {
	origin:start,
	destination:end,
	waypoints: shape.waypoints,
	optimizeWaypoints: true,
	travelMode: google.maps.TravelMode.DRIVING
    };
    me.directionsService.route(request, function(result, status) {
	if (status == google.maps.DirectionsStatus.OK) {
	    me.googleOverlay.setPath(result.routes[0].overview_path);
	    //save after update:
	    $.ajax({
		url: me.url,
		type: 'PUT',
		data: {
		    geometry: JSON.stringify(me.getGeoJSON()),
		    format: 'json'
		},
		success: function(data) {
		    me.renderListing();
		    //a hack to reset the shape:
		    me.googleOverlay.setOptions({'editable': false});
		    me.googleOverlay.setOptions({'editable': true});
		    
		}
	    });
	}
    });
}
