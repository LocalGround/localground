define(["urlon"], function() {
	/**
	 * @class WorkspaceManager
	 */
	localground.maps.managers.WorkspaceManager = function(opts) {
		
		this.dataViews = opts.dataViews;
		this.dataManager = opts.dataManager;
		this.basemap = opts.basemap;
		this.eventManager = opts.eventManager;
		
		this.initialize = function(){
			var that = this;
			
			//events that should trigger the saveWorkspace method:
			var eventTypes = {
				SHOW_OVERLAY: "show_overlay",
				HIDE_OVERLAY: "hide_overlay",
				ZOOM_TO_OVERLAY: "zoom_to_overlay",
				ZOOM_TO_EXTENT: "zoom_to_extent",
				SHOW_ALL: "show_all",
				HIDE_ALL: "hide_all",
				EXPAND: "expand",
				CONTRACT: "contract"
			};
			for(key in eventTypes) {
				this.eventManager.on(eventTypes[key], function(){
					that.saveWorkspace();	
				});	
			}
		}
		
		this.saveWorkspace = function(){
			console.log("saveWorkspace");
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
			localStorage["workspace"] = JSON.stringify(workspace);
		}
		
		//Experimental. Not used yet.
		this.getWorkspaceFromURL = function(){
			try {
				var queryParam = decodeURIComponent(getUrlParameter("state"));
				alert(workspace_str);
				return URLON.parse(queryParam);
			}
			catch(e) {
				return null;
			}
		};
		
		//Experimental. Not used yet.
		this.getWorkspaceFromLocalStorage = function(){
			return JSON.parse(localStorage["workspace"]);
		};
		
		//Experimental. Not used yet.
		this.loadWorkspace = function(){
			var workspace = (this.getWorkspaceFromURL() ||
							this.getWorkspaceFromLocalStorage())
			if (workspace) {
				this.eventManager.trigger("restore_state", workspace);
			}
		};
		
		this.initialize();
	};
	return localground.maps.managers.WorkspaceManager;
});
