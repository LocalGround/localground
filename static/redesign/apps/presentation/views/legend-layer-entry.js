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
                    data_source: this.model.get("data_source")
                };
            },
            initialize: function (opts) {
                _.extend(this, opts);
                // if this collection only has 1 symbol, then don't show
                // the header:
                console.log("Legend Layer Entry: ");
                this.collection = new Symbols(this.model.get("symbols"));
                this.template = Handlebars.compile(LayerTemplate);
                console.log(this);
            }

        });
        return LegendLayerEntry;
    });
