/*
Understands how to create a symbolic representation of
a geomety, given a style.
*/
Symbol = function(map, latLng, style){
	this.latLng = latLng;
	this.googleOverlay = new google.maps.Marker({
		map: map,
		position: latLng,
		icon: style
	});
};

Symbol.prototype.applyStyle = function(style) {
	this.googleOverlay.setIcon(style);
};
