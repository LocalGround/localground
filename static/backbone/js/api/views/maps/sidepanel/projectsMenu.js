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
                'click .cb-project': 'toggleCheckbox',
                'click .project-item': 'triggerToggleCheckbox'
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
                this.listenTo(this.app.vent, 'toggle-project', this.toggleProject);
                this.app.vent.trigger('load-projects', this.collection);
            },

            //TODO: Need to not just load all projects immediately, probably
            onAddChild: function (childView) {
                var project = childView.model;
                this.app.vent.trigger('project-requested', {id: project.get('id')});
            },
            /**
             * Catches the div click event and ignores it
             * @param {Event} e
             */
            toggleCheckbox: function (e) {
                var input = $(e.target).find('input').addBack().filter('input');
                var checked = input.is(':checked'),
                    projectId = input.val();
                this.app.vent.trigger('toggle-project', projectId, checked);

                e.stopPropagation();
            },
            triggerToggleCheckbox: function (e) {
                var $cb = $(e.target).find('input');
                if ($cb.css('visibility') !== 'hidden') {
                    $cb.attr('checked', !$cb.is(':checked'));
                    this.toggleCheckbox(e);
                }
            },

            toggleProject: function (projectId, visible) {
                var project = this.collection.get(projectId);
                if (project) {
                    project.set('isVisible', visible);
                }
                this.collection.trigger('selected-projects-change');

            }
        });
        return ProjectsMenu;
    });
