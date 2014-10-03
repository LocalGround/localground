this.urlRoot
define(["models/base"], function() {
	/**
	 * A Backbone Model class for the marker association datatype.
	 * @class Association
	 * @see <a href="http://localground.org/api/0/markers/">http://localground.org/api/0/markers/</a>
	 */
	localground.models.Association = localground.models.Base.extend({
		initialize: function(data, opts){
			localground.models.Base.prototype.initialize.apply(this, arguments);
            
            //todo: API change needed to make the model.id param not "id" but object_id.
            this.urlRoot = '/api/0/markers/' + data.marker_id + '/' + data.model_type + 
                                '/' + data.model_id + '/';
            alert(this.urlRoot);
		}
	});
	return localground.models.Association;
});
