define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/sidepanel/projectTag.html"],
    function (Marionette, _, $, projectTagTemplate) {
        'use strict';
        /**
         * Class that controls the available projects tags,
         * Extends Backbone.View.
         * @class ProjectTags
         */
        var ProjectTags = Marionette.CollectionView.extend({
            /**
             * @lends localground.maps.views.ProjectTags#
             */
            events: {
                'click .fa-close': 'removeProject',
                'click .alert': 'makeActive'
            },
            childView: Marionette.ItemView.extend({
                template: _.template(projectTagTemplate),
                tagName: "span",
                modelEvents: {'change': 'render'}
            }),
            onBeforeAddChild: function () {
                if (!this.activeProject) {
                    if (this.collection.length > 0) {
                        this.collection.first().set('isActive', true);
                        this.activeProject = this.collection.first();
                        this.app.setActiveProjectID(this.collection.first().get('id'));
                    }
                }
            },
            /**
             * Initializes the project tags menu (an easy way to remove projects
             * and set them to be active)
             */
            initialize: function (opts) {
                this.collection = opts.projects;
                this.app = opts.app;
                this.listenTo(this.collection, 'selected-projects-change', this.checkActive);
               // opts.app.vent.on('selected-projects-updated', this.renderProjects);
                //this.render();
            },

            /** A rendered projectItem template */
            /*
            render: function () {
                if (!this._projects) {
                    return;
                }
                var that = this;
                this.$el.empty();
                this._projects.each(function (model) {
                    var opts = model.toJSON();
                    opts.isActive = (model.id == that.sb.getActiveProjectID());
                    that.$el.append($(that.template(opts)));
                });
            },*/
            /*
            renderProjects: function (data) {
                if (data && data.projects) {
                    this._projects = data.projects;
                }
                this.render();
            },
            */

            setActiveProject: function (newActiveProject) {
                if (newActiveProject) {
                    if (this.activeProject) {
                        this.activeProject.set('isActive', false);
                    }
                    newActiveProject.set('isActive', true);
                    this.activeProject = newActiveProject;
                    this.app.setActiveProjectID(newActiveProject.get('id'));
                } else {
                    this.activeProject = null;
                    this.app.setActiveProjectID(null);
                }
            },

            makeActive: function (e) {
                this.setActiveProject(this.collection.get($(e.currentTarget).find("input").val()));
                e.stopPropagation();
            },

            checkActive: function () {
                if (!this.activeProject || !this.activeProject.get('isVisible')) {
                    if (this.activeProject) {
                        this.activeProject.set('isActive', false);
                    }
                    this.setActiveProject(this.collection.findWhere({isVisible: true}));
                }
            }

        });
        return ProjectTags;
    });
