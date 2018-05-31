define(["marionette",
        "handlebars",
        "text!../../templates/left/layer-item.html",
        "collections/symbols",
        "models/symbol",
        "models/record",
        "apps/main/views/left/symbol-collection-view",
        "apps/main/views/left/edit-layer-menu",
        "apps/main/views/right/marker-style-view",
        "apps/main/views/left/add-marker-menu"
    ],
    function (Marionette, Handlebars, LayerItemTemplate, Symbols, Symbol, Record,
            SymbolView, EditLayerMenu, MarkerStyleView, AddMarkerMenu) {
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
                'reset': 'reRender',
                'remove': 'reRenderIfEmpty'
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
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.popover = this.app.popover;
                this.modal = this.app.modal;
                this.symbolModels = this.collection;
                if (!this.model || !this.collection || !this.dataCollection) {
                    console.error("model, collection, and dataCollection are required");
                    return;
                }

                this.newMarkerType = 'point';

                this.symbolModels.assignRecords(this.dataCollection);
                this.reAssignRecordsToSymbols();
                this.model.get('metadata').collapsed = false;
                this.model.removeEmptySymbols();

                this.attachRecordEventHandlers();
            },
            attachRecordEventHandlers: function () {
                this.listenTo(this.dataCollection, 'add', this.reRenderOrAssignRecordToSymbol)
                this.listenTo(this.dataCollection, 'update-symbol-assignment', this.reAssignRecordToSymbols)
                this.listenTo(this.app.vent, 'geometry-created', this.addRecord);
                this.listenTo(this.app.vent, 'record-has-been-deleted', this.removeEmptySymbols);
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
                    hasData: !this.isEmpty()
                };
            },
            childView: SymbolView,
            isEmpty: function (options) {
                //override native Marionette isEmpty method:
                return this.dataCollection.length === 0;
            },
            emptyViewOptions: function () {
                return {
                    app: this.app,
                    parent: this
                };
            },

            getEmptyView: function () {
                return Marionette.ItemView.extend({
                    className: 'symbol-item marker-container',
                    initialize: function (opts) {
                        _.extend(this, opts);
                        var templateHTML = `<div>
                            'Dataset Empty!!!'
                        </div>`
                        this.template = Handlebars.compile(templateHTML);
                    },
                    templateHelpers: function () {
                        return this.parent.model.toJSON()
                    }
                });
            },

            childViewContainer: "#symbols-list",

            reRender: function () {
                console.log('Symbols have been regenerated...');
                this.symbolModels.assignRecords(this.dataCollection);
            },
            reRenderIfEmpty: function () {
                console.log('Symbol has been removed');
                if (this.model.isEmpty()) {
                    this.render();
                }
            },
            updateGroupBy: function () {
                this.$el.find('.layer-style-by span').html(
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
                //don't create the child view for uncategorized w/no children:
                if (!symbolModel.hasModels() && symbolModel.isUncategorized()) {
                    return null;
                }
                return Marionette.CollectionView.prototype.addChild.call(this, symbolModel, ChildView, index);
            },
            removeEmptySymbols: function () {
                this.model.removeEmptySymbols();
            },
            reRenderOrAssignRecordToSymbol: function (recordModel) {
                const symbol = this.symbolModels.assignRecord(recordModel);
                if (this.dataCollection.length === 1) {
                    this.render();
                    return;
                }
                if (symbol.matchedModels.length === 1) {
                    this.addChild(symbol, this.childView, this.symbolModels.length);
                }
            },

            reAssignRecordsToSymbols: function() {
                this.dataCollection.each((recordModel) => {
                    this.reAssignRecordToSymbols(recordModel);
                });
            },

            reAssignRecordToSymbols: function(recordModel) {
                if (this.model.isUniform() || this.model.isIndividual()) {
                    return;
                }
                var matched = false;
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
                        this.symbolModels.appendNewSymbol({
                            recordModel: recordModel,
                            layerModel: this.model,
                            metadata: this.model.get('metadata')
                        });
                    } else {
                        this.handleUnmatchedRecord(recordModel);
                    }
                }
                this.model.removeEmptySymbols();
                this.saveChanges();
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
                if (this.isEmpty()) {
                    return;
                }
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
                } else {
                    this.$el.addClass('hide-layer');
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
