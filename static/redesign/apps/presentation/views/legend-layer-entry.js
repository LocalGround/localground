define(['marionette',
        'underscore',
        'handlebars',
        'collections/symbols',
        'text!../templates/legend-layer.html',
        'text!../templates/legend-symbol-item.html'
    ],
    function (Marionette, _, Handlebars, Symbols, LayerTemplate, SymbolTemplate) {
        'use strict';

        var LegendLayerEntry = Marionette.CompositeView.extend({
            getChildView: function () {
                return Marionette.ItemView.extend({
                    tagName: "li",
                    initialize: function (opts) {
                        _.extend(this, opts);
                        console.log(this.model.toJSON());
                        this.template = Handlebars.compile(SymbolTemplate);
                    },
                    onRender: function () {
                        console.log('rendered');
                    }
                });
            },
            className: "layer-entry",
            childViewContainer: ".symbol-container",
            initialize: function (opts) {
                _.extend(this, opts);
                this.collection = new Symbols(this.model.get("symbols"));
                this.template = Handlebars.compile(LayerTemplate);
            }

        });
        return LegendLayerEntry;
    });
