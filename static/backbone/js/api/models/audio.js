define(["models/base"], function() {
	/**
	 * A Backbone Model class for the Audio datatype.
	 * @class Audio
	 * @see <a href="http://localground.org/api/0/audio/">http://localground.org/api/0/audio/</a>
	 */
	localground.models.Audio = localground.models.Base.extend({
		defaults: {
			name: "Untitled"
		}
	});
	return localground.models.Audio;
});
