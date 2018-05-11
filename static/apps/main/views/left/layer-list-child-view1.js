define(["marionette",
        "handlebars",
        "text!../../templates/left/layer-item.html",
        "models/symbol",
        "models/record",
        "apps/main/views/left/symbol-collection-view",
        "apps/main/views/left/edit-layer-name-modal-view",
        "apps/main/views/left/edit-display-field-modal-view",
        "lib/maps/controls/mouseMover",
        "lib/lgPalettes",
    ],
    function (Marionette, Handlebars, LayerItemTemplate, Symbol, Record,
            SymbolView, EditLayerName, EditDisplayField, MouseMover, LGPalettes) {
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
                'click #fakeadd': 'addFakeModel',
                'click .delete-layer' : 'deleteLayer',
                'change .layer-isShowing': 'showHideOverlays',
                'click #layer-style-by': 'showStyleByMenu',
                'click .collapse': 'collapseSymbols',
                'click .layer-name': 'editLayerName',
                'click .open-layer-menu': 'showLayerMenu',
                'click .rename-layer': 'editLayerName',
                'click .edit-display-field': 'editDisplayField',
                'click .add-record-container': 'displayGeometryOptions',
                'click #select-point': 'initAddPoint',
                'click #select-polygon': 'initAddPolygon',
                'click #select-polyline': 'initAddPolyline',
                'click .zoom-to-extents': 'zoomToExtents'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                console.log(this.model);
                this.symbolModels = this.collection;
                this.modal = this.app.modal;
                this.listenTo(this.dataCollection, 'add', this.assignRecordToSymbol)
                this.listenTo(this.dataCollection, 'update-symbol-assignment', this.reAssignRecordToSymbols)
                this.listenTo(this.app.vent, 'geometry-created', this.addRecord);
                if (!this.model || !this.collection || !this.dataCollection) {
                    console.error("model, collection, and dataCollection are required");
                    return;
                }

                this.newMarkerType = 'point';

                this.assignRecordsToSymbols();
                this.model.get('metadata').collapsed = false;


                $('body').click($.proxy(this.hideLayerMenu, this));
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
                this.$el.find('.layer-style-by span').html(
                    this.model.get('group_by')
                );
            },
            childViewOptions: function (model, index) {
                return {
                    app: this.app,
                    //collection: this.collection,
                    layerId: this.model.id,
                    layer: this.model,
                    mapId: this.model.get('map_id')
                };
            },
            getUncategorizedSymbolModel: function () {
                return this.symbolModels.findWhere({
                    rule: Symbol.UNCATEGORIZED_SYMBOL_RULE
                });
            },
            assignRecordsToSymbols: function () {
                const that = this;
                const uncategorizedSymbol = this.getUncategorizedSymbolModel();

                this.dataCollection.each(function (recordModel) {
                    var matched = false;
                    that.symbolModels.each(function (symbolModel) {
                        if (symbolModel.checkModel(recordModel)) {
                            symbolModel.addModel(recordModel);
                            matched = true;
                        }
                    })
                    if (!matched) {
                        uncategorizedSymbol.addModel(recordModel);
                    }
                });
            },
            assignRecordToSymbol: function (recordModel) {
                console.log('add record to symbol');
                var symbolView;
                this.children.each(function (view) {
                    if (view.model.checkModel(recordModel)) {
                        symbolView = view;
                        return;
                    }
                })
                if (!symbolView) {
                    symbolView = this.children.findByModel(
                        this.getUncategorizedSymbolModel()
                    );
                }
                symbolView.model.addModel(recordModel);
                //symbolView.render();
            },
            reAssignRecordToSymbols: function(recordModel) {
                var matched = false;
                const uncategorizedSymbol = this.getUncategorizedSymbolModel();
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
                    if (!this.model.get('metadata').isContinuous) {
                        this.createNewSymbol(this.symbolModels, recordModel);
                    } else {
                        uncategorizedSymbol.addModel(recordModel);
                    }
                }

                this.removeEmptySymbols(this.symbolModels);

                this.updatePalette(this.symbolModels);
                this.saveChanges();
            },

            updatePalette: function(symbolCollection) {
                const paletteId = this.model.get('metadata').paletteId;
                
                // don't count the uncategorized symbol
                const symbolCount = symbolCollection.length  - 1;
                const lgPalettes = new LGPalettes();
                const palette = lgPalettes.getPalette(paletteId, symbolCount, 'categorical');

                symbolCollection.each((symbol, i) => {
                    if (symbol.get('rule') !== '¯\\_(ツ)_/¯') {
                        symbol.set('fillColor', "#" + palette[i % 8]);
                    }
                });
            },

            removeEmptySymbols: function(collection) {  
                collection.each(function(symbol) {
                    if (symbol.matchedModels.length === 0) {
                        collection.remove(symbol);
                    }
                });
            },
            createNewSymbol: function(symbolCollection, record) {
                const category = record.get(this.model.get('metadata').currentProp);                
                // Don't worry about giving it a fill color right now
                // Once the new symbol is added, we will update the pallette for the entire symbol set
                let symbolId = symbolCollection.length;
                let symbol = Symbol.createCategoricalSymbol(category, this.model)

                if (symbol.checkModel(record)) {
                    symbol.addModel(record);
                }
                
                symbolCollection.add(symbol, { at: symbolCollection.length - 1 });
                console.log(symbolCollection);
            },

             // returns a default value if the input value from the dom is undefined
            // needed because simply using '||' for defaults is buggy
            defaultIfUndefined: function (domValue, defaultValue) {
                if (domValue === undefined) {
                    return defaultValue;
                } else {
                    return domValue;
                }
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
            deleteLayer: function () {
                if (!confirm("Are you sure you want to delete this layer?")) {
                    return;
                }
                this.model.destroy();
            },

            updateTitle: function (title) {
                this.model.set("title", title);
                this.render();
            },
            showStyleByMenu: function (event) {
                const coords = {
                    x: event.clientX,
                    y: event.clientY
                }
                this.app.vent.trigger('show-style-menu', this.model, coords);
            },

            editLayerName: function() {

                var editLayerNameModal = new EditLayerName({
                    app: this.app,
                    model: this.model
                });

                this.modal.update({
                    app: this.app,
                    class: "edit-layer-name",
                    view: editLayerNameModal,
                    title: 'Edit Layer Name',
                    width: 400,
                    //height: 200,
                    saveButtonText: "Save",
                    closeButtonText: "Cancel",
                    showSaveButton: true,
                    saveFunction: editLayerNameModal.saveLayer.bind(editLayerNameModal),
                    showDeleteButton: false
                });
                this.modal.show();

            },

            showLayerMenu: function(event) {
                console.log('show layer menu');
                const coords = {
                    x: "110px",
                    y: event.clientY
                }
                this.$el.find('.layer-menu').css({top: event.clientY - 30, left: "110px"});
                this.$el.find('.layer-menu').toggle();

                if (event) {
                    event.stopPropagation();
                }
            },

            hideLayerMenu: function(e) {
                var $el = $(e.target);
                console.log('hide: ', $el);
                if ($el.hasClass('layer-menu') || $el.hasClass('add-record-container')) {
                    console.log('return');
                    return
                } else if (this.$el.find('.layer-menu').css('display') === 'block') {
                    this.$el.find('.layer-menu').toggle();
                } else if (this.$el.find('.geometry-options').css('display') === 'block') {
                    console.log('toggle geom dropdown');
                    this.$el.find('.geometry-options').toggle();
                    //this.$el.find('.add-record-container').css({background: '#fafafc'});
                }
            },

            editDisplayField: function() {
                console.log(this.model);

                var editDisplayFieldModal = new EditDisplayField({
                    app: this.app,
                    model: this.model
                });

                this.modal.update({
                    app: this.app,
                    class: "edit-display-field",
                    view: editDisplayFieldModal,
                    title: 'Display Field',
                    width: 400,
                    //height: 200,
                    saveButtonText: "Save",
                    closeButtonText: "Cancel",
                    showSaveButton: true,
                    saveFunction: editDisplayFieldModal.saveLayer.bind(editDisplayFieldModal),
                    showDeleteButton: false
                });
                this.modal.show();
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
                console.log('adding highlight class');
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

            displayGeometryOptions: function(e) {
                const target = this.$el.find('.add-record-container')[0];
                
                this.$el.find('.geometry-options').css({top: target.y -15, left: target.x - 200});
                if (this.$el.find('.geometry-options').css('display') === "block") {
                    this.$el.find('.geometry-options').css({display: 'none'})
                } else {
                    this.$el.find('.geometry-options').css({display: 'block'});
                }

            },

            notifyDrawingManager: function (e, mode) {
                this.app.vent.trigger(mode, this.cid, e);
                this.app.vent.trigger('hide-detail');
                this.$el.find('.geometry-options').toggle();
                e.preventDefault();
            },

            initAddPoint: function (e) {
                this.notifyDrawingManager(e, 'add-point');
            },
            initAddPolygon: function(e) {
                this.notifyDrawingManager(e, 'add-polygon');
            },
            initAddPolyline: function(e) {
                this.notifyDrawingManager(e, 'add-polyline');
            },

            getMarkerOverlays: function () {
                const markerOverlays = this.children.map(view => view.getMarkerOverlays());
                if (markerOverlays.length > 0) {
                    return markerOverlays.reduce((a, b) => a.concat(b));
                }
                return [];
            },
            getBounds: function () {
                var bounds = new google.maps.LatLngBounds();
                this.getMarkerOverlays().forEach(overlay => {
                    bounds.union(overlay.getBounds());
                })
                return bounds;
            },
            zoomToExtents: function (e) {
                var bounds = this.getBounds();
                if (!bounds.isEmpty()) {
                    this.app.map.fitBounds(bounds);
                }
                if (e) { e.preventDefault(); }
            },

            saveChanges: function() {
                this.model.save();
            }
        });
        return LayerListChild;
    });
