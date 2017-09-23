define(["jquery",
        "marionette",
        "handlebars",
        'lib/maps/marker-overlays',
        "text!../../templates/left/layer-item.html"
    ],
    function ($, Marionette, Handlebars, MarkerOverlays, LayerItemTemplate) {
        'use strict';
        var LayerListChild =  Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.listenTo(this.app.vent, "change-map", this.hideOverlays);
                this.listenTo(this.model, "change:title", this.render);
               // this.listenTo(this.app.vent, "route-layer", this.routerSendCollection);
                this.initMapOverlays();
                if (this.model.get("metadata").isShowing) {
                    this.showOverlays();
                }
            },
            template: Handlebars.compile(LayerItemTemplate),
            tagName: "div",
            className: "layer-column",
            templateHelpers: function () {
                return {
                    isChecked: this.model.get("metadata").isShowing,
                };
            },
            markerOverlayList: null,
            modelEvents: {
                'rebuild-markers': 'updateMapOverlays'
            },
            events: {
                //edit event here, pass the this.model to the right panel
                'click .edit' : 'sendCollection',
                'click .layer-delete' : 'deleteLayer',
                'change input': 'showHideOverlays'
            },

            sendCollection: function () {
                this.$el.attr('id', this.model.id);

                // This just adds css to indicate the selected layer, via the parent view
                this.app.vent.trigger('add-css-to-selected-layer', this.model.id);

                // This event actually triggers the 'createLayer()' function in right-panel.js layoutview
                this.app.vent.trigger("edit-layer", this.model, this.collection);
            },

            childRouterSendCollection: function (mapId, layerId) {

                if (this.model.id == layerId) {
                    console.log("condition met, show layer", this);

                    // This event actually triggers the 'createLayer()' function in right-panel.js layoutview
                    this.app.vent.trigger("edit-layer", this.model, this.collection);

                    // This just adds css to indicate the selected layer, via the parent view
                    // only triggers after the layer has been sent to right-panel
                    this.app.vent.trigger('add-css-to-selected-layer', this.model.id);
                }
            },

            deleteLayer: function () {
                if (!confirm("Are you sure you want to delete this layer?")) {
                    return;
                }
                //console.log("deleteLayer()", this.model);
                //console.log("collection before delete: ", this.collection);
                this.model.destroy();
                this.collection.remove(this.model);
                this.deleteOverlays();
                //this.hideOverlays();
                //console.log("collection after delete: ", this.collection);
                this.app.vent.trigger('update-layer-list');
                this.app.vent.trigger("hide-right-panel");
            },

            updateTitle: function (title) {
                this.model.set("title", title);
                this.render();
            },

            updateMapOverlays: function () {
                //console.log('rebuilding map overlays');
                //console.log(this.model.getSymbols());
                this.hideOverlays();
                this.model.rebuildSymbolMap();
                this.initMapOverlays();
                if (this.model.get("metadata").isShowing) {
                    this.showOverlays();
                }
            },

            initMapOverlays: function () {
                // create an MarkerOverlays for each symbol in the
                // layer.
                this.markerOverlayList = [];
                var matchedCollection,
                    overlays,
                    that = this,
                    dataSource = this.model.get("data_source"),
                    data = this.app.dataManager.getCollection(dataSource),
                    symbols = this.model.getSymbols();
                    //console.log(this.model.getSymbols());
                symbols.each(function (symbol) {
                    matchedCollection = new data.constructor(null, { url: "dummy" });
                    data.each(function (model) {
                        //console.log("symbol looped once", symbol.checkModel(model));
                        if (symbol.checkModel(model)) {
                            matchedCollection.add(model);
                        }
                    });
                    overlays = new MarkerOverlays({
                        collection: matchedCollection,
                        app: that.app,
                        iconOpts: symbol.toJSON(),
                        isShowing: false
                    });
                    that.markerOverlayList.push(overlays);
                });
                //console.log(this.markerOverlayList);
            },

            showOverlays: function () {
                _.each(this.markerOverlayList, function (overlays) {
                    overlays.showAll();
                });
            },

            hideOverlays: function () {
                _.each(this.markerOverlayList, function (overlays) {
                    overlays.hideAll();
                });
            },

            deleteOverlays: function () {
                //console.log("deleteOverlays() called")
              //  this.$el.find('.gmnoprint').remove();

                _.each(this.markerOverlayList, function (overlays) {
                    overlays.remove();
                });
            },

            showHideOverlays: function () {
                this.model.get("metadata").isShowing = this.$el.find('input').prop('checked');
                if (this.model.get("metadata").isShowing) {
                    this.showOverlays();
                } else {
                    this.hideOverlays();
                }
            }
        });
        return LayerListChild;
    });
