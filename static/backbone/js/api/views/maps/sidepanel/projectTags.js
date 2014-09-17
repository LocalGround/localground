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
			'click .fa-close': 'removeProject',
            'click .alert': 'setActive'
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
		template: _.template('<div class="alert alert-info alert-dismissable' +
                    '<% if(isActive) { %> active <% } %>' +     
                    '">' + 
                    '<input type="hidden" value="<%= id %>" />' + 
                    '<i class="fa fa-close pull-right"></i>' + 
                    '<strong><%= name %></strong>' + 
                    '</div>'),

		render: function(){
            if (this._projects == null) { return; }
            var that = this;
            this.$el.empty();
            this._projects.each(function(model){
                var opts = model.toJSON();
                opts.isActive = (model.id == that.sb.getActiveProjectID());
                that.$el.append($(that.template(opts)));	
			});
		},
        
        renderProjects: function(data){
            if (data && data.projects) {
                this._projects = data.projects;
            }
            this.render();
        },
        
        removeProject: function(e){
            var projectID = $(e.currentTarget).parent().find("input").val();
            this.sb.notify({
                type: "project-removal-requested",
                data: { id: projectID }
            });
            e.stopPropagation();
        },
        
        setActive: function(e) {
            var projectID = $(e.currentTarget).find("input").val();
            this.sb.notify({
                type : "set-active-project",
                data : { id: projectID } 
            });
            this.render();
            e.stopPropagation();
        },
		
		destroy: function(){
			this.remove();
		},

    });
    return localground.maps.views.ProjectTags;
});
