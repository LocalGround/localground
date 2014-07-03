var RightPanel = Backbone.View.extend({
	panels: [
		{
			id: "data",
			icon: "fa-folder-open",
			name: "Data & Media"
		},
		{
			id: "symbols",
			icon: "fa-map-marker",
			name: "Symbols"
		},
		{
			id: "presentations",
			icon: "fa-bars",
			name: "Presentations"
		},
		{
			id: "downloads",
			icon: "fa-download",
			name: "Downloads"
		}
	],
	render: function(opts){
		var template = _.template(opts.template, { panels: this.panels });
		this.$el.html(template);
		opts.$element.html(template);
		//$(".fa-folder-open").trigger("click");
	}
});
