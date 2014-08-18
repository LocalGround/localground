define(["backbone", "models/photo", "collections/base"], function(Backbone) {
    /**
	 * @class localground.collections.Photos
	 */
	localground.collections.Photos = localground.collections.Base.extend({
        model: localground.models.Photo,
		name: 'Photos',
        url: '/api/0/photos/',
    });
    return localground.collections.Photos;
});
