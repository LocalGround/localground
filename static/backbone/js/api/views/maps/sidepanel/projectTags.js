define([
		"backbone"
		],
	   function(Backbone) {
    /** 
     * Class that controls the available projects tags,
     * Extends Backbone.View.
     * @class ProjectTags
     */
	localground.maps.views.ProjectTags = Backbone.View.extend({
		/**
		 * @lends localground.maps.views.ProjectTags#
		 */
        _projects: null,
		events: {
			'click .fa-close': 'removeProject'
		},
		/**
		 * Initializes the project tags menu (an easy way to remove projects
		 * and set them to be active)
		*/
        initialize: function(sb, opts) {
			this.setElement(opts.el);
			this.sb = sb;
			sb.listen({ 
                "selected-projects-updated": this.renderProjects
			});
            this.render();
        },
		/** A rendered projectItem template */
		template: _.template('<div class="alert alert-info alert-dismissable">' + 
                    '<button type="button" value="<%= id %>" class="fa fa-close" data-dismiss="alert" aria-hidden="true"></button>' + 
                    '<strong><%= name %></strong>' + 
                    '</div>'),

		render: function(){
            if (this._projects == null) { return; }
            var that = this;
            this.$el.empty();
            this._projects.each(function(model){
                that.$el.append($(that.template(model.toJSON())));	
			});
		},
        
        renderProjects: function(data){
            this._projects = data.projects;
            this.render();
        },
        
        removeProject: function(e){
            var $button = $(e.currentTarget);
            var projectID = $button.val();
            alert("Need to uncheck the project list box also");
            this.sb.notify({
                type: "project-removal-requested",
                data: { id: projectID }
            });
        },
		
		destroy: function(){
			this.remove();
		},

    });
    return localground.maps.views.ProjectTags;
});
