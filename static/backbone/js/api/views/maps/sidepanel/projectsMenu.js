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
		
		/** A {@link localground.maps.data.DataManager} object */
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
                "projects-loaded": this.renderProjects
			});
        },
		/** A rendered projectItem template */
		template: _.template(projectItem),
		events: {
			'click .cb-project': 'toggleProjectData',
			'click div': 'stopPropagation',
			'click .project-item': 'triggerToggleProjectData'
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
		/**
		 * Catches the div click event and ignores it
		 * @param {Event} e
		 */
		stopPropagation: function(e) {
			e.stopPropagation();	
		},
		
		/**
		 * Triggers the checkbox event from a DIV click event
		 * @param {Event} e
		 */
		triggerToggleProjectData: function(e){
			var $cb = $(e.currentTarget).find('input');
			//I don't know why this has to be such a hack, but it is:
			$cb.attr('checked', !$cb.attr('checked'));
			$cb.trigger("click");
			$cb.attr('checked', !$cb.attr('checked'));
		},
		/**
		 * Control that adds / removes project data within the
		 * data manager
		 * @param {Event} e
		 */
		toggleProjectData: function(e) {
			var $cb = $(e.currentTarget);
			if ($cb.prop("checked")) {
				this.sb.notify({
					type : "project-requested",
					data: { id: $cb.val() }
				});
			}
			else {
				this.sb.notify({
					type : "project-removal-requested",
					data: { id: $cb.val() }
				});
			}
			e.stopPropagation();
		},
		destroy: function(){
			alert("todo: implement");
		}
    });
    return localground.maps.views.ProjectsMenu;
});
