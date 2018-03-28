define(["marionette",
        "handlebars",
        "collections/layers",
        "models/layer",
        "collections/symbols",
        "apps/main/views/left/layer-list-child-view1",
        "text!../../templates/left/layer-list.html",
        "apps/main/views/right/marker-style-view",
        "apps/main/views/right/symbol-style-menu-view",
        "apps/main/views/left/new-layer-modal-view",
        "lib/modals/modal"
    ],
    function (Marionette, Handlebars, Layers, Layer, Symbols, LayerListChild,
        LayerListTemplate, MarkerStyleView, SymbolStyleMenuView, NewLayer, Modal) {
        'use strict';
        /**
         *  In this view, this.model = Map, this.collection = Layers
         *  This view handles instantiation of LayerListChildView, MarkerStyleView,
         *  and SymbolStyleMenuView
         */
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

            childViewOptions: function (model, index) {
                var dm = this.app.dataManager;
                return {
                    app: this.app,
                    //collection: new Symbols(model.get('symbols')),
                    collection: model.get('symbols'),
                    dataCollection: dm.getCollection(model.get('data_source'))
                };
            },

            initialize: function (opts) {
                // In this view, this.model = the selected map,
                // this.collection = all the map's layers
                this.app = opts.app;
                this.model = opts.model;

                this.modal = new Modal();

                this.listenTo(this.app.vent, 'update-layer-list', this.render);
                this.listenTo(this.app.vent, 'route-layer', this.routerSendCollection);
                this.listenTo(this.app.vent, 'add-css-to-selected-layer', this.addCssToSelectedLayer);
                this.listenTo(this.app.vent, 'route-new-layer', this.createNewLayer);
                this.listenTo(this.app.vent, 'show-style-menu', this.showStyleMenu);
                this.listenTo(this.app.vent, 'show-symbol-menu', this.showSymbolMenu);
                this.listenTo(this.app.vent, 'hide-style-menu', this.hideStyleMenu);
                this.listenTo(this.app.vent, 'hide-symbol-style-menu', this.hideSymbolStyleMenu);
                //this.listenTo(this.app.vent, 'highlight-symbol-item', this.highlightItem);
            },

            events: function () {
                return _.extend({
                    //'click .add-layer' : 'createNewLayer',
                    'click #add-layer': 'createNewLayer'
                });
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
                this.$el.find('#' +'layer' + id).addClass('selected-layer');
            },

            createNewLayer: function() {
                var createLayerModel = new NewLayer({
                    app: this.app,
                    mode: 'createNewLayer'
                });

                this.modal.update({
                    app: this.app,
                    class: "add-layer",
                    view: createLayerModel,
                    title: 'Add Layer',
                    width: 600,
                    //height: 400,
                    saveButtonText: "Add Layer",
                    closeButtonText: "Cancel",
                    showSaveButton: true,
                    saveFunction: createLayerModel.saveLayer.bind(createLayerModel),
                    showDeleteButton: false
                });
                this.modal.show();
            },
 
            // createNewLayer: function (mapID) {
            //     var continueAction = true;
            //     if (this.app.layerHasBeenAltered && !this.layerHasBeenSaved) {
            //         continueAction = confirm("You have unsaved changes on your currently selected layer. If you continue, your changes will not be saved. Do you wish to continue?");
            //     }
            //     if(!continueAction) {
            //         return;
            //     }
            //     var layer = new Layer({
            //         map_id: this.app.selectedMapModel.id,
            //         data_source: "markers", //default
            //         group_by: "basic",
            //         filters: {},
            //         symbols: [{
            //             "fillColor": "#7075FF",
            //             "width": 20,
            //             "rule": "*",
            //             "title": "At least 1 sculpture"
            //         }],
            //         title: "Layer 1",
            //         newLayer: true
            //     });
            //     this.app.vent.trigger("edit-layer", layer, this.collection);
            // },

            // create the view that allows the user to edit entire symbol sets
            showStyleMenu: function(model, coords) {
                //this.menu = null;
                if (this.menu) {
                    this.menu.destroy();
                }

                console.log('show styebyMenu');
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
                console.log('showing menu');

            },

            hideStyleMenu: function(e){
                console.log('hide menu');
                //this.menu.destroy();

                var $el = $(e.target);
                var parent = document.getElementById("style-by-menu");

                $('.style-by-menu').hide();
                // if (!parent.contains(e.target) && !$el.hasClass('layer-style-by') && !parent.hasClass('style-by-menu')) {
                //     console.log(this.menu);
                //     if (this.menu) {
                //         console.log('DESTROY MENU');
                //         $('.style-by-menu').hide();
                //         this.menu.destroy();
                //         //this.menu = null;
                //     }
                // }
            },

            // create the view that allows the user to edit *individual* symbol attributes
            showSymbolMenu: function(symbol, coords, layerId) {
                if (this.symbolMenu) {
                    console.log('destroying');
                    this.symbolMenu.destroy();
                }
                console.log('show symbol menu', this.model);
                console.log('show symbol menu', layerId);
                this.symbolMenu = new SymbolStyleMenuView({
                    app: this.app,
                    layer: this.model.get('layers').get(layerId),
                    model: symbol
                });

                $('.symbol-menu').append(this.symbolMenu.$el);
                $('.symbol-menu').css({
                    left: coords.x,
                    top: coords.y
                });
                $('.symbol-menu').show();
            },

            hideSymbolStyleMenu: function(e) {
                console.log('hide symbol menu');

                var $el = $(e.target);
                var parent = document.getElementById("style-by-menu");

                $('.symbol-menu').hide();
                // if (!parent.contains(e.target) && !$el.hasClass('layer-style-by') && !parent.hasClass('style-by-menu')) {
                //     console.log(this.menu);
                //     if (this.menu) {
                //         console.log('DESTROY MENU');
                //         $('.style-by-menu').hide();
                //         this.menu.destroy();
                //         //this.menu = null;
                //     }
                // }
            },

            // highlightItem: function(info) {
            //     this.children.each((view) => {
            //         console.log(view.model.id);
            //         if (view.model.id == info.layerId) {
            //             console.log('matching layer ', info.layerId);
            //             view.addCssToSelectedLayer(info.markerId);
            //         }
            //     })
            // },

            onDestroy: function() {
                console.log('DESTROYING>>>');
                if (this.menu) {
                    this.menu.destroy();
                }
            },

        }));
        return LayerListView;
    });
