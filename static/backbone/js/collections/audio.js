define(["jquery", "lib/external/backbone-min", "models/audio"], function($, Backbone, Audio) {
    var AudioFiles = Backbone.Collection.extend({
        model: Audio,
		name: 'Audio Files',
        url: 'http://localground.org/api/0/audio/',
		parse : function(response) {
            return response.results;
        },
    });
    return AudioFiles;
});
