define(
	[
		"views/dataPanel",
		"views/basemap"
	], function(DataPanelView, BasemapView) {
	var MapEditor = Backbone.View.extend({
		el: "#panels",
		defaultLocation: {
			center: new google.maps.LatLng(40.91351257612757, -123.4423828125),
			zoom: 14
		},
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
			
			var basemap = new BasemapView({
				mapContainerID: "map_canvas",
				defaultLocation: this.defaultLocation,
				searchControl: true,
				geolocationControl: true,
				activeMapTypeID: 1 //,
				//overlays: overlays
			});
			
			var v = new DataPanelView();
			this.$el.append(v.render().el);
			v.loadProjectData(9);
		}
	});
	return MapEditor;
});
