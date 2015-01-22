define(["marionette",
            "text!" + templateDir + "/sidepanel/menuItem.html",
        "underscore",
        "jquery",
        "collections/layers"
    ],
    function (Marionette, menuItem, _, $, Layers) {
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
                'click .cb-item': 'toggleCheckbox',
                'click .item': 'triggerToggleCheckbox'
            },
            childViewOptions: {
                template: _.template(menuItem),
                modelEvents: {'change': 'render'}
            },
            childView: Marionette.ItemView,
            id: 'layers-menu',

            initialize: function (opts) {
                this.app = opts.app;
                this.collection = new Layers();
                this.childViewOptions.app = this.app;
                this.collection.fetch();
                this.restoreState();
            },

            toggleCheckbox: function (e) {
                var input = $(e.target).find('input').addBack().filter('input'),
                    checked = input.is(':checked');
                this.toggleItem(input.val(), checked);

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

            toggleItem: function (id, visible) {
                var model = this.collection.get(id);
                model.set("isVisible", visible);
                if (visible) {
                    this.app.vent.trigger("add-layer", model);
                } else {
                    this.app.vent.trigger("remove-layer", model);
                }
                this.saveState();
            },

            onAddChild: function (childView) {
                var layer = childView.model;
                if (this.state) {
                    if (_.contains(this.state.activeLayers, layer.get('id'))) {
                        this.triggerToggleCheckbox({target: childView.el});
                    }
                }
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
