localground.map.tiles.MapBox = (function (opts) {
    this.styleID = 1
    this.maxZoom = opts.max;
    this.styleID = opts.styleID;
    this.name = opts.name;
	this.tileSize = new google.maps.Size(256,256);
	this.getTile = function(coord, zoom, ownerDocument) {
		var url = '//' + ['a.', 'b.', 'c.', 'd.'][parseInt(Math.random()*4)] + 'tiles.mapbox.com/v3/';
		return $('<div></div>').css({
			'width': '256px',
			'height': '256px',
			'backgroundImage': 'url(' + url + this.styleID + '/' + zoom + '/' +
									coord.x + '/' + coord.y + '.png)'
	
		}).get(0);
	};
});