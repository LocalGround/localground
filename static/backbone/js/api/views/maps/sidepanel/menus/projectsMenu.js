define(["marionette",
            "text!" + templateDir + "/sidepanel/menuItem.html",
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
                'click .cb-item': 'toggleCheckbox',
                'click .item': 'triggerToggleCheckbox'
            },
            childViewOptions: {
                template: _.template(projectItem)
            },
            childView: Marionette.ItemView.extend({
                template: _.template(projectItem),
                modelEvents: {'change': 'render'}
            }),
            id: 'projects-menu',
            /**
             * Initializes the project menu and fetches the available
             * projects from the Local Ground Data API.
             * @see <a href="//localground.org/api/0/projects">//localground.org/api/0/projects</a>.
             * @param {Object} opts
             * Dictionary of initialization options
             * @param {Object} opts.el
             * The jQuery element to which the projects should be attached.
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.collection = opts.availableProjects;
                this.childViewOptions.app = this.app;
                this.listenTo(this.app.vent, 'toggle-project', this.toggleProject);
                this.app.vent.trigger('load-projects', this.collection);
                this.restoreState();
            },

            onAddChild: function (childView) {
                var project = childView.model;
                if (this.state) {
                    if (_.contains(this.state.activeProjects, project.get('id'))) {
                        this.triggerToggleCheckbox({target: childView.el});
                    }
                }
            },
            /**
             * Catches the div click event and ignores it
             * @param {Event} e
             */
            toggleCheckbox: function (e) {
                var input = $(e.target).find('input').addBack().filter('input'),
                    checked = input.is(':checked'),
                    projectId = input.val();
                this.app.vent.trigger('toggle-project', projectId, checked);

                if (e.stopPropagation) {
                    e.stopPropagation();
                }
            },
            triggerToggleCheckbox: function (e) {
                var $cb = $(e.target).find('input');
                if ($cb.css('visibility') !== 'hidden') {
                    $cb.attr('checked', !$cb.is(':checked'));
                    this.toggleCheckbox(e);
                }
            },

            saveState: function () {
                this.app.saveState(
                    this.id,
                    {
                        activeProjects: _.chain(this.collection.toJSON())
                            .where({isVisible: true})
                            .pluck('id')
                            .value()
                    },
                    true
                );
            },

            restoreState: function () {
                this.state = this.app.restoreState(this.id);
            },

            toggleProject: function (projectId, visible) {
                var project = this.collection.get(projectId);
                if (project) {
                    project.set('isVisible', visible);
                }
                this.collection.trigger('selected-projects-change');
                this.collection.trigger('toggleProject', projectId, visible);
                this.saveState();
            },

            loadProjects: function (projectIds) {
                _.each(projectIds, function (id) {this.toggleProject(id, true); }.bind(this));
            }

        });
        return ProjectsMenu;
    });
