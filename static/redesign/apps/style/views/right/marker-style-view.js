define(["marionette",
        "handlebars",
        "collections/layers",
        "models/layer",
        "text!../../templates/right/marker-style.html",
        "text!../../templates/right/marker-style-child.html"
    ],
    function (Marionette, Handlebars, Layers, Layer, MarkerStyleTemplate, MarkerStyleChildTemplate) {
        'use strict';

        var MarkerStyleView = Marionette.CompositeView.extend({

            template: Handlebars.compile(MarkerStyleTemplate),
            
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                    },
                    template: Handlebars.compile(MarkerStyleChildTemplate),
                    modelEvents: {},
                    events: {},
                    tagName: "tr",
                    className: "table-row",
                    templateHelpers: function () {
                        return {
                            test: "123"
                        };
                    }
                });
            },
            childViewContainer: "#symbols",

            initialize: function (opts) {
                this.app = opts.app;
                this.listenTo(this.app.vent, 'send-collection', this.displaySymbols);               
                /**
                 * here is some fake data until the
                 * /api/0/layers/ API Endpoint gets built. Note
                 * that each layer can have more than one symbol
                 */
            },
            
            displaySymbols: function (layer) {
                console.log(layer);
                this.model = layer;
                this.collection = new Backbone.Collection(this.model.get("symbols"));                
                var symbolsSource = layer.get("source");
                console.log(symbolsSource);
                this.render();
            }

        });
        return MarkerStyleView;
    });