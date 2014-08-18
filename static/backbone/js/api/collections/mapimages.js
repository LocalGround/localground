define(["backbone", "models/mapimage", "collections/base"], function(Backbone) {
    /**
	 * @class localground.collections.MapImages
	 */
	localground.collections.MapImages = localground.collections.Base.extend({
        model: localground.models.MapImage,
        name: 'Map Images',
        url: '/api/0/map-images/',
		parse : function(response) {
            return response.results;
        },
    });
    return localground.collections.MapImages;
});
