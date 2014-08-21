define([], function() {
	/**
	 * @class WorkspaceManager
	 */
	localground.maps.managers.WorkspaceManager = function(opts) {
		
		this.dataViews = opts.dataViews;
		this.dataManager = opts.dataManager;
		this.map = opts.map;
		
		this.serializeWorkspace = function(){
			alert(localStorage["workspace"]);
			var workspace = {
				project_ids: this.dataManager.getSelectedProjectIDs(),
				zoom: this.map.getZoom(),
				center: [this.map.getCenter().lng(), this.map.getCenter().lat()],
				elements: {}
			};
			for(key in this.dataViews) {
				var view = this.dataViews[key];
				workspace.elements[key] = {
					isExpanded: view.isVisible,
					isVisible: view.isExpanded,
					visibleItems: view.getVisibleItemList()
				}
			}
			alert(JSON.stringify(workspace));
			localStorage["workspace"] = JSON.stringify(workspace);
		}
	};
	return localground.maps.managers.WorkspaceManager;
});
