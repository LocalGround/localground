define([
		"backbone",
		"text!" + templateDir + "/sidepanel/projectItem.html",
		"views/maps/sidepanel/item"
		],
	   function(Backbone, projectItem) {
    /** 
     * Class that controls the available projects menu,
     * Extends Backbone.View.
     * @class ProjectsMenu
     */
	localground.maps.views.ProjectsMenu = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.ProjectsMenu#
		 */

		projects: null,
		/**
		 * Initializes the project menu and fetches the available
		 * projects from the Local Ground Data API.
		 * @see <a href="http://localground.org/api/0/projects">http://localground.org/api/0/projects</a>.
		 * @param {Object} opts
		 * Dictionary of initialization options
		 * @param {Object} opts.el
		 * The jQuery element to which the projects should be attached.
		*/
        initialize: function(sb, opts) {
			this.setElement(opts.el)
			this.sb = sb;
			sb.notify({
				type : "load-projects"
			});
			sb.listen({ 
                "projects-loaded": this.renderProjects,
                "selected-projects-updated": this.syncCheckboxes
			});
        },
		/** A rendered projectItem template */
		template: _.template(projectItem),
		events: {
			'click div': 'stopPropagation'
		},
		renderProjects: function(data){
			this.projects = data.projects;
			this.render();
		},
		/**
		 * Renders the project Menu
		 * @method
		 * @returns {Object}
		 * Returns a reference to the projectMenu HTML element
		*/
		render: function() {
			this.$el.empty();
			if (!this.projects) { return; }
			this.projects.each(function(item) {
				this.renderProject(item);
			}, this);
			this.delegateEvents();
		},
		/**
		 * Renders each individual project listing
		 * @method
		 * @param {Object} item
		 * A Backbone Project model
		 * @returns {Object}
		 * Returns a reference to the list item HTML element
		*/
		renderProject: function(item) {
			//this.$el.append("a");
			//return;
			var $container = $("<div></div>");
			this.$el.append($container);
			this.sb.loadSubmodule(
				"item-project-" + item.id, localground.maps.views.Item,
				{
					model: item,
					template: _.template( projectItem ),
					el: $container
				}
			);
		},
		
		syncCheckboxes: function(data){
			this.projects.each(function(project){
				if(data.projects.get(project.id) != null)
					project.trigger("check-item");	
				else
					project.trigger("uncheck-item");
			});
		},
		/**
		 * Catches the div click event and ignores it
		 * @param {Event} e
		 */
		stopPropagation: function(e) {
			e.stopPropagation();	
		},
		
		destroy: function(){
			this.remove();
		},

    });
    return localground.maps.views.ProjectsMenu;
});
