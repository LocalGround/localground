define(["lib/external/backbone-min"],
	   function(Backbone) {
	var Base = Backbone.Model.extend({
		urlRoot: null, /* /api/0/forms/<form_id>/fields/.json */
		schema: {},
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
		fetchSchemaOpts: function(){
			//https://github.com/powmedia/backbone-forms#schema-definition
			if (this.urlRoot == null) {
				alert("opts.urlRoot cannot be null");
				return;
			}
			var that = this;
			$.ajax({
				url: this.urlRoot + '.json',
				type: 'OPTIONS',
				data: { _method: 'OPTIONS' },
				success: function(data) {
					that.generateFormSchema(data.actions['POST']);
				}
			});
		},
		generateFormSchema: function(opts) {
			for (key in opts) {
				var val = opts[key];
				if (!val.read_only  && this.dataTypes[val.type]) {
					this.schema[key] = {
						type: this.dataTypes[val.type],
						title: val.label,
						help: val.help_text
					};
				}
			}
			this.trigger('schemaLoaded');	
		}
	});
	return Base;
});
