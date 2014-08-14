define([], function() {
	/** 
     * Class that initializes a Stamen tileset.
     * @class Stamen
     * @param opts Initialization options for the Stamen class.
     * @param {Integer} opts.max
     * The maximum valid zoom level for the tileset.
     * @param {Integer} opts.styleID
     * The corresponding style ID associated with the tileset.
     * @param {String} name
     * The name of the tileset.
     */
	localground.map.tiles.Stamen = (function (opts) {
		this.styleID = 1
		this.maxZoom = opts.max;
		this.styleID = opts.styleID;
		this.name = opts.name;
		this.tileSize = new google.maps.Size(256,256);
		this.getTile = function(coord, zoom, ownerDocument) {
			var url = 'http://' + ['', 'a.', 'b.', 'c.', 'd.'][parseInt(Math.random()*5)] + 'tile.stamen.com/';
			return $('<div></div>').css({
				'width': '256px',
				'height': '256px',
				'backgroundImage': 'url(' + url + this.styleID + '/' + zoom + '/' +
										coord.x + '/' + coord.y + '.jpg)'
		
			}).get(0);
		};
	});
	return localground.map.tiles.Stamen;
});