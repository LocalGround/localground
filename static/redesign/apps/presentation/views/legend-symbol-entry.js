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
                'click .cb-symbol': 'showHide'
            },
            showHide: function (e) {
                var isChecked = $(e.target).prop('checked');
                if (isChecked) {
                    this.markerOverlays.showAll();
                } else {
                    this.markerOverlays.hideAll();
                }
            },
            templateHelpers: function () {
                var width = 25,
                    scale = width / this.model.get("width");
                return {
                    width: width,
                    height: this.model.get("height") * scale,
                    strokeWeight: this.model.get("strokeWeight") * 5
                };
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(SymbolTemplate);
                var data = this.app.dataManager.getCollection(this.data_source),
                    matchedCollection = new data.constructor(null, { url: "dummy" }),
                    that = this;
                data.each(function (model) {
                    if (that.model.checkModel(model)) {
                        matchedCollection.add(model);
                    }
                });
                this.markerOverlays = new OverlayListView({
                    collection: matchedCollection,
                    app: this.app,
                    iconOpts: this.model.toJSON(),
                    isShowing: this.model.get("is_showing") || false
                });
            }
        });
        return LegendSymbolEntry;
    });