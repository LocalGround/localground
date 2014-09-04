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
		createSchema: null,
		updateSchema: null,
		hiddenFields: [
			"geometry",
			"overlay_type",
			"project_id",
			"url",
			"num",
			"manually_reviewed"
		],
		dataTypes: {
			'string': 'Text',
			'float': 'Number',
			'integer': 'Number',
			'boolean': 'Checkbox',
			'geojson': 'TextArea'
		},
		initialize: function(data, opts){
			opts = opts || {};
			this.createSchema = this._generateSchema(opts.createMetadata, true);
			this.updateSchema = this._generateSchema(opts.updateMetadata, true);
		},
		toJSON: function(){
			// ensure that the geometry object is serialized before it
			// gets sent to the server:
			var json = Backbone.Model.prototype.toJSON.call(this);
			if(json.geometry != null)
				json.geometry = JSON.stringify(json.geometry);
			return json;
		},
		toTemplateJSON: function(){
			var json = Backbone.Model.prototype.toJSON.call(this);
			return json
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
		fetchCreateMetadata: function(){
			var that = this;
			if (this.urlRoot == null) {
				this.urlRoot = this.collection.url;
			}
			$.ajax({
				url: this.urlRoot + '.json',
				type: 'OPTIONS',
				data: { _method: 'OPTIONS' },
				success: function(data) {
					that.createMetadata = data.actions['POST'];
				}
			});	
		},
		fetchUpdateMetadata: function(){
			var that = this;
			if (this.urlRoot == null) {
				this.urlRoot = this.collection.url;
			}
			$.ajax({
				url: this.urlRoot + this.id + '/.json',
				type: 'OPTIONS',
				data: { _method: 'OPTIONS' },
				success: function(data) {
					that.updateMetadata = data.actions['POST'];
				}
			});
		},
		
		_generateSchema: function(metadata, edit_only) {
			if(metadata == null) {
				return null;
			}
			var schema = {};
			//https://github.com/powmedia/backbone-forms#schema-definition
			for (key in metadata) {
				var val = metadata[key];
				if (this.hiddenFields.indexOf(key) == -1 ) {
					if (!edit_only || !val.read_only) {
						schema[key] = {
							type: this.dataTypes[val.type] || 'Text',
							title: val.label || key,
							help: val.help_text
						};
					}
				}
			}
			return schema;
		}
	});
	return localground.models.Base;
});
