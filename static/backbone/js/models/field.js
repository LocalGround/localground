define(["lib/external/backbone-min", "form", "collections/dataTypes"],
	   function(Backbone, Form, DataTypes) {
	var Field = Backbone.Model.extend({
		urlRoot: null,
		schema1: {
			title:      { type: 'Select', options: ['Mr', 'Mrs', 'Ms'] },
			name:       'Text',
			email:      { validators: ['required', 'email'] },
			birthday:   'Date',
			password:   'Password',
		},
		schema: {
			data_type: { type: 'Select', options: new DataTypes() }
		},
		formTypes: {
			'string': 'Text',
			'float': 'Number',
			'integer': 'Number',
			'boolean': 'Checkbox',
			'geojson': 'TextArea'
		},
		initialize: function(opts){
			opts = opts || {};
			$.extend(this, opts)
			if (this.urlRoot == null) {
				alert("opts.urlRoot cannot be null");
			}
		},
		fetchSchema: function(){
			//https://github.com/powmedia/backbone-forms#schema-definition
			var that = this;
			$.ajax({
				url: this.urlRoot + '.json',
				type: 'OPTIONS',
				data: { _method: 'OPTIONS' },
				success: function(data) {
					for (key in data.actions['POST']) {
						var val = data.actions['POST'][key];
						if (!val.read_only  && that.formTypes[val.type]) {
							that.schema[key] = {
								type: that.formTypes[val.type],
								title: val.label,
								help: val.help_text
							};
							//alert(JSON.stringify(val));
						}
					}
					alert(JSON.stringify(that.schema));
					//that.reset();
					var form = new Backbone.Form({
						model: that
					}).render();
					
					$('body').append(form.el);
				}
			});
		}
	});
	return Field;
});
