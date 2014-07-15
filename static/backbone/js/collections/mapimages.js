define(["jquery", "lib/external/backbone-min", "models/mapimage"], function($, Backbone, MapImage) {
    var MapImages = Backbone.Collection.extend({
        model: MapImage,
        name: 'Map Images',
        url: 'http://localground.org/api/0/map-images/',
		parse : function(response) {
            return response.results;
        },
    });
    return MapImages;
});
