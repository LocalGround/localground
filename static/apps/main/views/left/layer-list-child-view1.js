define(["marionette",
        "handlebars",
        "text!../../templates/left/layer-item.html",
        "models/symbol",
        "models/record",
        "apps/main/views/left/symbol-view",
    ],
    function (Marionette, Handlebars, LayerItemTemplate, Symbol, Record, SymbolView) {
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
                'change:group_by': 'updateGroupBy'
            },
            events: {
                //edit event here, pass the this.model to the right panel
                'click #fakeadd': 'addFakeModel',
                'click .layer-delete' : 'deleteLayer',
                'change .layer-isShowing': 'showHideOverlays',
                'click #layer-style-by span': 'showStyleByMenu'
            },
            childEvents: {
                'isShowing:changed': function () {
                    console.log('visibilityChanged!');
                    this.handleChildShowHide();
                }
            },
            initialize: function (opts) {
                _.extend(this, opts);
                console.log('Initializing LayerListChildView:', this.model.get("title"));
                this.symbolModels = this.collection;
                this.listenTo(this.dataCollection, 'add', this.assignRecordToSymbol)
                if (!this.model || !this.collection || !this.dataCollection) {
                    console.error("model, collection, and dataCollection are required");
                    return;
                }
                this.assignRecordsToSymbols();
                this.model.get('metadata').isShowing = this.allSymbolsAreDisplaying(this.collection);
            },
            template: Handlebars.compile(LayerItemTemplate),
            templateHelpers: function () {
                return {
                    name: this.dataCollection.name,
                    isChecked: this.model.get("metadata").isShowing
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
                    collection: this.collection,
                    layerId: this.model.id,
                    layer: this.model
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
                symbolView.render();
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
            showHideOverlays: function () {
                const isShowing = this.$el.find('input').prop('checked');

                this.model.get("metadata").isShowing = isShowing;

                this.children.each(function(childView) {
                    var symbol = childView.model;

                    //if childView already matches parent, do nothing; iterate:
                    if (symbol.get("isShowing") === isShowing) {
                        return;
                    }

                    // otherwise, set flag, toggle, render, and save:
                    symbol.set('isShowing', isShowing);
                    childView.redrawOverlays();
                    childView.render();
                })
                this.saveChanges();
            },

            handleChildShowHide: function () {
                this.model.get('metadata').isShowing = this.allSymbolsAreDisplaying();
                this.saveChanges();
                this.toggleCheckbox();
                //this.render(); //too expensive
            },
            toggleCheckbox: function () {
                this.$el.find('.layer-isShowing').prop('checked', this.model.get('metadata').isShowing);
            },
            allSymbolsAreDisplaying: function(collection) {
                var isShowing = true;
                this.collection.each( model => {
                    isShowing = isShowing && (
                        model.get("isShowing") || model.getModelsJSON().length === 0
                    );
                });
                return isShowing;
            },

            saveChanges: function() {
                this.model.save();
            }
        });
        return LayerListChild;
    });
