define(["backbone", "models/marker", "collections/base"], function(Backbone) {
    /**
	 * @class localground.collections.Markers
	 */
	localground.collections.Markers = localground.collections.Base.extend({
        model: localground.models.Marker,
		name: 'Markers',
        url: '/api/0/markers/',
		parse : function(response) {
            return response.results;
        },
    });
    return localground.collections.Markers;
});
