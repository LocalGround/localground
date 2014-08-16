define(["models/base"], function() {
	/**
	 * A Backbone Model class for the MapImage datatype.
	 * @class MapImage
	 * @see <a href="http://localground.org/api/0/map-images/">http://localground.org/api/0/map-images/</a>
	 */
	localground.models.MapImage = localground.models.Base.extend({
		defaults: {
			name: "Untitled"
		}
	});
	return localground.models.MapImage;
});
