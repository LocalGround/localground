define(["marionette",
        "handlebars",
        "collections/layers",
        "models/layer",
        "apps/style/views/left/layer-list-child-view",
        "text!../../templates/left/layer-list.html",
        "text!../../templates/left/layer-item.html"
    ],
    function (Marionette, Handlebars, Layers, Layer, LayerListChild,LayerListTemplate, LayerItemTemplate) {
        'use strict';

        var SelectMapView = Marionette.CompositeView.extend({

            template: Handlebars.compile(LayerListTemplate),

            childView: LayerListChild,
            childViewContainer: "#layers",

            childViewOptions: function () {
                return { app: this.app,
                        collection: this.collection    
                };
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.model = opts.model;
               // this.displayLayersDefault();
                if (this.app.currentMap) {
                    this.displayLayers(this.app.currentMap);
                }

                this.listenTo(this.app.vent, 'init-collection', this.displayLayers);
                this.listenTo(this.app.vent, 'change-map', this.displayLayers);
                this.listenTo(this.app.vent, 'update-layer-list', this.render);
            },

            events: {
               // "click .add-layer" : "showDropDown",
               // "click #new-layer-options a" : "createNewLayer"
               "click .add-layer" : "createNewLayer"
            },

            showDropDown: function() {
               this.$el.find("#new-layer-options").toggle();
            },

            //display layers when map is changed
            displayLayers: function (selectedMapModel) {
                this.collection = new Layers(null, {mapID: selectedMapModel.get("id")});
                this.collection.fetch({ reset: true});
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.collection, 'add', this.render);
                console.log(this.collection);
            },
            createNewLayer: function (e) {
             //   var $selection = $(e.target).attr("data-value");
                var layer = new Layer ({
                    map_id: this.app.selectedMapModel.id,
                    data_source: "photos", //default
                    layer_type: "categorical",
                    filters: [{ "tag" : "nothing" }],
                    symbols: [{
                        "color": "#7075FF",
                        "width": 30,
                        "rule": "sculptures > 0",
                        "title": "At least 1 sculpture"
                    }],
                    title: "untitled"
                    
                });
                this.app.vent.trigger("edit-layer", layer, this.collection);
            }

        });
        return SelectMapView;
    });
