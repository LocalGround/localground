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

        var LayerListView = Marionette.CompositeView.extend(_.extend({}, PanelVisibilityExtensions, {
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

                //this.listenTo(this.app.vent, 'init-collection', this.displayLayers);
                //this.listenTo(this.app.vent, 'change-map', this.displayLayers);
                this.listenTo(this.app.vent, 'update-layer-list', this.render);
                this.listenTo(this.app.vent, 'handle-selected-layer', this.handleSelectedLayer);
                this.listenTo(this.app.vent, 'create-new-layer', this.createNewLayer);
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

            handleSelectedLayer: function (id) {
                this.$el.find('.layer-column').removeClass('selected-layer');
                this.$el.find('#' + id).addClass('selected-layer');
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
                console.log("Altered?: ", this.app.layerHasBeenAltered)
                console.log("Saved?: ", this.app.layerHasBeenSaved)
                var continueAction = true;
                if (this.app.layerHasBeenAltered && !this.layerHasBeenSaved) {
                    console.log("should send save confirmation");
                    continueAction = confirm("You have unsaved changes on your currently selected layer. If you continue, your changes will not be saved. Do you wish to continue?");
                }
                if(!continueAction) {
                    console.log("should exit createLayer()");
                    return;
                }
                console.log("createNewLayer triggered", this.app.selectedMapModel);
                var layer = new Layer({
                    map_id: this.app.selectedMapModel.id,
                    data_source: "photos", //default
                    layer_type: "basic",
                    filters: {},
                    symbols: [{
                        "fillColor": "#7075FF",
                        "width": 30,
                        "rule": "sculptures > 0",
                        "title": "At least 1 sculpture"
                    }],
                    title: "Layer 1"
                });
                this.app.vent.trigger("edit-layer", layer, this.collection);
                this.showSection();
                /*
                if (e) {
                    e.preventDefault();
                }
                */
            }

        }));
        return LayerListView;
    });
