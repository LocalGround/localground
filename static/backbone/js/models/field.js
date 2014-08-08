define(["models/base", "collections/dataTypes"],
	   function(Base, DataTypes) {
	var Field = Base.extend({
		urlRoot: null, /* /api/0/forms/<form_id>/fields/.json */
		schema: {
			data_type: { type: 'Select', options: new DataTypes() }
		},
		initialize: function(opts){
			Field.__super__.initialize.apply(this, arguments);
			this.fetchSchemaOpts();
		}
	});
	return Field;
});
