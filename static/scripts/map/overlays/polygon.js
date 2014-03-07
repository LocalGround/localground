/**
 * For convenience, this class depends on the global variable "self" which
 * is the main controller object that uses this class.
**/
localground.polygon = function(opts){
    localground.polyline.call(this, opts);
    this.image = this.markerImage = this.iconSmall = this.iconLarge =
	'https://chart.googleapis.com/chart?chc=corp&chs=25x30&cht=lc&chco=' +
	this.color + ',' + this.color + '&chd=t:90,75,60,70,80%7C90,20,30,80&' +
	'chls=' + this.lineWidth + '%7C' + this.lineWidth + '&cht=lc:nda';
};

localground.polygon.prototype = new localground.polyline();


localground.polygon.prototype.createOverlay = function() {
    this.googleOverlay = new google.maps.Polygon({
	path: this.getGooglePath(),
	strokeColor: this.color,
	strokeOpacity: 1.0,
	strokeWeight: 5,
	fillColor: this.color,
	fillOpacity: 0.35
      });
};


localground.polygon.prototype.showDeleteMenu = function(shape, e) {
    if (shape.googleOverlay.getPaths && shape.googleOverlay.getPath().getLength() <=3) { return; }
    shape.deleteMenu.open(self.map, shape.googleOverlay, e.vertex);  
};


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

