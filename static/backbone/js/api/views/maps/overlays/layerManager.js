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
             * @lends localground.maps.views.LayerManager#
             */
            /**
             * Initializes the object.
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.listenTo(this.app.vent, "show-symbol", this.showLayerSymbol);
                this.listenTo(this.app.vent, "hide-symbol", this.hideLayerSymbol);
                this.listenTo(this.app.vent, "show-layer", this.showLayer);
                this.listenTo(this.app.vent, "hide-layer", this.hideLayer);
                this.listenTo(this.app.vent, 'zoom-to-layer', this.zoomToExtent);
                this.layers = {};
            },
            showLayerSymbol: function (data) {
                var key = "layer_" + data.model.id,
                    rule = data.rule;
                if (!this.layers[key]) {
                    this.createLayer(data);
                }
                this.layers[key].show(rule);
            },
            showLayer: function (data) {
                var key = "layer_" + data.model.id;
                if (!this.layers[key]) {
                    this.createLayer(data);
                }
                this.layers[key].showAll();
            },
            hideLayerSymbol: function (data) {
                var key = "layer_" + data.model.id,
                    rule = data.rule;
                if (!this.layers[key]) {
                    this.createLayer(data);
                }
                this.layers[key].hide(rule);
            },
            hideLayer: function (data) {
                var key = "layer_" + data.model.id;
                if (!this.layers[key]) {
                    this.createLayer(data);
                }
                this.layers[key].hideAll();
            },
            createLayer: function (data) {
                var opts = _.clone(this.opts);
                opts = _.extend(opts, data);
                this.layers["layer_" + data.model.id] = new Layer(opts);
            },
            zoomToExtent: function (data) {
                var key =  "layer_" + data.model.id,
                    layer = this.layers[key];
                if (layer) {
                    layer.zoomToExtent();
                }
            },
            destroy: function () {
                this.remove();
            }
        });
        return LayerManager;
    });
