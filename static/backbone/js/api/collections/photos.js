define(["jquery", "backbone", "models/photo"], function($, Backbone, Photo) {
    var Photos = Backbone.Collection.extend({
        model: Photo,
		name: 'Photos',
        url: '/api/0/photos/',
		parse : function(response) {
            return response.results;
        },
    });
    return Photos;
});
