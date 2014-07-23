define(["lib/external/backbone-min"], function(Backbone) {
	var Record = Backbone.Model.extend({
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
		}
	});
	return Record;
});
