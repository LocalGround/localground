define(["backbone", "models/audio", "collections/base"], function(Backbone) {
    /**
	 * @class localground.collections.AudioFiles
	 */
	localground.collections.AudioFiles = localground.collections.Base.extend({
        model: localground.models.Audio,
		name: 'Audio Files',
        url: '/api/0/audio/',
		parse : function(response) {
            return response.results;
        },
    });
    return localground.collections.AudioFiles;
});
