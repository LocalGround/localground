define(["marionette",
        "text!" + templateDir + "/sidepanel/projectItem.html",
        "underscore",
        "jquery"
    ],
    function (Marionette, projectItem, _, $) {
        'use strict';
        /**
         * Class that controls the available projects menu,
         * Extends Backbone.View.
         * @class ProjectsMenu
         */
        var ProjectsMenu = Marionette.CollectionView.extend({
            /**
             * @lends localground.maps.views.ProjectsMenu#
             */
            events: {
                'click .project-item': 'toggleVisible'
            },
            childViewOptions: {
                template: _.template(projectItem)
            },
            childView: Marionette.ItemView.extend({
                template: _.template(projectItem),
                modelEvents: {'change': 'render'}
            }),
            /**
             * Initializes the project menu and fetches the available
             * projects from the Local Ground Data API.
             * @see <a href="http://localground.org/api/0/projects">http://localground.org/api/0/projects</a>.
             * @param {Object} opts
             * Dictionary of initialization options
             * @param {Object} opts.el
             * The jQuery element to which the projects should be attached.
             */
            initialize: function (opts) {
                //this.setElement(opts.el);
                this.app = opts.app;
                this.collection = opts.projects;
                this.childViewOptions.app = this.app;
                //this.app.vent.on('selected-projects-updated', this.syncCheckboxes.bind(this));
                this.app.vent.trigger('load-projects', this.collection);
            },

            //TODO: Need to not just load all projects immediately, probably
            onAddChild: function (childView) {
                var project = childView.model;
                this.app.vent.trigger('project-requested', {id: project.get('id')});
            },
            /*
            syncCheckboxes: function (data) {
                this.collection.each(function (project) {
                    if (data.projects.get(project.id)) {
                        project.trigger("check-item");
                    } else {
                        project.trigger("uncheck-item");
                    }
                });
            },
            */
            /**
             * Catches the div click event and ignores it
             * @param {Event} e
             */
            toggleVisible: function (e) {
                var project = this.collection.get($(e.target).find('input').val());
                if (project) {
                    project.set('isVisible', !project.get('isVisible'));
                }
                this.collection.trigger('selected-projects-change');
                e.stopPropagation();
            }
        });
        return ProjectsMenu;
    });
