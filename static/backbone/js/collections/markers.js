define(["jquery", "lib/external/backbone-min", "models/marker"], function($, Backbone, Marker) {
    var Markers = Backbone.Collection.extend({
        model: Marker,
		name: 'Markers',
        url: 'http://localground.org/api/0/markers/',
		parse : function(response) {
            return response.results;
        },
    });
    return Markers;
});
