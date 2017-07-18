define(['marionette',
        'underscore',
        'jquery',
        'handlebars',
        'lib/maps/marker-overlays',
        'text!../templates/legend-symbol-item.html'
    ],
    function (Marionette, _, $, Handlebars, OverlayListView, SymbolTemplate) {
        'use strict';

        var LegendSymbolEntry = Marionette.ItemView.extend({
            tagName: "li",

            events: {
                'change .cb-symbol': 'showHide'
            },

            showHide: function (e) {
                var isChecked = $(e.target).prop('checked');
                if (isChecked) {
                    this.markerOverlays.showAll();
                } else {
                    this.markerOverlays.hideAll();
                }
            },

            show: function (e) {
                this.markerOverlays.showAll();
                if (e) {
                    e.preventDefault();
                }
            },

            hide: function (e) {
                this.markerOverlays.hideAll();
                if (e) {
                    e.preventDefault();
                }
            },

            templateHelpers: function () {
                var width = 25,
                    scale = width / this.model.get("width"),
                    template_items = {
                        width: width,
                        height: this.model.get("height") * scale,
                        strokeWeight: this.model.get("strokeWeight"),
                        count: this.symbolCount,
                        isShowing: this.getIsShowing()
                    };
                return template_items;
            },
            getIsShowing: function () {
                return this.model.get('isShowing') || this.isShowing || false;
            },

            initialize: function (opts) {
                _.extend(this, opts);
                var that = this, matchedCollection;
                this.template = Handlebars.compile(SymbolTemplate);
                this.data = this.app.dataManager.getCollection(this.data_source);
                matchedCollection = new this.data.constructor(null, { url: "dummy" });

                this.data.each(function (model) {
                    if (that.model.checkModel(model)) {
                        matchedCollection.add(model);
                    }
                });

                this.markerOverlays = new OverlayListView({
                    collection: matchedCollection,
                    app: this.app,
                    iconOpts: this.model.toJSON(),
                    isShowing: this.getIsShowing()
                });

                this.listenTo(this.app.vent, "show-all-markers", this.markerOverlays.showAll.bind(this.markerOverlays));
            },

            onRender: function(){
                if (this.getIsShowing()) {
                    this.show();
                }
            }
        });
        return LegendSymbolEntry;
    });
