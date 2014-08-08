define(["models/base"], function(Base) {
	var Record = Base.extend({
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
		toJSON: function(){
			var json = Backbone.Model.prototype.toJSON.call(this);
			// ensure that the geometry object is serialized before it
			// gets sent to the server:
			//alert(JSON.stringify(json.geometry));
			if(json.geometry != null) {
				json.geometry = JSON.stringify(json.geometry);
			}
			return json;
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
	return Record;
});
