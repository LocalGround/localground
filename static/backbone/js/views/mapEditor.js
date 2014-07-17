define(
	[
		"views/dataPanel",
		"views/basemap"
	], function(DataPanelView, BasemapView) {
	var MapEditor = Backbone.View.extend({
		el: "#panels",
		overlays: null,
		activeMapTypeID: null,
		defaultLocation: null,
		initialize: function(opts) {
			$.extend(this, opts);
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
			
			var basemap = new BasemapView({
				mapContainerID: "map_canvas",
				defaultLocation: this.defaultLocation,
				searchControl: true,
				geolocationControl: false,
				activeMapTypeID: this.activeMapTypeID,
				overlays: this.overlays 
			});
			
			var v = new DataPanelView();
			this.$el.append(v.render().el);
			//v.loadProjectData(1);
		}
	});
	return MapEditor;
});
