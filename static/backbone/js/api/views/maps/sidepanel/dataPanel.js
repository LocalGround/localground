define(["backbone",
		"core",
		"text!" + templateDir + "/sidepanel/dataPanelHeader.html",
		"views/maps/sidepanel/projectsMenu",
		"views/maps/sidepanel/items",
		"lib/maps/managers/workspaceManager"],
	   function(Backbone, CORE, dataPanelHeader) {
	/**
	 * A class that handles display and rendering of the
	 * data panel and projects menu
	 * @class DataPanel
	 */
	localground.maps.views.DataPanel = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.DataPanel#
		 */
		el: '#panels',
		template: _.template( dataPanelHeader ),
		events: {
			'click #save_workspace': 'saveWorkspace'
		},
		
		/**
		 * Initializes the dataPanel
		 * @param {Object} sb
		 * The sandbox.
		 */
		initialize: function(sb, haltInitialization) {
			//alert(haltInitialization);
			console.log("dataPanel is initializing");
			this.sb = sb;
			this.render();
			
			// asynchronously register new modules:
			sb.loadSubmodule(
				"projects-menu",
				localground.maps.views.ProjectsMenu,
				{ el: this.$el.find('.projects-menu') }
			);
			
			// Listen for the "new_collection" event. On each new
			// collection event add a new ItemsView to the DataPanel.
			sb.listen({ 
                "new-collection-created": this.createItemsView,
				"window-resized": this.resize
			});
			
		},
		
		createItemsView: function(data){
			var $container = $("<div></div>");
			this.$el.find('.pane-body').append($container);
			this.sb.loadSubmodule(
						"items-" + data.collection.key, 
						localground.maps.views.Items,
						{
							collection: data.collection,
							el: $container
						}
					);
			//todo: register this module too:
			//var items = new localground.maps.views.Items(sb, {
			//	collection: collection,
			//});
			//this.$el.find('.pane-body').append(items.render().$el);
		},
		
		/**
		 * render projects menu if it doesn't currently exist
		 
		renderProjectsMenu: function(){
			if (this.$el.find('.projects-menu').get(0) == null) {
				this.$el.empty().append(this.template());
				//this.projectsMenu.render();
			}	
		},*/
		
		/**
		 * Renders the HTML for the data panel. Called everytime
		 * project data changes. Note that the project panel is
		 * only rendered once.
		 */
		render: function() {
			this.$el.empty().append(this.template());
			this.resize();
			return this;
		},
		
		destroy: function(){
			alert("todo: implement");
		},
		
		resize: function(){
			this.$el.find('.pane-body').height($('body').height() - 140);
		},
		
		saveWorkspace: function(){
			this.workspaceManager.saveWorkspace();
		}
	});
	return localground.maps.views.DataPanel;
});
