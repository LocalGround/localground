define(["backbone", "models/photo"], function(Backbone) {
    var Photos = Backbone.Collection.extend({
        model: localground.models.Photo,
		name: 'Photos',
        url: '/api/0/photos/',
		parse : function(response) {
            return response.results;
        },
    });
    return Photos;
});
