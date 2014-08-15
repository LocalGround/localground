define(["jquery", "backbone", "models/marker"], function($, Backbone) {
    var Markers = Backbone.Collection.extend({
        model: localground.models.Marker,
		name: 'Markers',
        url: '/api/0/markers/',
		parse : function(response) {
            return response.results;
        },
    });
    return Markers;
});
