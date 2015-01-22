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

            initialize: function (opts) {
                this.app = opts.app;
                this.collection = opts.selectedLayers;
                this.opts = opts;
                this.childView = Layer;
                this.childViewOptions = opts;

                // Bugfix: reset events should be called automatically, but they're not, for
                // some reason (though they are in other CollectionViews).
                this.applyEventHandlerBugfix();

                this.render();
            },

            applyEventHandlerBugfix: function () {
                //this.listenTo(this.collection, 'add', this._onCollectionAdd);
                //this.listenTo(this.collection, 'remove', this._onCollectionRemove);
                this.listenTo(this.collection, 'reset', this.render);
            }
        });
        return LayerManager;
    });