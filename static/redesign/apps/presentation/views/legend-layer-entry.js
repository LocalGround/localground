define(['marionette',
        'underscore',
        'handlebars',
        'collections/symbols',
        'apps/presentation/views/marker-overlays',
        'text!../templates/legend-layer.html',
        'text!../templates/legend-symbol-item.html'
    ],
    function (Marionette, _, Handlebars, Symbols, OverlayListView, LayerTemplate, SymbolTemplate) {
        'use strict';

        var LegendLayerEntry = Marionette.CompositeView.extend({
            getChildView: function () {
                return Marionette.ItemView.extend({
                    tagName: "li",
                    initialize: function (opts) {
                        _.extend(this, opts);
                        console.log(this.model);
                        this.template = Handlebars.compile(SymbolTemplate);
                        var data = this.app.dataManager.getCollection(this.data_source);
                        this.markerOverlays = new OverlayListView({
                            collection: data,
                            app: this.app
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
