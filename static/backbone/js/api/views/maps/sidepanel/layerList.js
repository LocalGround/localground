define(["marionette",
        "collections/layers",
        "views/maps/sidepanel/items/layerItem"
        ],
    function (Marionette, Layers, LayerItem) {
        'use strict';
        var LayerList = Marionette.CollectionView.extend({
            childView: LayerItem,

            initialize: function (opts) {
                this.app = opts.app;
                this.collection = new Layers();
                this.childViewOptions = opts;
                this.app.vent.on("add-layer", this.addToCollection, this);
                this.app.vent.on("remove-layer", this.removeFromCollection, this);
            },

            addToCollection: function (data) {
                this.collection.add(data.layer);
            },

            removeFromCollection: function (data) {
                this.collection.remove(data.layer);
                // also hide overlays from the map:
                this.app.vent.trigger("hide-layer", {
                    layerItem: data.layer
                });
            }
        });
        return LayerList;
    });
