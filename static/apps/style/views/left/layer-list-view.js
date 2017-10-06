define(["marionette",
        "handlebars",
        "collections/layers",
        "models/layer",
        "apps/style/views/left/layer-list-child-view",
        "text!../../templates/left/layer-list.html"
    ],
    function (Marionette, Handlebars, Layers, Layer, LayerListChild,
        LayerListTemplate) {
        'use strict';

        var LayerListView = Marionette.CompositeView.extend(_.extend({}, {
            stateKey: 'layer_list',
            template: Handlebars.compile(LayerListTemplate),
            templateHelpers: function () {
                return {
                    noLayers: (this.collection.length === 0)
                };
            },
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

                this.listenTo(this.app.vent, 'update-layer-list', this.render);
                this.listenTo(this.app.vent, 'route-layer', this.routerSendCollection);
                this.listenTo(this.app.vent, 'add-css-to-selected-layer', this.addCssToSelectedLayer);
                this.listenTo(this.app.vent, 'route-new-layer', this.createNewLayer);
                console.log(this.model);
            },

            events: function () {
                return _.extend(
                    { 'click .add-layer' : 'createNewLayer' }                );
            },
            showDropDown: function () {
                this.$el.find("#new-layer-options").toggle();
            },

            routerSendCollection: function (mapId, layerId) {
                var active;

                // loops through children and send the matching child to the right panel
                this.children.forEach(function(item) {
                    if (item.model.get('id') == layerId) {
                        item.childRouterSendCollection(mapId, layerId);
                    }
                });
            },

            // this just adds some css to indicate the selected layer
            addCssToSelectedLayer: function (id) {
                this.$el.find('.layer-column').removeClass('selected-layer');
                this.$el.find('#' + id).addClass('selected-layer');
                console.log(this.childView);
            },

            createNewLayer: function (mapID) {
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
                    data_source: "markers", //default
                    layer_type: "basic",
                    filters: {},
                    symbols: [{
                        "fillColor": "#7075FF",
                        "width": 30,
                        "rule": "sculptures > 0",
                        "title": "At least 1 sculpture"
                    }],
                    title: "Layer 1", 
                    newLayer: true
                });
                this.app.vent.trigger("edit-layer", layer, this.collection);
                //this.showSection();
            }

        }));
        return LayerListView;
    });
