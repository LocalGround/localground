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
                this.collapseSymbols();
                

                $('body').click($.proxy(this.hideLayerMenu, this));
            },

            onRender: function() {
                this.showHideOverlays(null, this.model.get("metadata").isShowing);
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
                    this.$el.find('#symbols-list').show()
                } else {
                    this.$el.find('#symbols-list').hide()
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
