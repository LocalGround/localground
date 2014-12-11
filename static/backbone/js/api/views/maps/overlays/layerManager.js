define(["backbone",
        "underscore",
        "views/maps/overlays/layer"
    ],
    function (Backbone, _, Layer) {
        'use strict';
        /**
         * Controls a dictionary of overlayGroups
         * @class OverlayManager
         */
        var LayerManager = Backbone.View.extend({
            /**
             * @lends localground.maps.views.OverlayManager#
             */
            //dataManager: null,
            //basemap: null,

            /**
             * Initializes the object.
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.listenTo(this.app.vent, "show-layer", this.showLayer);
                this.listenTo(this.app.vent, "hide-layer", this.hideLayer);
                this.listenTo(this.app.vent, 'zoom-to-layer', this.zoomToExtent);
                this.layers = {};
            },

            showLayer: function (data) {
                var key = "layer_" + data.layerItem.id;
                if (!this.layers[key]) {
                    this.createLayer(data);
                }
                this.layers[key].showAll();
            },
            hideLayer: function (data) {
                var key = "layer_" + data.layerItem.id;
                if (!this.layers[key]) {
                    this.createLayer(data);
                }
                this.layers[key].hideAll();
            },
            createLayer: function (data) {
                var opts = _.clone(this.opts);
                opts = _.extend(opts, data);
                this.layers["layer_" + data.layerItem.id] = new Layer(opts);
            },
            destroy: function () {
                this.remove();
            }
        });
        return LayerManager;
    });
