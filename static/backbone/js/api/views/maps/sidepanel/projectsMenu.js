define(["marionette",
        "text!" + templateDir + "/sidepanel/projectItem.html",
        "underscore",
        "views/maps/sidepanel/item",
        "collections/projects"

    ],
    function (Marionette, projectItem, _, Item, Projects) {
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
                'click div': 'stopPropagation'
            },
            childViewOptions: {
                template: _.template(projectItem)
            },
            childView: Item,
            collection: new Projects(),
            /**
             * Initializes the project menu and fetches the available
             * projects from the Local Ground Data API.
             * @see <a href="http://localground.org/api/0/projects">http://localground.org/api/0/projects</a>.
             * @param {Object} opts
             * Dictionary of initialization options
             * @param {Object} opts.el
             * The jQuery element to which the projects should be attached.
             */
            initialize: function (app) {
                //this.setElement(opts.el);
                this.app = app;
                this.childViewOptions.app = app;
                app.vent.on('selected-projects-updated', this.syncCheckboxes.bind(this));
                app.vent.trigger('load-projects', this.collection);
            },
            syncCheckboxes: function (data) {
                this.projects.each(function (project) {
                    if (data.projects.get(project.id)) {
                        project.trigger("check-item");
                    } else {
                        project.trigger("uncheck-item");
                    }
                });
            },
            /**
             * Catches the div click event and ignores it
             * @param {Event} e
             */
            stopPropagation: function (e) {
                e.stopPropagation();
            },

            destroy: function () {
                this.remove();
            }

        });
        return ProjectsMenu;
    });
