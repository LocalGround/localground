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
                this.app = opts.app;
                this.collection = opts.availableProjects;
                this.listenTo(this.collection, 'selected-projects-change', this.checkActive);
            },

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
            },

            removeProject: function (e) {
                var projectId = e.target.parentElement.getElementsByTagName('input')[0].value;
                this.app.vent.trigger('toggle-project', projectId, false);
            }

        });
        return ProjectTags;
    });
