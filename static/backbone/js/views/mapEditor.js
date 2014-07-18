define(
	[
		"views/dataPanel",
		"views/basemap",
		"lib/utils/dataManager"
		
	], function(DataPanel, BasemapView, DataManager) {
	var MapEditor = Backbone.View.extend({
		el: "#panels",
		overlays: null,
		activeMapTypeID: null,
		defaultLocation: null,
		dataManager: null,
		dataPanel: null,
		initialize: function(opts) {
			$.extend(this, opts);
			
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
			
			this.dataManager = new DataManager();
			
			this.dataPanel = new DataPanel({
				dataManager: this.dataManager
			});
			this.$el.append(this.dataPanel.render().el);
			this.dataManager.projects.on('change', this.updatePanel, this);
		},
		updatePanel: function(){
			//alert("update panel triggered");
			this.dataPanel.render();
		}
	});
	return MapEditor;
});
