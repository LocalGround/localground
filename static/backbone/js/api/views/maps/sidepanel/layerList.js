define(["marionette",
        "views/maps/sidepanel/items/layerItem"
        ],
    function (Marionette, LayerItem) {
        'use strict';
        var LayerList = Marionette.CollectionView.extend({
            childView: LayerItem,

            initialize: function (opts) {
                this.app = opts.app;
                this.collection = opts.selectedLayers;
                this.childViewOptions = opts;

                //listen for global events:
                this.app.vent.on("add-layer", this.addToCollection, this);
                this.app.vent.on("remove-layer", this.removeFromCollection, this);
                this.app.vent.on('hide-layers', this.hide, this);
            },

            applyEventHandlerBugfix: function () {
                this.listenTo(this.collection, 'add', this._onCollectionAdd);
                this.listenTo(this.collection, 'remove', this._onCollectionRemove);
                this.listenTo(this.collection, 'reset', this.render);
            },

            addToCollection: function (model) {
                this.collection.add(model);
            },

            removeFromCollection: function (model) {
                this.collection.remove(model);
            },

            hide: function () {
                this.$el.hide();
            },

            show: function () {
                this.$el.show();
            }
        });
        return LayerList;
    });
