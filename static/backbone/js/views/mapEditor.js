define(
	[
		"views/sidepanel/dataPanel",
		"views/basemap",
		"lib/utils/dataManager"
		
	], function(DataPanel, BasemapView, DataManager) {
	var MapEditor = Backbone.View.extend({
		el: "#panels",
		overlays: null,
		activeMapTypeID: null,
		defaultLocation: null,
		basemap: null,
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
			
			this.basemap = new BasemapView({
				mapContainerID: "map_canvas",
				defaultLocation: this.defaultLocation,
				searchControl: true,
				geolocationControl: false,
				activeMapTypeID: this.activeMapTypeID,
				overlays: this.overlays 
			});
			
			this.dataManager = new DataManager();
			
			this.dataPanel = new DataPanel({
				dataManager: this.dataManager,
				map: this.basemap.map
			});
			this.$el.append(this.dataPanel.render().el);
			
			//listen for projects being added or removed:
			this.dataManager.selectedProjects.on('add', this.updatePanel, this);
			this.dataManager.selectedProjects.on('remove', this.updatePanel, this);
		},
		updatePanel: function(){
			console.log("update panel triggered");
			this.dataPanel.render();
		}
	});
	return MapEditor;
});
