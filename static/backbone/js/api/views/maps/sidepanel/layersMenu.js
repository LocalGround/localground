define(["marionette",
            "text!" + templateDir + "/sidepanel/menuItem.html",
        "underscore",
        "jquery",
        "collections/layers"
    ],
    function (Marionette, projectItem, _, $, Layers) {
        'use strict';
        /**
         * Class that controls the available projects menu,
         * Extends Backbone.View.
         * @class LayersMenu
         */
        var LayersMenu = Marionette.CollectionView.extend({
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
            id: 'projects-menu',
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
                this.collection = new Layers();
                this.childViewOptions.app = this.app;
                this.collection.fetch({ reset: true });
                this.listenTo(this.app.vent, 'toggle-layer', this.toggleLayer);
                this.restoreState();
            },

            /**
             * Catches the div click event and ignores it
             * @param {Event} e
             */
            toggleCheckbox: function (e) {
                var input = $(e.target).find('input').addBack().filter('input'),
					checked = input.is(':checked'),
                    projectId = input.val();
                this.app.vent.trigger('toggle-layer', projectId, checked);

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

            toggleLayer: function (id, visible) {
                var model = this.collection.get(id);
                if (model) {
                    model.set('isVisible', visible);
                }
                this.saveState();
            },

			saveState: function () {
                this.app.saveState(
                    this.id,
                    {
                        activeLayers: _.chain(this.collection.toJSON())
                            .where({isVisible: true})
                            .pluck('id')
                            .value()
                    },
                    true
                );
            },

            restoreState: function () {
                this.state = this.app.restoreState(this.id);
            }
        });
        return LayersMenu;
    });
