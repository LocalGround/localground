define(['marionette',
        'underscore',
        'jquery',
        'handlebars',
        'collections/symbols',
        'lib/maps/marker-overlays',
        'text!../templates/legend-layer.html',
        'text!../templates/legend-symbol-item.html'
    ],
    function (Marionette, _, $, Handlebars, Symbols, OverlayListView, LayerTemplate, SymbolTemplate) {
        'use strict';

        var LegendLayerEntry = Marionette.CompositeView.extend({
            getChildView: function () {
                return Marionette.ItemView.extend({
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
                        var height = Math.min(this.model.get("height"), 17),
                            scale = height / this.model.get("height");
                        return {
                            width: this.model.get("width") * scale,
                            height: height
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
            },
            className: "layer-entry",
            childViewContainer: ".symbol-container",
            childViewOptions: function () {
                return {
                    app: this.app,
                    data_source: this.model.get("data_source")
                };
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.collection = new Symbols(this.model.get("symbols"));
                this.template = Handlebars.compile(LayerTemplate);
            }

        });
        return LegendLayerEntry;
    });
