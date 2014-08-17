define(["models/base"], function() {
	/**
	 * A Backbone Model class for the Photo datatype.
	 * @class Photo
	 * @see <a href="http://localground.org/api/0/photos/">http://localground.org/api/0/photos/</a>
	 */
	localground.models.Photo = localground.models.Base.extend({
		getNamePlural: function(){
			return "photos";	
		},
		defaults: {
			name: "Untitled"
		}
	});
	return localground.models.Photo;
});
