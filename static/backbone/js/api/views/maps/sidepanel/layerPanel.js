define(["marionette",
        "underscore",
        "jquery",
        "views/maps/sidepanel/filter",
        "views/maps/sidepanel/items/layerItem",
        "text!" + templateDir + "/sidepanel/layerPanelHeader.html",
        "views/maps/sidepanel/menus/layersMenu"
    ],
    function (Marionette, _, $, DataFilter, LayerItem, LayerPanelHeader, LayersMenu) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var LayerPanel = Marionette.LayoutView.extend({
            /**
             * @lends localground.maps.views.DataPanel#
             */
            template: function () {
                return _.template(LayerPanelHeader);
            },
            regions: {
                layer: "#layer-manager",
                dataFilter: "#data-filter",
                layersMenu: "#layers-menu"
            },
            /**
             * Initializes the dataPanel
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.app.vent.on("adjust-layout", this.resize.bind(this));
                this.app.vent.on("add-layer", this.addLayerEntry.bind(this));
                this.app.vent.on("remove-layer", this.removeLayerEntry.bind(this));
            },
            addLayerEntry: function (data) {
                var model = data.layer,
                    selector = "layer_panel_" + model.id;
                this.$el.find('#layer-manager').append($('<div id="' + selector + '"></div>'));
                this.addRegion(selector, '#' + selector);
                this[selector].show(new LayerItem({
                    model: model,
                    app: this.app
                }));
            },
            removeLayerEntry: function (data) {
                var model = data.layer,
                    selector = "layer_panel_" + model.id;
                // turn off the map overlays also:
                this.app.vent.trigger("hide-layer", {
                    layerItem: this[selector].currentView
                });
                this.removeRegion(selector);
            },
            onShow: function () {
                this.dataFilter.show(new DataFilter(this.opts));
                this.layersMenu.show(new LayersMenu(this.opts));
                this.resize();
            },

            destroy: function () {
                this.remove();
            },

            resize: function () {
                this.$el.find('.pane-body').height($('body').height() - 140);
            }
        });
        return LayerPanel;
    });
