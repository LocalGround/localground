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
                this.listenTo(this.app.vent, 'zoom-to-extent', this.zoomToExtent);
                this.layers = {};
            },

            showLayer: function (data) {
                var key = "layer_" + data.legendItem.id,
                    k;
                if (!this.layers[key]) {
                    console.log("creating...", key);
                    this.createLayer(data);
                }
                this.layers[key].showAll();
                for (k in this.layers) {
                    console.log(k, this.layers[k].models);
                }
            },
            createLayer: function (data) {
                var opts = _.clone(this.opts);
                opts = _.extend(opts, data);
                this.layers["layer_" + data.legendItem.id] = new Layer(opts);
            },
            destroy: function () {
                this.remove();
            }
        });
        return LayerManager;
    });
