define(["marionette",
        "views/maps/sidepanel/items/layerItem"
        ],
    function (Marionette, LayerItem) {
        'use strict';
        var LayerList = Marionette.CollectionView.extend({
            childView: LayerItem,

            initialize: function (opts) {
                this.app = opts.app;
                this.collection = this.app.selectedLayers;
                this.childViewOptions = opts;
                this.app.vent.on("add-layer", this.addToCollection, this);
                this.app.vent.on("remove-layer", this.removeFromCollection, this);
            },

            addToCollection: function (model) {
                this.collection.add(model);
            },

            removeFromCollection: function (model) {
                this.collection.remove(model);
            }
        });
        return LayerList;
    });
