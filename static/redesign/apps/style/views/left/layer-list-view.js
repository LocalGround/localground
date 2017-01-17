var fakeData = [
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
    }, {
        id: 2,
        map_id: 2,
        name: "bird sightings",
        source: "form_10",
        symbols: [{
            color: "#4333CA",
            width: 20,
            shape: "circle",
            rule: "bird_type = 'hawk'",
            title: "Hawk"
        }, {
            color: "#FF0000",
            width: 20,
            shape: "square",
            rule: "bird_type = 'sparrow'",
            title: "Sparrow"
        }]
    }, {
        id: 3,
        map_id: 2,
        name: "Public Art",
        source: "form_9",
        symbols: [{
            color: "#4333CA",
            width: 20,
            shape: "circle",
            rule: "art_type = 'mural'",
            title: "Mural"
        }, {
            color: "EFEFFF",
            width: 20,
            shape: "square",
            rule: "art_type = 'sculpture'",
            title: "Sculpture"
        }]
    },  {
        id: 4,
        map_id: 2,
        name: "Worms",
        source: "form_8",
        symbols: [{
            color: "#4333CA",
            width: 20,
            shape: "square",
            rule: "worm_count < 1",
            title: "Less than 1 worm"
        }, {
            color: "#A4333C",
            width: 20,
            shape: "square",
            rule: "worm_count >= 1'",
            title: "1 or more worms"
        }]
    },  {
        id: 5,
        map_id: 3,
        name: "Soil Moisture",
        source: "form_6",
        symbols: [{
            color: "#4333CA",
            width: 20,
            shape: "circle",
            rule: "moisture = 'wet'",
            title: "Wet"
        }, {
            color: "#A4333C",
            width: 20,
            shape: "circle",
            rule: "moisture = 'moist'",
            title: "Moist"
        }, {
            color: "#CA4333",
            width: 20,
            shape: "circle",
            rule: "moisture = 'dry'",
            title: "Dry"
        }]
    }
];

define(["marionette",
        "handlebars",
        "collections/layers",
        "text!../../templates/left/layer-list.html",
        "text!../../templates/left/layer-item.html"
    ],
    function (Marionette, Handlebars, Layers, LayerListTemplate, LayerItemTemplate) {
        'use strict';

        var SelectMapView = Marionette.CompositeView.extend({

            template: Handlebars.compile(LayerListTemplate),

            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                    },
                    template: Handlebars.compile(LayerItemTemplate),
                    modelEvents: {},
                    events: {},
                    tagName: "div",
                    className: "column",
                    templateHelpers: function () {
                        return {
                            test: "123"
                        };
                    }
                });
            },
            childViewContainer: "#layers",

            initialize: function (opts) {
                this.app = opts.app;
                
                if (this.app.currentMap) {
                    this.displayLayers(this.app.currentMap);
                }
                /**
                 * here is some fake data until the
                 * /api/0/layers/ API Endpoint gets built. Note
                 * that each layer can have more than one symbol
                 */
                this.listenTo(this.app.vent, 'init-collection', this.displayLayers);
                this.listenTo(this.app.vent, 'change-map', this.displayLayers);
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
        return SelectMapView;
    });