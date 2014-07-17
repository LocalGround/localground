define(["lib/external/backbone-min",
		"views/projectsMenu",
		"text!templates/dataPanelHeader.html"],
	   function(Backbone, ProjectsMenu, dataPanelHeader) {
	var DataPanelView = Backbone.View.extend({
		template: _.template( dataPanelHeader ),
		collections: {},
		initialize: function(){
			v = new ProjectsMenu({
				dataManager: this
			});
		},
		render: function() {
			this.$el.empty().append(this.template());
			this.$el.find('#projectsMenu').append(v.render().el);
			return this;
		},
		updateCollection: function(key, models) {
			//this.collections[key]
		},
		getCollection: function(key) {
			return this.collections[key];
		}
	});
	return DataPanelView;
});
