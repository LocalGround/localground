define(["marionette",
        "handlebars",
        "collections/layers",
        "models/layer",
        "apps/style/views/left/layer-list-child-view",
        "apps/style/visibility-mixin",
        "text!../../templates/left/layer-list.html"
    ],
    function (Marionette, Handlebars, Layers, Layer, LayerListChild,
        PanelVisibilityExtensions, LayerListTemplate) {
        'use strict';

        var SelectMapView = Marionette.CompositeView.extend(_.extend({}, PanelVisibilityExtensions, {
            stateKey: 'layer_list',
            template: Handlebars.compile(LayerListTemplate),
            isShowing: true,
            childView: LayerListChild,
            childViewContainer: "#layers",

            childViewOptions: function () {
                return {
                    app: this.app,
                    collection: this.collection
                };
            },

            initialize: function (opts) {
                this.app = opts.app;
                this.model = opts.model;
                if (this.app.currentMap) {
                    this.displayLayers(this.app.currentMap);
                }
                this.restoreState();

                this.listenTo(this.app.vent, 'init-collection', this.displayLayers);
                this.listenTo(this.app.vent, 'change-map', this.displayLayers);
                this.listenTo(this.app.vent, 'update-layer-list', this.render);
            },

            events: function () {
                return _.extend(
                    { 'click .add-layer' : 'createNewLayer' },
                    PanelVisibilityExtensions.events
                );
            },

            showDropDown: function () {
                this.$el.find("#new-layer-options").toggle();
            },

            //display layers when map is changed
            displayLayers: function (selectedMapModel) {
                if(!selectedMapModel) {return;}
                this.collection = new Layers(null, {mapID: selectedMapModel.get("id")});
                this.collection.fetch({ reset: true});
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.collection, 'add', this.render);
            },
            createNewLayer: function (e) {
                var layer = new Layer({
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
                this.showSection();
                if (e) {
                    e.preventDefault();
                }
            }

        }));
        return SelectMapView;
    });
