define(["jquery", "backbone", "models/mapimage"], function($, Backbone) {
    var MapImages = Backbone.Collection.extend({
        model: localground.models.MapImage,
        name: 'Map Images',
        url: '/api/0/map-images/',
		parse : function(response) {
            return response.results;
        },
    });
    return MapImages;
});
