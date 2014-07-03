var TopNavigation = Backbone.View.extend({
	render: function(opts){
		var template = _.template(opts.template);
		this.$el.html(template);
		opts.$element.html(template);
	}
});