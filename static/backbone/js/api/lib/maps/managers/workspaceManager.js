define([], function() {
	/**
	 * @class WorkspaceManager
	 */
	localground.maps.managers.WorkspaceManager = function(opts) {
		
		this.dataViews = opts.dataViews;
		this.dataManager = opts.dataManager;
		this.basemap = opts.basemap;
		
		this.serializeWorkspace = function(){
			alert(localStorage["workspace"]);
			var workspace = {
				project_ids: this.dataManager.getSelectedProjectIDs(),
				zoom: this.basemap.getZoom(),
				basemapID: this.basemap.getBasemapID(),
				center: [this.basemap.getCenter().lng(), this.basemap.getCenter().lat()],
				elements: {}
			};
			for(key in this.dataViews) {
				var view = this.dataViews[key];
				workspace.elements[key] = {
					isExpanded: view.isExpanded,
					isVisible: view.isVisible,
					visibleItems: view.getVisibleItemList()
				}
			}
			alert(JSON.stringify(workspace));
			localStorage["workspace"] = JSON.stringify(workspace);
		}
	};
	return localground.maps.managers.WorkspaceManager;
});
