define(["marionette",
        "views/maps/overlays/layer"
    ],
    function (Marionette, Layer) {
        'use strict';
        /**
         * Controls a dictionary of overlayGroups
         * @class OverlayManager
         */
        //Todo: can this be a Marionette CollectionManager, since it's managing Layer models?
        var LayerManager = Marionette.CollectionView.extend({
            /**
             * @lends localground.maps.views.LayerManager#
             */
            childView: Layer,
            /**
             * Initializes the object.
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.collection = this.app.selectedLayers;
                this.opts = opts;
                this.childViewOptions = opts;
                this.listenTo(this.collection, "add", this.render);
                //this.listenTo(this.collection, "reset", this.render);
            }
        });
        return LayerManager;
    });