define(["models/base"], function(Base) {
	/**
	 * A Backbone Model class for the MapImage datatype.
	 * @class MapImage
	 * @see <a href="http://localground.org/api/0/map-images/">http://localground.org/api/0/map-images/</a>
	 */
	localground.models.MapImage = Base.extend({
		defaults: {
			name: "Untitled"
		}
	});
	return localground.models.MapImage;
});
