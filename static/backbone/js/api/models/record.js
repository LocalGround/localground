define(["models/base"], function() {
	/**
	 * A Backbone Model class for the Project datatype.
	 * @class Project
	 * @see <a href="http://localground.org/api/0/projects/">http://localground.org/api/0/projects/</a>
	 */
	localground.models.Record = localground.models.Base.extend({
		defaults: {
			name: ""
		},
		initialize: function () {
			Backbone.Model.prototype.initialize.apply(this, arguments);
			
			this.on("change", function (model, options) {
				if (options && options.save === false){ return; }
				model.save();
			});
		},
		url: function() {
			/*
			Terrible hack to accomodate the Django REST Framework. Before the
			browser issues a POST, PUT, or PATCH request, it first issues an
			OPTIONS request to ensure that the request is legal. For some reason,
			the Local Ground produces an error for this OPTIONS request if a
			'/.json' footer isn't attached to the end. Hence this function overrides
			the based url() function in backbone
			*/
			var base =
				_.result(this, 'urlRoot') ||
				 _.result(this.collection, 'url') ||
				urlError();
			if (this.isNew()) return base + '.json';
			return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id) + '/.json';
		}
	});
	return localground.models.Record;
});
