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
            model: new Layer(
                    {
                        id: 1,
                        map_id: 1,
                        name: "flowers",
                        source: "form_11",
                        symbols: [{
                            color: "#428BCA",
                            width: 30,
                            shape: "circle",
                            rule: "flower_type = 'daisy'",
                            title: "Daisy"
                        }, {
                            color: "#FF0000",
                            width: 30,
                            shape: "square",
                            rule: "flower_type = 'rose'",
                            title: "Rose"
                        }]
                    }
            ),
            
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
                this.collection = new Backbone.Collection(this.model.get("symbols"));
               
                /**
                 * here is some fake data until the
                 * /api/0/layers/ API Endpoint gets built. Note
                 * that each layer can have more than one symbol
                 */
             //   this.listenTo(this.app.vent, 'init-collection', this.displayLayers);
             //   this.listenTo(this.app.vent, 'change-map', this.displayLayers);
            },
            displayLayers: function (map) {
                var mapId = map.get("id");
                if (!this._collection) {
                    //pretend this is the server query...
                    this._collection = new Layers(fakeData);
                }
                this.collection = new Layers(this._collection.where({map_id: mapId}));
                this.render();
            }

        });
        return MarkerStyleView;
    });