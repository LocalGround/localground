define(["marionette",
        "handlebars",
        "text!../../templates/left/layer-item.html",
        "models/symbol",
        "models/record",
        "apps/main/views/left/symbol-collection-view",
        "apps/main/views/left/edit-layer-name-modal-view",
        "apps/main/views/left/edit-display-field-modal-view",
    ],
    function (Marionette, Handlebars, LayerItemTemplate, Symbol, Record, SymbolView, EditLayerName, EditDisplayField) {
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
                'click .edit-display-field': 'editDisplayField'
            },
            childEvents: {
                'isShowing:changed': function () {
                    console.log('visibilityChanged!');
                    this.handleChildShowHide();
                }
            },
            initialize: function (opts) {
                _.extend(this, opts);
                console.log(this.model);
                this.symbolModels = this.collection;
                this.modal = this.app.modal;
                this.listenTo(this.dataCollection, 'add', this.assignRecordToSymbol)
                if (!this.model || !this.collection || !this.dataCollection) {
                    console.error("model, collection, and dataCollection are required");
                    return;
                }
                this.assignRecordsToSymbols();
                this.model.get('metadata').isShowing = this.allSymbolsAreDisplaying(this.collection);

                $('body').click($.proxy(this.hideLayerMenu, this));
            },
            template: Handlebars.compile(LayerItemTemplate),
            templateHelpers: function () {
                return {
                    name: this.dataCollection.name,
                    isChecked: this.model.get("metadata").isShowing
                };
            },

            childView: SymbolView,
            // getChildView: function() {
            //     if (this.model.get('group_by') === 'individual') {
            //         return IndividualSymbolView;
            //     } else {
            //         return SymbolView;
            //     }
            // },
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

            editLayerName: function() {
                console.log('edit layer name');

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
                if ($el.hasClass('layer-menu')) {
                    return
                } else {
                    if (this.$el.find('.layer-menu').css('display') === 'block')
                    this.$el.find('.layer-menu').toggle();
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
                    //childView.redrawOverlays();
                    childView.render();
                })
                // if (isShowing) {
                //     this.$el.find('#symbols-list').show()
                // } else {
                //     this.$el.find('#symbols-list').hide()
                // }
                this.saveChanges();
                //this.$el.find('#symbol-list').toggle();
            },

            handleChildShowHide: function () {
                this.model.get('metadata').isShowing = this.allSymbolsAreDisplaying();
            
                this.saveChanges();
                this.toggleCheckbox();
                //this.render(); //too expensive
            },

            toggleCheckbox: function () {
                const symbolsShowing = this.collection.filter(model => {
                    return model.get('isShowing');
                });
                if (symbolsShowing.length > 0 && symbolsShowing.length < this.collection.length) {
                    this.$el.find('#cb' + this.model.id)[0].indeterminate = true;
                } else {
                    this.$el.find('#cb' + this.model.id)[0].indeterminate = false;
                    this.$el.find('.layer-isShowing').prop('checked', this.model.get('metadata').isShowing);
                }
            },

            // deprecated
            allSymbolsAreDisplaying: function(collection) {
                var isShowing = true;
                this.collection.each( model => {
                    isShowing = isShowing && (
                        model.get("isShowing") || model.getModelsJSON().length === 0
                    );
                });
                return isShowing;
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
                    this.$el.find('.collapse').removeClass('fa-angle-up');
                    this.$el.find('.collapse').addClass('fa-angle-down');
                } else {
                    this.model.get('metadata').collapsed = true;
                    this.$el.find('.symbol').css('height', 0);
                    this.$el.find('.symbol-item').css('display', 'none');
                    this.$el.find('.collapse').removeClass('fa-angle-down');
                    this.$el.find('.collapse').addClass('fa-angle-up');
                }
            },

            saveChanges: function() {
                this.model.save();
            }
        });
        return LayerListChild;
    });
