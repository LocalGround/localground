define(["marionette",
        "handlebars",
        "models/layer",
        "apps/main/views/left/layer-list-child-view1",
        "text!../../templates/left/layer-list.html",
        "apps/main/views/left/create-layer-form"
    ],
    function (Marionette, Handlebars, Layer, LayerListChild,
        LayerListTemplate, CreateLayerForm) {
        'use strict';
        /**
         *  In this view, this.model = Map, this.collection = Layers
         *  This view handles instantiation of LayerListChildView and
         * MarkerStyleView
         */
        var LayerListView = Marionette.CompositeView.extend(_.extend({}, {
            template: Handlebars.compile(LayerListTemplate),
            templateHelpers: function () {
                return {
                    noLayers: (this.collection.length === 0)
                };
            },
            isShowing: true,
            childView: LayerListChild,
            childViewContainer: "#layers",

            initialize: function (opts) {
                // In this view, this.model = the selected map,
                // this.collection = all the map's layers
                this.app = opts.app;
                this.model = opts.model;
                this.modal = this.app.modal;
                this.listenTo(this.app.vent, 'update-layer-list', this.render);
                this.listenTo(this.app.vent, 'add-css-to-selected-layer', this.addCssToSelectedLayer);
            },

            childViewOptions: function (model, index) {
                var dm = this.app.dataManager;
                return {
                    app: this.app,
                    //collection: new Symbols(model.get('symbols')),
                    collection: model.get('symbols'),
                    dataCollection: dm.getCollection(model.get('dataset').overlay_type)
                };
            },

            events: {
                'click .add-layer': 'createNewLayer'
            },

            // this just adds some css to indicate the selected layer
            addCssToSelectedLayer: function (id) {
                this.$el.find('.layer-column').removeClass('selected-layer');
                this.$el.find('#' +'layer' + id).addClass('selected-layer');
            },

            createNewLayer: function(e) {
                var createLayerForm = new CreateLayerForm({
                    app: this.app,
                    map: this.model,
                    model: new Layer({
                        map_id: this.model.id
                    })
                });

                this.modal.update({
                    app: this.app,
                    class: "add-layer",
                    view: createLayerForm,
                    title: 'Add Layer',
                    width: 300,
                    saveButtonText: "Add Layer",
                    closeButtonText: "Cancel",
                    showSaveButton: true,
                    saveFunction: createLayerForm.saveLayer.bind(createLayerForm),
                    showDeleteButton: false
                });
                this.modal.show();
                if(e) { e.preventDefault(); }
            },

            onDestroy: function() {
                console.log('DESTROYING>>>');
                if (this.menu) {
                    this.menu.destroy();
                }
            },

        }));
        return LayerListView;
    });
