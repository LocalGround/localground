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
	initialize: function(opts){
		this.el = opts.el;
		this.template = _.template(opts.template, { panels: this.panels });
		this.render();
	},
	render: function(){
		this.$el.html(this.template);
		//opts.$element.html(this.template);
		//$(".fa-folder-open").trigger("click");
	}
});
