define(["backbone", "lib/maps/geometry/point"],
	   function(Backbone) {
	/**
	 * An "abstract" Backbone Model; the root of all of the other
	 * localground.model.* classes. Has some helper methods that help
	 * the various models create forms to update models.
	 * @class Base
	 */
	localground.models.Base = Backbone.Model.extend({
		getNamePlural: function(){
			return this.get("overlay_type");	
		},
		urlRoot: null, /* /api/0/forms/<form_id>/fields/.json */
		updateSchema: null,
		createSchema: null,
		dataTypes: {
			'string': 'Text',
			'float': 'Number',
			'integer': 'Number',
			'boolean': 'Checkbox',
			'geojson': 'TextArea'
		},
		initialize: function(opts){
			opts = opts || {};
			$.extend(this, opts);
		},
		getKey: function(){
			return this.collection.key;
		},
		getCenter: function(){
			var geoJSON = this.get("geometry");
			if (geoJSON == null) { return null; }
			var point = new localground.maps.geometry.Point();
			return point.getGoogleLatLng(geoJSON);
		},
		fetchSchemas: function(){
			if (this.updateSchema != null || this.createSchema != null) {
				this.trigger('schemaLoaded');
				return;
			}
			//https://github.com/powmedia/backbone-forms#schema-definition
			if (this.urlRoot == null) {
				this.urlRoot = this.collection.url + this.id + "/";
			}
			var that = this;
			$.ajax({
				url: this.urlRoot + '.json',
				type: 'OPTIONS',
				data: { _method: 'OPTIONS' },
				success: function(data) {
					that.updateSchema = {};
					that.createSchema = {};
					that.populateSchema(
							data.actions['PUT'],
							that.updateSchema);
					that.populateSchema(
							data.actions['POST'],
							that.createSchema);
					that.trigger('schemaLoaded');	
				}
			});
		},
		populateSchema: function(opts, schema) {
			if(opts == null) {
				schema = {};
				return;
			}
			for (key in opts) {
				var val = opts[key];
				if (!val.read_only && key != 'geometry') {
					schema[key] = {
						type: this.dataTypes[val.type] || 'Text',
						title: val.label || key,
						help: val.help_text
					};
				}
			}
		}
	});
	return localground.models.Base;
});
