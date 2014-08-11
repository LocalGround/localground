define(["jquery", "backbone", "models/marker"], function($, Backbone, Marker) {
    var Markers = Backbone.Collection.extend({
        model: Marker,
		name: 'Markers',
        url: '/api/0/markers/',
		parse : function(response) {
            return response.results;
        },
    });
    return Markers;
});
