define(['marionette',
        'underscore',
        'handlebars',
        'collections/layers',
        'collections/symbols',
        'text!../templates/legend-layer.html',
        'text!../templates/legend-symbol-item.html'
    ],
    function (Marionette, _, Handlebars, Layers, Symbols, LayerTemplate, SymbolTemplate) {
        'use strict';
        /**
         * The top-level view class that harnesses all of the map editor
         * functionality. Also coordinates event triggers across all of
         * the constituent views.
         * @class OverlayGroup
         */
        var LegendLayerEntry = Marionette.CompositeView.extend({
            /** A google.maps.Map object */
            map: null,
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
            childViewContainer: ".symbol-container",
            initialize: function (opts) {
                _.extend(this, opts);
                this.layers = new Layers(this.model.get("layers"), { mapID: this.model.get("id") });
                this.model = this.layers.at(0);
                this.collection = new Symbols(this.model.get("symbols"));
                this.template = Handlebars.compile(LayerTemplate);
            }

        });
        return LegendLayerEntry;
    });
