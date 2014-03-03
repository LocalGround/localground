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
    
    this.deleteMenu = new DeleteMenu();
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
	this.addEventHandlers();
    }
    else if(turnedOn) {
	this.googleOverlay.setMap(self.map);
    }
    if(this.isEditMode())
        this.makeEditable();   
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
	me.deleteMenu.open(self.map, me.googleOverlay.getPath(), e.vertex);

    });
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
localground.polyline.prototype.updateGeometry = function(polyline) {
    $.ajax({
	url: polyline.url + '.json',
	type: 'PUT',
	data: { geometry: JSON.stringify(polyline.getGeoJSON()) },
	success: function(data) {
	    polyline.renderListing();
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






/**
 * A menu that lets a user delete a selected vertex of a path.
 * @constructor
 */
function DeleteMenu() {
  this.div_ = document.createElement('div');
  this.div_.className = 'delete-menu';
  this.div_.innerHTML = 'Delete';

  var menu = this;
  google.maps.event.addDomListener(this.div_, 'click', function() {
    menu.removeVertex();
  });
}
DeleteMenu.prototype = new google.maps.OverlayView();

DeleteMenu.prototype.onAdd = function() {
  var deleteMenu = this;
  var map = this.getMap();
  this.getPanes().floatPane.appendChild(this.div_);

  // mousedown anywhere on the map except on the menu div will close the
  // menu.
  this.divListener_ = google.maps.event.addDomListener(map.getDiv(), 'mousedown', function(e) {
    if (e.target != deleteMenu.div_) {
      deleteMenu.close();
    }
  }, true);
};

DeleteMenu.prototype.onRemove = function() {
  google.maps.event.removeListener(this.divListener_);
  this.div_.parentNode.removeChild(this.div_);

  // clean up
  this.set('position');
  this.set('path');
  this.set('vertex');
};

DeleteMenu.prototype.close = function() {
  this.setMap(null);
};

DeleteMenu.prototype.draw = function() {
  var position = this.get('position');
  var projection = this.getProjection();

  if (!position || !projection) {
    return;
  }

  var point = projection.fromLatLngToDivPixel(position);
  this.div_.style.top = point.y + 'px';
  this.div_.style.left = point.x + 'px';
};

/**
 * Opens the menu at a vertex of a given path.
 */
DeleteMenu.prototype.open = function(map, path, vertex) {
    this.set('position', path.getAt(vertex));
    this.set('path', path);
    this.set('vertex', vertex);
    this.setMap(map);
    this.draw();
};

/**
 * Deletes the vertex from the path.
 */
DeleteMenu.prototype.removeVertex = function() {
  var path = this.get('path');
  var vertex = this.get('vertex');

  if (!path || vertex == undefined) {
    this.close();
    return;
  }

  path.removeAt(vertex);
  this.close();
};

