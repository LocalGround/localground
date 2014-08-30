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
			'click #mode_toggle': 'toggleEditMode'
		},
		
		/**
		 * Initializes the dataPanel
		 * @param {Object} sb
		 * The sandbox.
		 */
		initialize: function(sb, haltInitialization) {
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
		},
		
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
		
		toggleEditMode: function(){
			if(this.sb.getMode() == "view") {
				this.sb.setMode("edit");
				this.sb.notify({ type: "make-editable" });
				this.$el.find('#mode_toggle').addClass('btn-info');
			}
			else {
				this.sb.setMode("view");
				this.sb.notify({ type: "make-viewable" });
				this.$el.find('#mode_toggle').removeClass('btn-info');	
			}
		},
		
		destroy: function(){
			this.remove();
		},
		
		resize: function(){
			this.$el.find('.pane-body').height($('body').height() - 140);
		}
	});
	return localground.maps.views.DataPanel;
});
