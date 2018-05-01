define(["marionette",
        "handlebars",
        "text!../../templates/left/layer-item.html",
        "models/symbol",
        "models/record",
        "apps/main/views/left/symbol-collection-view",
        "apps/main/views/left/edit-layer-name-modal-view",
        "apps/main/views/left/edit-display-field-modal-view",
        "lib/maps/overlays/icon"
    ],
    function (Marionette, Handlebars, LayerItemTemplate, Symbol, Record, SymbolView, EditLayerName, EditDisplayField, Icon) {
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
                'click #select-point': 'selectPoint',
                'click #select-polygon': 'selectPolygon',
                'click #select-polyline': 'selectPolyline',
                'click .add-record': 'addPoint',
                'click .add-polyline_svg': 'addPolyline',
                'click .add-polygon_svg': 'addPolygon',
                'click .zoom-to-extents': 'zoomToExtents'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                console.log(this.model.toJSON());
                this.symbolModels = this.collection;
                this.modal = this.app.modal;
                this.listenTo(this.dataCollection, 'add', this.assignRecordToSymbol)
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

            addRecord: function() {
                let recordModel = new Record({
                    'overlay_type': this.model.get('dataset').overlay_type,
                    "project_id": this.app.dataManager.getProject().id,
                    "form": this.model.get('dataset'),
                    "owner": this.model.get('owner'),
                    'geometry': null,
                    "fillColor": '#ed867d'
                });
                this.dataCollection.add(recordModel);
                return recordModel;
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
                console.log('display goem opts');
                var $el = $(e.target);
                //this.$el.find('.add-record-container').css({background: '#bbbbbb'});
                console.log(this.$el.find('.geometry-options').css('display'));
                if (this.$el.find('.geometry-options').css('display') === "block") {
                    console.log('hide');
                    this.$el.find('.geometry-options').css({display: 'none'})
                } else {
                    console.log('show');
                    this.$el.find('.geometry-options').css({display: 'block'});
                }

            },

            selectPoint: function(e) {
                var that = this, MouseMover, $follower, mm;
                MouseMover = function ($follower) {

                    this.generateIcon = function () {
                        var template, shape;
                        template = Handlebars.compile('<svg viewBox="{{ viewBox }}" width="{{ width }}" height="{{ height }}">' +
                            '    <path fill="{{ fillColor }}" paint-order="stroke" stroke-width="{{ strokeWeight }}" stroke-opacity="0.5" stroke="{{ fillColor }}" d="{{ path }}"></path>' +
                            '</svg>');
                        shape = that.model.get("overlay_type");
                        // If clicking an add new and click on marker, there is no overlay_type found
                        //*
                        // If outside, then save the model
                        // and add it to the end of the list so the marker
                        // so that new markers can be added seamlessly
                        if (shape.indexOf("form_") != -1) {
                            shape = "marker";
                        }
                        //*/
                        else {
                            //console.log("The current form of adding marker on empty form is buggy");
                        }
                        that.icon = new Icon({
                            shape: shape,
                            strokeWeight: 6,
                            fillColor: that.model.collection.fillColor,
                            width: that.model.collection.size,
                            height: that.model.collection.size
                        }).generateGoogleIcon();
                        that.icon.width *= 1.5;
                        that.icon.height *= 1.5;
                        $follower.html(template(that.icon));
                        $follower.show();
                    };
                    this.start = function () {
                        this.generateIcon();
                        $(window).bind('mousemove', this.mouseListener);
                    };
                    this.stop = function (event) {
                        $(window).unbind('mousemove');
                        $follower.remove();
                        that.app.vent.trigger("place-marker", {
                            x: event.clientX,
                            y: event.clientY
                        });
                    };
                    this.mouseListener = function (event) {
                        $follower.css({
                            top: event.clientY - that.icon.height * 3 / 4 + 4,
                            left: event.clientX - that.icon.width * 3 / 4
                        });
                    };
                };
                //Instantiate Class and Add UI Event Handlers:
                $follower = $('<div id="follower"></div>');
                $('body').append($follower);
                mm = new MouseMover($follower);
                $(window).mousemove(mm.start.bind(mm));
                $follower.click(mm.stop);

                this.app.vent.trigger("add-new-marker", this.addRecord());
                this.$el.find('.geometry-options').toggle();
                e.preventDefault();
            },
            selectPolygon: function(e) {
                this.app.vent.trigger('add-polygon', this.addRecord());
                this.$el.find('.geometry-options').toggle();
                e.preventDefault();
            },
            selectPolyline: function(e) {
                this.app.vent.trigger('add-polyline', this.addRecord());
                this.$el.find('.geometry-options').toggle();
                e.preventDefault();
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
                console.log(this.model.toJSON());
                //return;
                this.model.save();
            }
        });
        return LayerListChild;
    });
