define(["jquery",
        "marionette",
        "handlebars",
        'lib/maps/marker-overlays',
        "text!../../templates/left/layer-item.html",
        "models/symbol",
        "collections/symbols",
        "apps/main/views/left/symbol-view",
        "apps/main/views/right/marker-style-view"
    ],
    function ($, Marionette, Handlebars, MarkerOverlays, LayerItemTemplate, Symbol, Symbols, SymbolView, MarkerStyleView) {
        'use strict';
        /**
         *  In this view, this.model = layer, this.collection = symbols
         *  This view loops through all symbols and sorts any matching records in Overlays
         *  This view's children symbols, along with an matching records.
         *  It also handles show, hide, and delete markers
         */
        var LayerListChild =  Marionette.CompositeView.extend({
            initialize: function (opts) {
                this.symbolForUndefinedMarkers = null;
                _.extend(this, opts);
                this.listenTo(this.app.vent, "change-map", this.hideOverlays);
                this.listenTo(this.model, "change:title", this.render);
                //this.listenTo(this.model, 'update-symbol-collection', this.updateCollection);
               // this.listenTo(this.app.vent, "route-layer", this.routerSendCollection);
                this.initMapOverlays();
                if (this.model.get("metadata").isShowing) {
                    this.showOverlays();
                }
                console.log('layer list childview initlize');
                this.dataset = this.app.dataManager.getCollection(this.model.get('data_source'));

                //this.collection = new Symbols(this.model.get('symbols'));
                if (this.symbolForUndefinedMarkers) {
                    this.collection.add(this.symbolForUndefinedMarkers);
                }
                console.log(this.dataset);
            },
            updateCollection: function() {
                console.log('update Zcollection')
                //this.collection = new Symbols(this.model.get('symbols'));
                //this.initMapOverlays();
                if (this.symbolForUndefinedMarkers) {
                    console.log('adding symbols');
                    this.collection.add(this.symbolForUndefinedMarkers);
                }
                this.render();
            },
            onRender: function () {
                console.log('RENDER', this.collection);
                console.log(this.model);
            },
            template: Handlebars.compile(LayerItemTemplate),
            tagName: "div",
         //   className: "layer-column",
            templateHelpers: function () {
                // let defaultField = this.dataset.fields ? this.dataset.fields.models[1].get('col_name') : 'id';
                // let simpleDataset = this.dataset.models.map(item => {
                //     return {
                //         property: item.get(defaultField),
                //         id: item.get('id')
                //     }
                // });
                //console.log(defaultField);
                //console.log(simpleDataset);
                return {
                    //name: this.model.get('title'),
                    name: this.dataset.name,
                    //dataList: simpleDataset,
                    isChecked: this.model.get("metadata").isShowing
                };
            },
            markerOverlayList: null,
            modelEvents: {
                'rebuild-markers': 'updateMapOverlays'
            },
            events: {
                //edit event here, pass the this.model to the right panel
                'click .layer-delete' : 'deleteLayer',
                'change input': 'showHideOverlays',
                'click #layer-style-by': 'showStyleByMenu'
            },

            childView: SymbolView,
            childViewContainer: "#symbols-list",

            childViewOptions: function () {
                return {
                    app: this.app,
                    collection: this.collection,
                    dataSource: this.model.get("data_source"),
                    layerId: this.model.id

                };
            },

            // triggered from the router
            checkSelectedItem: function(layerId) {
                this.$el.attr('id', this.model.id);

                if (this.$el.find('input').prop('checked', false)) {
                    this.$el.find('input').click();
                }

            },

            childRouterSendCollection: function (mapId, layerId) {

                if (this.model.id == layerId) {
                    this.checkSelectedItem(layerId);

                    // This event actually triggers the 'createLayer()' function in right-panel.js layoutview
                    this.app.vent.trigger("edit-layer", this.model, this.collection);

                    // This just adds css to indicate the selected layer, via the parent view
                    // only triggers after the layer has been sent to right-panel
                    this.app.vent.trigger('add-css-to-selected-layer', this.model.id);
                }
            },

            deleteLayer: function () {
                if (!confirm("Are you sure you want to delete this layer?")) {
                    return;
                }
                var url = "//" + this.model.get('map_id');
                this.model.destroy();
                this.collection.remove(this.model);
                this.deleteOverlays();
                console.log(url);

                this.app.router.navigate(url);
                this.app.vent.trigger('update-layer-list');
                this.app.vent.trigger("hide-right-panel");
            },

            updateTitle: function (title) {
                this.model.set("title", title);
                this.render();
            },

            updateMapOverlays: function () {
                console.log('update map overlays');
                //this.collection = new Symbols(this.model.get('symbols'));
                this.collection = this.model.get('symbols');
                this.hideOverlays();
                this.model.rebuildSymbolMap();
                this.initMapOverlays();
                if (this.model.get("metadata").isShowing) {
                    this.showOverlays();
                }
                this.updateCollection();
                //this.render();
            },

            showStyleByMenu: function (event) {
                console.log('child show styebyMenu', this.model.id);

                const coords = {
                    x: event.clientX,
                    y: event.clientY
                }
                this.app.vent.trigger('show-style-menu', this.model, coords);
            },

            initMapOverlays1111: function () {
                // create an MarkerOverlays for each symbol in the
                // layer.
                console.log('initMapOverlays');
                this.markerOverlayList = [];
                var matchedCollection,
                    overlays,
                    that = this,
                    dataSource = this.model.get("data_source"),
                    dataCollection = this.app.dataManager.getCollection(dataSource),
                    symbols = this.model.getSymbols();
                    const currentProp = this.model.get('metadata').currentProp
                    const dataIds = dataCollection.map(function(model) {
                        return model.id
                    });
                    let representedIds = [];

                console.log(symbols);
                console.log(this.collection);
                symbols.each(function (symbol) {
                    //console.log(symbol.id, symbol.get('title'));
                    matchedCollection = new dataCollection.constructor(null, {
                        url: "dummy",
                        projectID: that.app.getProjectID()
                    });
                    //console.log(JSON.stringify(matchedCollection));
                    dataCollection.each(function (model) {
                        if (symbol.checkModel(model)) {
                            matchedCollection.add(model);
                            representedIds.push(model.id);
                            //console.log(model.id);
                        }
                    });
                    overlays = new MarkerOverlays({
                        collection: matchedCollection,
                        app: that.app,
                        iconOpts: symbol.toJSON(),
                        isShowing: false
                    });

                    that.markerOverlayList.push(overlays);
                });


                const unrepresentedIds = dataIds.filter(function(id) {
                    return !representedIds.includes(id)
                });
                console.log(representedIds);
                console.log(unrepresentedIds);

                if (this.symbolForUndefinedMarkers) {
                    console.log('(this.symbolForUndefinedMarkers): TRUE')
                    this.collection.remove(this.symbolForUndefinedMarkers);
                    symbols.remove(this.symbolForUndefinedMarkers);
                    this.symbolForUndefinedMarkers = null;
                }
                if (this.collection.contains(this.symbolForUndefinedMarkers)) {
                    console.log('(this.collection.contains(this.symbolForUndefinedMarkers)): TRUE')
                }
                console.log(this.markerOverlayList);

                if (unrepresentedIds.length > 0) {

                    // let sqlString = '';

                    // unrepresentedIds.forEach(function (id) {
                    //     sqlString = sqlString.concat('id = ', id, ' or ');
                    //     console.log(sqlString);
                    // });
                    // sqlString = sqlString.slice(0, -4);

                    let sqlString = currentProp + ' = undefined or ' + currentProp + ' = null';

                    console.log(sqlString);
                    let unrepresentedCollection = new dataCollection.constructor(null, {
                        url: "dummy",
                        projectID: that.app.getProjectID()
                    });


                    this.symbolForUndefinedMarkers = new Symbol({
                        rule: sqlString,
                        title: 'undefined markers'
                    });

                    unrepresentedIds.forEach(function(id) {
                        // for overlays
                        unrepresentedCollection.add(dataCollection.get(id));
                        // for symbol
                        that.symbolForUndefinedMarkers.addModel(dataCollection.get(id));
                    });
                    let otherOverlays = new MarkerOverlays({
                        collection: unrepresentedCollection,
                        app: that.app,
                        isShowing: false
                    });
                    this.markerOverlayList.push(otherOverlays);

                    console.log(representedIds);
                    console.log(unrepresentedIds);
                    console.log(that.markerOverlayList);
                    console.log(this.symbolForUndefinedMarkers);
                    this.model.save();
                }
            },

            showOverlays: function () {
                _.each(this.markerOverlayList, function (overlays) {
                    overlays.showAll();
                });
            },

            hideOverlays: function () {
                _.each(this.markerOverlayList, function (overlays) {
                    overlays.hideAll();
                });
            },

            deleteOverlays: function () {
                _.each(this.markerOverlayList, function (overlays) {
                    overlays.remove();
                });
            },

            showHideOverlays: function () {
                this.model.get("metadata").isShowing = this.$el.find('input').prop('checked');
                if (this.model.get("metadata").isShowing) {
                    this.showOverlays();
                } else {
                    this.hideOverlays();
                }
            },
            onDestroy: function () {
                this.hideOverlays();
            }
        });
        return LayerListChild;
    });
