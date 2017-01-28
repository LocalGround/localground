/*var fakeData = [
    {
        id: 1,
        map_id: 1,
        title: "Neighborhood Flowers",
        data_source: "form_4",
        type: "category",
        property: "species",
        marker_shape: "circle-thin",
        symbols: [{
            color: "#428BCA",
            value: "Lily",
            label: "Lily Sighting",
            rule: "flower_type = 'daisy'",
            isChecked: true
        }, {
            isChecked: false,
            value: "Rose",
            label: "Beautiful Roses",
            color: "#FF0000",
            rule: "flower_type = 'rose'",
        }]
    }, {
        id: 2,
        map_id: 2,
        title: "bird sightings",
        data_source: "form_10",
        symbols: [{
            color: "#4333CA",
            width: 20,
            shape: "circle",
            rule: "bird_type = 'hawk'",
            label: "Hawk"
        }, {
            color: "#FF0000",
            width: 20,
            shape: "square",
            rule: "bird_type = 'sparrow'",
            label: "Sparrow"
        }]
    }, {
        id: 3,
        map_id: 2,
        title: "Public Art",
        data_source: "form_9",
        symbols: [{
            color: "#4333CA",
            width: 20,
            shape: "circle",
            rule: "art_type = 'mural'",
            label: "Mural"
        }, {
            color: "EFEFFF",
            width: 20,
            shape: "square",
            rule: "art_type = 'sculpture'",
            label: "Sculpture"
        }]
    },  {
        id: 4,
        map_id: 2,
        title: "Worms",
        data_source: "form_8",
        symbols: [{
            color: "#4333CA",
            width: 20,
            shape: "square",
            rule: "worm_count < 1",
            label: "Less than 1 worm"
        }, {
            color: "#A4333C",
            width: 20,
            shape: "square",
            rule: "worm_count >= 1'",
            label: "1 or more worms"
        }]
    },  {
        id: 5,
        map_id: 3,
        title: "Soil Moisture",
        data_source: "form_6",
        symbols: [{
            color: "#4333CA",
            width: 20,
            shape: "circle",
            rule: "moisture = 'wet'",
            label: "Wet"
        }, {
            color: "#A4333C",
            width: 20,
            shape: "circle",
            rule: "moisture = 'moist'",
            label: "Moist"
        }, {
            color: "#CA4333",
            width: 20,
            shape: "circle",
            rule: "moisture = 'dry'",
            label: "Dry"
        }]
    }
];*/

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
                    events: {
                        //edit event here, pass the this.model to the right panel
                        "click .edit" : "sendCollection"
                        },
                    tagName: "div",
                    className: "column",
                    templateHelpers: function () {
                        return {
                            test: "123"
                        };
                    },
                    
                    sendCollection: function() {
                        this.app.vent.trigger("edit-layer", this.model);
                        console.log(this.model);
                    }
                });
            },
            childViewContainer: "#layers",
            
            childViewOptions: function () {
              return { app: this.app };  
            },

            initialize: function (opts) {
                this.app = opts.app;
               // this.displayLayersDefault();
                
                if (this.app.currentMap) {
                    this.displayLayers(this.app.currentMap);
                }
                
                this.listenTo(this.app.vent, 'init-collection', this.displayLayers);
                this.listenTo(this.app.vent, 'change-map', this.displayLayers);
            },
            
            events: {
                "click .add-layer" : "showDropDown",
                "click #new-layer-options" : "newLayer"
            },
            
            showDropDown: function() {
               this.$el.find("#new-layer-options").toggle();  
            },
            
            newLayer: function() {
                //send info to right panel?
                //this.app.vent.trigger();    
            },
            
            //display layers when map is changed
            displayLayers: function (map) {
                this.collection = new Layers(null, {mapID: map.get("id")});
                this.collection.fetch({ reset: true});
                this.listenTo(this.collection, 'reset', this.render);
            }

        });
        return SelectMapView;
    });