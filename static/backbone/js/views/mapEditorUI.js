define(
	[
		"views/dataPanelView"
	], function(DataPanelView) {
	var MapEditor = Backbone.View.extend({
		el: "#panels",
		initialize: function(items) {
			//this.projects = new Projects();
			//this.projects.fetch({ reset: true });
			//this.loadProjectData();
			
			/*this.panelManager = new PanelManagerView([
				'data',
				'symbols',
				'presentations',
				'downloads'
			]);
			*/
			var v = new DataPanelView();
			this.$el.append(v.render().el);
			v.loadProjectData(307);
		}
	});
	return MapEditor;
});
