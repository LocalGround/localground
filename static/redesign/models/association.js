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
            console.log(data.overlay_type);
            //todo: API change needed to make the model.id param not "id" but object_id.
			if (data.overlay_type == "marker") {
	            this.urlRoot = '/api/0/markers/' + data.source_id + '/' + data.model_type + '/';
			} else if (data.overlay_type.indexOf("form_") != -1) {
                //http://localhost:7777/api/0/forms/1/data/1/photos/
                this.urlRoot = '/api/0/forms/' + data.form_id + '/data/' + data.record_id + "/" + data.model_type + '/';
			}
			this.set("ordering", data.ordering || 1);
		}
	});
	return Association;
});
