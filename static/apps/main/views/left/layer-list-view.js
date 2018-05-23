define(["marionette",
        "handlebars",
        "models/layer",
        "apps/main/views/left/layer-list-child-view1",
        "text!../../templates/left/layer-list.html",
        "apps/main/views/right/marker-style-view",
        "apps/main/views/right/symbol-style-menu-view",
        "apps/main/views/left/create-layer-form",
    ],
    function (Marionette, Handlebars, Layer, LayerListChild,
        LayerListTemplate, MarkerStyleView, SymbolStyleMenuView, CreateLayerForm) {
        'use strict';
        /**
         *  In this view, this.model = Map, this.collection = Layers
         *  This view handles instantiation of LayerListChildView, MarkerStyleView,
         *  and SymbolStyleMenuView
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

            childViewOptions: function (model, index) {
                var dm = this.app.dataManager;
                return {
                    app: this.app,
                    //collection: new Symbols(model.get('symbols')),
                    collection: model.get('symbols'),
                    dataCollection: dm.getCollection(model.get('dataset').overlay_type)
                };
            },

            initialize: function (opts) {
                // In this view, this.model = the selected map,
                // this.collection = all the map's layers
                this.app = opts.app;
                this.model = opts.model;

                this.modal = this.app.modal; //new Modal();
                console.log(this.collection.toJSON());

                this.listenTo(this.app.vent, 'update-layer-list', this.render);
                this.listenTo(this.app.vent, 'add-css-to-selected-layer', this.addCssToSelectedLayer);
                this.listenTo(this.app.vent, 'show-style-menu', this.showStyleMenu);
                this.listenTo(this.app.vent, 'show-symbol-menu', this.showSymbolMenu);
                this.listenTo(this.app.vent, 'hide-style-menu', this.hideStyleMenu);
                this.listenTo(this.app.vent, 'hide-symbol-style-menu', this.hideSymbolStyleMenu);
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

            // create the view that allows the user to edit entire symbol sets
            showStyleMenu: function(model, coords) {
                //this.menu = null;
                if (this.menu) {
                    this.menu.destroy();
                }

                this.menu = new MarkerStyleView({
                    app: this.app,
                    model: model
                });
                $('.style-by-menu').append(this.menu.$el);
                $('.style-by-menu').css({
                    left: coords.x,
                    top: coords.y
                });
                $('.style-by-menu').show();
            },

            hideStyleMenu: function(e){
                var $el = $(e.target);
                var parent = document.getElementById("style-by-menu");

                $('.style-by-menu').hide();
            },

            // create the view that allows the user to edit *individual* symbol attributes
            showSymbolMenu: function(symbol, coords, layerId) {
                if (this.symbolMenu) {
                    console.log('destroying');
                    this.symbolMenu.destroy();
                }
                this.symbolMenu = new SymbolStyleMenuView({
                    app: this.app,
                    layer: this.model.get('layers').get(layerId),
                    model: symbol
                });

                symbol.set('active', true);

                $('.symbol-menu').append(this.symbolMenu.$el);
                $('.symbol-menu').css({
                    left: coords.x,
                    top: coords.y
                });
                $('.symbol-menu').show();
            },

            hideSymbolStyleMenu: function(e, symbol) {
                console.log('hide symbol menu');
                var $el = $(e.target);
                var parent = document.getElementById("style-by-menu");
                $('.symbol-menu').hide();
                symbol.set('active', false);
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
