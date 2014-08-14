define(
	[
		"views/maps/sidepanel/dataPanel",
		"views/maps/basemap",
		"lib/map/data/dataManager"
		
	], function(DataPanel, BasemapView, DataManager) {
	var MapEditor = Backbone.View.extend({
		el: "#panels",
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
				defaultLocation: opts.defaultLocation,
				searchControl: true,
				geolocationControl: false,
				activeMapTypeID: opts.activeMapTypeID,
				overlays: opts.overlays 
			});
			
			this.dataManager = new localground.map.data.DataManager();
			
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
			//console.log("update panel triggered");
			this.dataPanel.render();
		}
	});
	return MapEditor;
});
