define(["marionette",
        "underscore",
        "jquery",
        "views/maps/sidepanel/filter",
        "text!" + templateDir + "/sidepanel/layerPanelHeader.html",
        "views/maps/sidepanel/menus/layersMenu",
        "views/maps/sidepanel/layerList"
    ],
    function (Marionette, _, $, DataFilter, LayerPanelHeader, LayersMenu, LayerList) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class LayerPanel
         */
        var LayerPanel = Marionette.LayoutView.extend({
            /**
             * @lends localground.maps.views.DataPanel#
             */
            template: function () {
                return _.template(LayerPanelHeader);
            },
            regions: {
                layerList: "#layer-manager",
                dataFilter: "#data-filter",
                layersMenu: "#layers-menu"
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.app.vent.on("adjust-layout", this.resize.bind(this));
            },
            onShow: function () {
                this.layerList.show(new LayerList(this.opts));
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
