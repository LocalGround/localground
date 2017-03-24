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
              return { app: this.app };
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
            },

            events: {
                "click .add-layer" : "showDropDown",
                "click #new-layer-options a" : "createNewLayer"
            },

            showDropDown: function() {
               this.$el.find("#new-layer-options").toggle();
            },

            //display layers when map is changed
            displayLayers: function (map) {
                this.collection = new Layers(null, {mapID: map.get("id")});
                this.collection.fetch({ reset: true});
                this.listenTo(this.collection, 'reset', this.render);
            },
            createNewLayer: function (e) {
                console.log(this.app);
                this.app.vent.trigger('add-layer');
                var $selection = $(e.target).attr("data-value");
                var layer = new Layer ({
                    map_id: this.app.model.id,
                    data_source: $selection,
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
                console.log(layer);
                this.app.vent.trigger("edit-layer", layer);
            }

        });
        return SelectMapView;
    });
