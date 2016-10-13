define(["models/base"], function (Base) {
	"use strict";
	/**
	 * A Backbone Model class for the marker association datatype.
	 * @class Association
	 * @see <a href="//localground.org/api/0/markers/">//localground.org/api/0/markers/</a>
	 */
	var Association = Base.extend({
		initialize: function (data, opts) {
			Base.prototype.initialize.apply(this, arguments);

            //todo: API change needed to make the model.id param not "id" but object_id.
            this.urlRoot = '/api/0/markers/' + data.marker_id + '/' + data.model_type + '/';
			this.set("ordering", data.ordering || 1);
		}
	});
	return Association;
});