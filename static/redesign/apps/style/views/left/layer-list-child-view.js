define(["jquery",
        "marionette",
        "handlebars",
        'lib/maps/marker-overlays',
        "text!../../templates/left/layer-item.html"
    ],
    function ($, Marionette, Handlebars, OverlayListView, LayerItemTemplate) {
        'use strict';
        var LayerListChild =  Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                // this.listenTo(this.app.vent, 'update-title', this.updateTitle);
                this.listenTo(this.app.vent, "change-map", this.hideOverlays);
                this.listenTo(this.model, "change:title", this.render);
                this.initMapOverlays();
            },
            template: Handlebars.compile(LayerItemTemplate),
            templateHelpers: function () {
                return {
                    isChecked: this.isChecked
                };
            },
            markerOverlayList: null,
            modelEvents: {
                'change:symbols': 'updateMapOverlays'
            },
            events: {
                //edit event here, pass the this.model to the right panel
                "click .edit" : "sendCollection",
                'change input': 'showHideOverlays'
            },

            sendCollection: function () {
                this.app.vent.trigger("edit-layer", this.model);
            },

            updateTitle: function (title) {
                this.model.set("title", title);
                this.render();
            },

            updateMapOverlays: function () {
                this.hideOverlays();
                this.model.rebuildSymbolMap();
                this.initMapOverlays();
                if (this.isChecked) {
                    this.showOverlays();
                }
            },

            initMapOverlays: function () {
                // create an OverlayListView for each symbol in the
                // layer.
                this.markerOverlayList = [];
                var matchedCollection,
                    overlays,
                    that = this,
                    dataSource = this.model.get("data_source"),
                    data = this.app.dataManager.getCollection(dataSource),
                    symbols = this.model.getSymbols();
                symbols.each(function (symbol) {
                    matchedCollection = new data.constructor(null, { url: "dummy" });
                    data.each(function (model) {
                        if (symbol.checkModel(model)) {
                            matchedCollection.add(model);
                        }
                    });
                    overlays = new OverlayListView({
                        collection: matchedCollection,
                        app: that.app,
                        iconOpts: symbol.toJSON(),
                        isShowing: false
                    });
                    that.markerOverlayList.push(overlays);
                });
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

            showHideOverlays: function (e) {
                this.isChecked = $(e.target).prop('checked');
                if (this.isChecked) {
                    this.showOverlays();
                } else {
                    this.hideOverlays();
                }
            }
        });
        return LayerListChild;
    });