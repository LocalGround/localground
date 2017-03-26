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
                console.log('initialize childView');
                _.extend(this, opts);
                // this.listenTo(this.app.vent, 'update-title', this.updateTitle);
                this.listenTo(this.app.vent, "change-map", this.hide);
                this.listenTo(this.model, "change", this.render);
                this.initMapOverlays();
            },
            template: Handlebars.compile(LayerItemTemplate),
            markerOverlayList: null,
            modelEvents: {},
            events: {
                //edit event here, pass the this.model to the right panel
                "click .edit" : "sendCollection",
                'change input': 'showHide'
            },

            sendCollection: function () {
                this.app.vent.trigger("edit-layer", this.model);
            },

            updateTitle: function (title) {
                this.model.set("title", title);
                this.render();
            },

            initMapOverlays: function () {
                // create an OverlayListView for each symbol in the
                // layer.
                this.markerOverlayList = [];
                var matchedCollection,
                    overlays,
                    that = this,
                    dataSource = this.model.get("data_source"),
                    data = this.app.dataManager.getCollection(dataSource);
                _.each(this.model.getSymbols(), function (symbol) {
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

            show: function () {
                _.each(this.markerOverlayList, function (overlays) {
                    overlays.showAll();
                });
            },

            hide: function () {
                _.each(this.markerOverlayList, function (overlays) {
                    overlays.hideAll();
                });
            },

            showHide: function (e) {
                var isChecked = $(e.target).prop('checked');
                if (isChecked) {
                    this.show();
                } else {
                    this.hide();
                }
            }
        });
        return LayerListChild;
    });