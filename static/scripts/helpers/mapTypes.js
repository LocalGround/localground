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


//Cloudmade:
function CloudMadeType(opts) {
    this.cloudmadeKey = opts.cloudmadeKey;
    this.styleID = 1;
    this.maxZoom = opts.maxZoom;
    this.styleID = opts.styleID;
    this.name = opts.name;
};
CloudMadeType.prototype.tileSize = new google.maps.Size(256,256);
//CloudMadeType.prototype.maxZoom = 18;
CloudMadeType.prototype.getTile = function(coord, zoom, ownerDocument) {
    //cycle between a, b, and c sub-domains:
    var url = 'http://' + ['a', 'b', 'c'][parseInt(Math.random()*3)] + '.tile.cloudmade.com/';
    return $('<div></div>').css({
        'width': '256px',
        'height': '256px',
        'backgroundImage': 'url(' + url + this.cloudmadeKey + '/' + this.styleID + '/256/' + zoom + '/' + coord.x + '/' + coord.y + '.png)',
        'filter': 'alpha(opacity=80)'
        /*filter:alpha(opacity=90);
        -moz-opacity:0.9;
        -khtml-opacity: 0.9;
        opacity: 0.9;*/
    }).get(0);
};
CloudMadeType.prototype.name = this.name;


//Cloudmade:
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



