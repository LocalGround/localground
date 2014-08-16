define(["backbone", "models/audio"], function(Backbone) {
    var AudioFiles = Backbone.Collection.extend({
        model: localground.models.Audio,
		name: 'Audio Files',
        url: '/api/0/audio/',
		parse : function(response) {
            return response.results;
        },
    });
    return AudioFiles;
});
