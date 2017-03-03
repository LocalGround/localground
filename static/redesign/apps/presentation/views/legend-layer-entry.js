define(['marionette',
        'underscore',
        'jquery',
        'handlebars',
        'collections/symbols',
        'lib/maps/marker-overlays',
        'lib/maps/overlays/icon',
        'text!../templates/legend-layer.html',
        'text!../templates/legend-symbol-item.html'
    ],
    function (Marionette, _, $, Handlebars, Symbols, OverlayListView, Icon, LayerTemplate, SymbolTemplate) {
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
                        console.log(this.data_source);
                        console.log(this.app.dataManager);
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
