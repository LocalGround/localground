define(['marionette',
        'underscore',
        'handlebars',
        'collections/symbols',
        'apps/presentation/views/legend-symbol-entry',
        'text!../templates/legend-layer.html'
    ],
    function (Marionette, _, Handlebars, Symbols, LegendSymbolEntry, LayerTemplate) {
        'use strict';

        var LegendLayerEntry = Marionette.CompositeView.extend({
            childView: LegendSymbolEntry,
            className: "layer-entry",
            childViewContainer: ".symbol-container",
            childViewOptions: function () {
                return {
                    app: this.app,
                    dataCollection: this.dataCollection,
                    isShowing: this.model.get("metadata").isShowing,
                    symbolCount: this.collection.length
                };
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.collection.assignRecords(this.dataCollection);
                this.template = Handlebars.compile(LayerTemplate);
            }

        });
        return LegendLayerEntry;
    });
