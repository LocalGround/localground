define(["marionette",
        "handlebars",
        "text!../../templates/left/layer-item.html",
        "models/symbol",
        "models/record",
        "apps/main/views/left/symbol-collection-view",
        "apps/main/views/left/edit-layer-menu",
        "apps/main/views/right/marker-style-view",
        "apps/main/views/left/add-marker-menu",
        "lib/lgPalettes"
    ],
    function (Marionette, Handlebars, LayerItemTemplate, Symbol, Record,
            SymbolView, EditLayerMenu, MarkerStyleView, AddMarkerMenu, LGPalettes) {
        'use strict';
        /**
         *  In this view, this.model = layer, this.collection = symbols
         *  This view loops through all symbols and sorts any matching records in Overlays
         *  This view's children symbols, along with an matching records.
         *  It also handles show, hide, and delete markers
         */

         //TODO: Everytime 'rebuild-markers' event triggered, create a new
         // layerListView
        var LayerListChild =  Marionette.CompositeView.extend({
            collectionEvents: {
                'reset': 'reRender'
            },
            modelEvents: {
                'change:group_by': 'updateGroupBy',
                'change:title': 'render',
                'change:display_field': 'render'
            },
            events: {
                //edit event here, pass the this.model to the right panel
                'change .layer-isShowing': 'showHideOverlays',
                'click #layer-style-by': 'showStyleByMenu',
                'click .collapse': 'collapseSymbols',
                'click .open-layer-menu': 'showLayerMenu',
                'click .add-record-container': 'displayGeometryOptions',
                'click #select-point': 'initAddPoint',
                'click #select-polygon': 'initAddPolygon',
                'click #select-polyline': 'initAddPolyline',
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.popover = this.app.popover;
                this.modal = this.app.modal;
                this.symbolModels = this.collection;
                this.listenTo(this.dataCollection, 'add', this.assignRecordToSymbol)
                this.listenTo(this.dataCollection, 'update-symbol-assignment', this.reAssignRecordToSymbols)
                this.listenTo(this.app.vent, 'geometry-created', this.addRecord);
                this.listenTo(this.app.vent, 'record-has-been-delete', this.removeEmptySymbols);
                if (!this.model || !this.collection || !this.dataCollection) {
                    console.error("model, collection, and dataCollection are required");
                    return;
                }

                this.newMarkerType = 'point';

                this.assignRecordsToSymbols();
                this.reAssignRecordsToSymbols();
                this.model.get('metadata').collapsed = false;

                this.removeEmptySymbols();
            },

            onRender: function() {
                this.showHideOverlays(null, this.model.get("metadata").isShowing);
            },

            template: Handlebars.compile(LayerItemTemplate),
            templateHelpers: function () {
                return {
                    project: this.app.dataManager.getProject(),
                    name: this.dataCollection.name,
                    isChecked: this.model.get("metadata").isShowing,
                    newMarkerType: this.newMarkerType
                };
            },
            childView: SymbolView,

            childViewContainer: "#symbols-list",

            reRender: function () {
                console.log('Symbols have been regenerated...');
                this.assignRecordsToSymbols();
            },
            updateGroupBy: function () {
                this.$el.find('#layer-style-by').html(
                    this.model.get('group_by')
                );
            },
            childViewOptions: function (model, index) {
                return {
                    app: this.app,
                    collection: model.getModels(),
                    layerId: this.model.id,
                    layer: this.model,
                    mapId: this.model.get('map_id')
                };
            },
            addChild: function (symbolModel, ChildView, index) {
                //if the symbol has no children, don't create the child
                // view:
                if (symbolModel.getModelsJSON().length > 0) {
                    return Marionette.CollectionView.prototype.addChild.call(this, symbolModel, ChildView, index);
                }
                return null;
            },
            getUncategorizedSymbolModel: function () {
                return this.symbolModels.findWhere({
                    rule: Symbol.UNCATEGORIZED_SYMBOL_RULE
                });
            },
            assignRecordsToSymbols: function () {
                // const that = this;
                const uncategorizedSymbol = this.getUncategorizedSymbolModel();

                this.dataCollection.each((recordModel) => {
                    var matched = false;
                    this.symbolModels.each(function (symbolModel) {
                        //console.log(symbolModel);
                        if (symbolModel.checkModel(recordModel)) {
                            symbolModel.addModel(recordModel);
                            matched = true;
                        }
                    })
                    if (!matched) {
                        //this.reAssignRecordToSymbols(recordModel);
                        uncategorizedSymbol.addModel(recordModel);
                    }
                });
            },
            assignRecordToSymbol: function (recordModel) {
                var symbolView;
                this.children.each(function (view) {
                    if (view.model.checkModel(recordModel)) {
                        symbolView = view;
                        return;
                    }
                });
                if (!symbolView) {
                    symbolView = this.children.findByModel(
                        this.getUncategorizedSymbolModel()
                    );
                }
                if (!symbolView) {
                    alert('missing!');
                }
                symbolView.model.addModel(recordModel);
                //symbolView.render();
            },

            reAssignRecordsToSymbols: function() {
                this.dataCollection.each((recordModel) => {
                    this.reAssignRecordToSymbols(recordModel)
                });
            },

            reAssignRecordToSymbols: function(recordModel) {
                const gb = this.model.get('group_by');
                if (gb === 'uniform' || gb === 'individual') {
                    return;
                }
                var matched = false;
                const uncategorizedSymbol = this.getUncategorizedSymbolModel();
                const recordValIsEmpty = this.isEmpty(
                    recordModel.get(this.model.get('metadata').currentProp)
                );
                this.symbolModels.each(function(symbolModel) {
                    if (symbolModel.containsRecord(recordModel)
                        && !symbolModel.checkModel(recordModel)) {
                            symbolModel.removeModel(recordModel);
                    }
                    if (symbolModel.checkModel(recordModel)) {
                        symbolModel.addModel(recordModel);
                        matched = true;
                    }

                });
                if (!matched) {
                    if (!this.model.get('metadata').isContinuous && !recordValIsEmpty) {
                        this.createNewSymbol(this.symbolModels, recordModel);
                    } else {
                        uncategorizedSymbol.addModel(recordModel);
                    }
                }

                this.removeEmptySymbols();

                this.saveChanges();
            },

            removeEmptySymbols: function() {
                this.symbolModels.each((symbol) => {
                    if (symbol.matchedModels.length === 0) {
                        if (symbol.get('rule') !== '¯\\_(ツ)_/¯') {
                            console.log('removing symbol: ', symbol)
                            this.symbolModels.remove(symbol);
                        }
                    }
                });
            },
            createNewSymbol: function(symbolCollection, record) {
                const category = record.get(this.model.get('metadata').currentProp);
                const paletteId = this.model.get('metadata').paletteId;
                const lgPalettes = new LGPalettes();
                const palette = lgPalettes.getPalette(paletteId, 8, 'categorical');

                const maxId = symbolCollection.maxId();
                const symbolId = symbolCollection.length;
                let symbol = Symbol.createCategoricalSymbol(category, this.model, maxId + 1, symbolCollection.length + 1, palette)

                if (symbol.checkModel(record)) {
                    symbol.addModel(record);
                }
                console.log('newSYMBOL: ', symbol);
                symbolCollection.add(symbol, { at: symbolCollection.length - 1 });
            },

            isEmpty(value){
                return (value == null || value.length === 0);
            },

            addFakeModel: function () {
                var categories = ['mural', 'sculpture', 'blah', undefined, null, '']
                var category = categories[ parseInt(Math.random() * 6) ]
                var id = parseInt(Math.random()* 1000)
                var recordModel = new Record({
                    'id': id,
                    'col1': category,
                    'desc': `Marker ${id}: (${category})`,
                    'display_name': `Marker ${id}: (${category})`,
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [
                            -122 + Math.random(),
                            37 + Math.random()
                        ]
                    }
                });
                this.dataCollection.add(recordModel);
            },

            addRecord: function (data) {
                if (this.cid !== data.viewID) {
                    return;
                }

                const recordModel = new Record({
                    'overlay_type': this.model.get('dataset').overlay_type,
                    "project_id": this.app.dataManager.getProject().id,
                    "form": this.model.get('dataset'),
                    "fields": this.model.get('dataset').fields,
                    "owner": this.model.get('owner'),
                    'geometry': data.geoJSON,
                    "fillColor": '#ed867d'
                }, { urlRoot: this.dataCollection.url });

                recordModel.save(null, {
                    success: () => {
                        this.dataCollection.add(recordModel);
                        var mapID = this.app.dataManager.getMap().id,
                            layerID = this.model.id,
                            overlay_type = this.model.get('dataset').overlay_type,
                            recID = recordModel.id,
                            route = `${mapID}/layers/${layerID}/${overlay_type}/${recID}`;
                        this.app.router.navigate("//" + route);
                    }
                });
            },

            // triggered from the router
            checkSelectedItem: function(layerId) {
                this.$el.attr('id', this.model.id);
                if (this.$el.find('input').prop('checked', false)) {
                    this.$el.find('input').click();
                }
            },

            updateTitle: function (title) {
                this.model.set("title", title);
                this.render();
            },
            showStyleByMenu: function (event) {
                this.popover.update({
                    $source: this.$el.find('.layer-style-by'),
                    view: new MarkerStyleView({
                        app: this.app,
                        model: this.model
                    }),
                    placement: 'right',
                    offsetX: '5px',
                    width: '350px',
                    title: 'Layer Properties'
                });
            },

            showLayerMenu: function(event) {

                this.popover.update({
                    $source: event.target,
                    view: new EditLayerMenu({
                        app: this.app,
                        model: this.model,
                        children: this.children
                    }),
                    placement: 'bottom',
                    width: '180px'
                });
            },

            displayGeometryOptions: function(e) {
                this.popover.update({
                    $source: e.target,
                    view: new AddMarkerMenu({
                        app: this.app,
                        model: this.model,
                        parent: this
                    }),
                    placement: 'bottom',
                    width: '120px'
                });

            },

            // This function gets triggered both by user events and by onRender, so we manage
            // the arguments to handle both situations.
            // If it is triggered by an event, there is only 1 argument.
            // If it is triggered from onRender, there are 2 args, and arg1 is null.
            showHideOverlays: function (event, state) {
                let isShowing;
                if (arguments.length === 1) {
                    isShowing = this.$el.find('input').prop('checked');
                    this.model.get("metadata").isShowing = isShowing;
                } else {
                    isShowing = state;
                }
                this.children.each(function(childView) {
                    if (isShowing) {

                        // when toggling show/hide of the entire layer (all overlays),
                        // defer to the individual child symbols. This way, we can remember show/hide
                        // attributes at the child/symbol level instead of resetting it every
                        // time show/hide is toggled at the layer level
                        childView.redrawOverlays();
                    } else {
                        // but when we are hiding at the layer level, we always hide all child symbols
                        childView.hideOverlays();
                    }

                })
                if (isShowing) {
                    this.$el.removeClass('hide-layer');
                    // this.$el.find('#symbols-list').show();
                    // this.$el.find('.lc-2').show();
                    // this.$el.find('.lc-3').show();
                } else {
                    this.$el.addClass('hide-layer');
                    // this.$el.find('#symbols-list').hide()
                    // this.$el.find('.lc-2').hide();
                    // this.$el.find('.lc-3').hide();
                }
                this.saveChanges();
            },

            addCssToSelectedLayer: function(markerId) {
                this.$el.find('#' + markerId).addClass('highlight');
            },

            collapseSymbols: function () {
                if (this.model.get('metadata').collapsed === true) {
                    this.model.get('metadata').collapsed = false
                    this.$el.find('.symbol').css('height', 'auto');
                    this.$el.find('.symbol-item').css('display', 'block');
                    this.$el.find('.collapse').removeClass('fa-caret-up');
                    this.$el.find('.collapse').addClass('fa-caret-down');
                } else {
                    this.model.get('metadata').collapsed = true;
                    this.$el.find('.symbol').css('height', 0);
                    this.$el.find('.symbol-item').css('display', 'none');
                    this.$el.find('.collapse').removeClass('fa-caret-down');
                    this.$el.find('.collapse').addClass('fa-caret-up');
                }
            },


            addRecord: function (data) {
                console.log(this.cid, data.viewID)
                if (this.cid !== data.viewID) {
                    return;
                }

                const recordModel = new Record({
                    'overlay_type': this.model.get('dataset').overlay_type,
                    "project_id": this.app.dataManager.getProject().id,
                    "form": this.model.get('dataset'),
                    "fields": this.model.get('dataset').fields,
                    "owner": this.model.get('owner'),
                    'geometry': data.geoJSON,
                    "fillColor": '#ed867d'
                }, { urlRoot: this.dataCollection.url });
                recordModel.save(null, {
                    success: () => {
                        this.dataCollection.add(recordModel);
                        var mapID = this.app.dataManager.getMap().id,
                            layerID = this.model.id,
                            overlay_type = this.model.get('dataset').overlay_type,
                            recID = recordModel.id,
                            route = `${mapID}/layers/${layerID}/${overlay_type}/${recID}`;
                        this.app.router.navigate("//" + route);
                    }
                });
            },

            saveChanges: function() {
                this.model.save();
            }
        });
        return LayerListChild;
    });
