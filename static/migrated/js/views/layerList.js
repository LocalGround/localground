var LayerList = Backbone.View.extend({
	render: function(opts){
		var template = _.template(opts.template);
		this.$el.html(template);
		alert(template);
		opts.$element.html(template);
		//$(".fa-folder-open").trigger("click");
	}
});
