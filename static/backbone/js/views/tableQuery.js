define([
		"lib/external/backbone-min"
	], function(Backbone) {
	var TableQuery = Backbone.View.extend({
		el: "#panel",
		vent: null,
		events: {
			'click .query': 'triggerQuery'
		},
		initialize: function(opts) {
			opts = opts || {};
			$.extend(this, opts);
		},
			
		triggerQuery: function(e){
			var sql = this.$el.find('textarea').val();
			this.vent.trigger("requery", sql);
			e.preventDefault();	
		}
	});
	return TableQuery;
});