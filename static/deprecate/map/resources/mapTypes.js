//OSM:
function GenericType(opts) {
    this.url = opts.url;
    this.maxZoom = opts.max;
    //this.url = 'http://tile.openstreetmap.org/';
}
GenericType.prototype.tileSize = new google.maps.Size(256,256);
GenericType.prototype.getTile = function(coord, zoom, ownerDocument) {
    return $('<div></div>').css({
        'width': '256px',
        'height': '256px',
        'backgroundImage': 'url(' + this.url + zoom + '/' + coord.x + '/' + coord.y + '.png)',
        'filter': 'alpha(opacity=20)'
    }).get(0);
};
GenericType.prototype.name = "Mapnik";

//Stamen:
function StamenType(opts) {
    this.styleID = 1
    this.maxZoom = opts.max;
    this.styleID = opts.styleID
    this.name = opts.name
};
StamenType.prototype.tileSize = new google.maps.Size(256,256);
//CloudMadeType.prototype.maxZoom = 18;
StamenType.prototype.getTile = function(coord, zoom, ownerDocument) {
    //cycle between a, b, and c sub-domains:
    var url = 'http://' + ['', 'a.', 'b.', 'c.', 'd.'][parseInt(Math.random()*5)] + 'tile.stamen.com/';
    return $('<div></div>').css({
        'width': '256px',
        'height': '256px',
        'backgroundImage': 'url(' + url + this.styleID + '/' + zoom + '/' +
                                coord.x + '/' + coord.y + '.jpg)'

    }).get(0);
};
StamenType.prototype.name = this.name;


//MapBox:
function MapBoxType(opts) {
    this.maxZoom = opts.max;
    this.styleID = opts.styleID
    this.name = opts.name
};

// static map url:
// http://api.tiles.mapbox.com/v3/nps.pt-shaded-relief,nps.pt-urban-areas,nps.pt-river-lines,nps.pt-admin-lines,nps.pt-park-poly,nps.pt-mask,nps.pt-hydro-features,nps.pt-admin-labels,nps.pt-roads,nps.pt-road-shields,nps.pt-park-points,nps.pt-hydro-labels,nps.pt-city-labels,nps.pt-park-labels/pin-m-monument%28-77.04,38.89%29/-77.04,38.89,13/640x640.png
MapBoxType.prototype.tileSize = new google.maps.Size(256,256);
MapBoxType.prototype.getTile = function(coord, zoom, ownerDocument) {
    //cycle between a, b, and c sub-domains:
    var url = 'http://' + ['a.', 'b.', 'c.', 'd.'][parseInt(Math.random()*4)] + 'tiles.mapbox.com/v3/';
    return $('<div></div>').css({
        'width': '256px',
        'height': '256px',
        'backgroundImage': 'url(' + url + this.styleID + '/' + zoom + '/' +
                                coord.x + '/' + coord.y + '.png)'

    }).get(0);
};
MapBoxType.prototype.name = this.name;




