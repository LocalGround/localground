var TopNavigation = Backbone.View.extend({
	initialize: function(opts){
		this.el = opts.el;
		this.template = opts.template;
		this.render();
	},
	render: function(){
		var template = _.template(this.template);
		this.$el.html(template);
	}
});