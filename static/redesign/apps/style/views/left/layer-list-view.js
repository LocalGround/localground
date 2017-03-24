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
                       // this.listenTo(this.app.vent, 'update-title', this.updateTitle);
                       this.listenTo(this.model, "change", this.render);
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
                    },


                    updateTitle: function (title) {
                        this.model.set("title", title);
                        console.log("should work");
                        this.render();
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
                this.app.vent.trigger('add-layer');
                var $selection = $(e.target).attr("data-value");
                var layer = new Layer ({
                    map_id: this.model.id,
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
