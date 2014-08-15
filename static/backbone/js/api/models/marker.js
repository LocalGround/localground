define(["models/base"], function(Base) {
	/**
	 * A Backbone Model class for the Marker datatype.
	 * @class Marker
	 * @see <a href="http://localground.org/api/0/markers/">http://localground.org/api/0/markers/</a>
	 */
	localground.models.Marker = Base.extend({
		defaults: {
			name: "Untitled"
		}
	});
	return localground.models.Marker;
});
