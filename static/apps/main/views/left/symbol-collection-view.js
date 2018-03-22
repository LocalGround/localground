define(["jquery",
        "marionette",
        "handlebars",
        'lib/maps/marker-overlays',
        "text!../../templates/left/symbol-set.html",
        "collections/records",
        "collections/symbols",
        "apps/main/views/left/symbol-item-view"
    ],
    function ($, Marionette, Handlebars, MarkerOverlays, LayerItemTemplate, Records, Symbols, SymbolItemView) {
        'use strict';
        /**
         * In this view, this.model = Symbol, this.collection = matching Records
         * (One symbol-view is instantiated for each Symbol object).
         * (A symbol-view will display all the markers that match its rules/criteria)
         */
        var SymbolCollectionView =  Marionette.CompositeView.extend({
            initialize: function (opts) {
                this.collection = this.model.getModels();
                _.extend(this, opts);
                this.createMarkerOverlays();
                if (this.model.get('isShowing')) {
                    this.showOverlays();
                }
                console.log('Collection:', this.collection);
            },
            childViewContainer: '.symbol',
            childView: SymbolItemView,
            childViewOptions: function (model, index) {
                return {
                    app: this.app
                };
            },
            events: {
                //edit event here, pass the this.model to the right panel
                'click .layer-delete' : 'deleteLayer',
                'click .symbol-edit': 'showSymbolEditMenu',
                'change .symbol-isShowing': 'showHideOverlays'
            },
            modelEvents: function () {
                const events = {
                    'change:isShowing': 'redrawOverlays',
                    'change:title': 'render'
                };
                [
                    'fillColor', 'strokeColor', 'shape', 'width', 'markerSize',
                    'fillOpacity', 'strokeWeight'
                ].forEach(attr => {
                    events[`change:${attr}`] = 'saveAndRender';
                })
                return events;
            },
            redrawOverlays: function () {
                if (this.model.get("isShowing")) {
                    this.showOverlays();
                } else {
                    this.hideOverlays();
                }
            },
            template: Handlebars.compile(LayerItemTemplate),
            tagName: "div",
            templateHelpers: function () {
                const rule = this.model.get('rule')
                name = this.collection.name;
                return {
                    empty: this.model.getModelsJSON().length === 0,
                    name: name,
                    icon: this.model.get('icon'),
                    markerList: this.model.getModelsJSON(),
                    property: rule === '*' ? 'all ' + name : rule,
                    isChecked: this.model.get("isShowing"),
                    layer_id: this.layerId,
                    map_id: this.mapId,
                    data_source: this.layer.get('data_source')
                }
            },

            createMarkerOverlays: function() {
                this.markerOverlays = new MarkerOverlays({
                    collection: this.model.getModels(),
                    app: this.app,
                    isShowing: this.model.get('isShowing'),
                    displayOverlays: this.model.get('isShowing'),
                    model: this.model
                });
            },

            saveAndRender: function () {
                console.log('save and render...');
                this.layer.save();
                this.render();
            },

            showSymbolEditMenu: function (event) {
                const coords = {
                    x: event.clientX,
                    y: event.clientY
                }
                this.app.vent.trigger('show-symbol-menu', this.model, coords, this.layerId);
            },
            showOverlays: function () {
                this.markerOverlays.showAll();
            },

            hideOverlays: function () {
                this.markerOverlays.hideAll();
            },

            deleteOverlays: function () {
                _.each(this.markerOverlayList, function (overlays) {
                    overlays.remove();
                });
            },
            showHideOverlays: function () {
                this.model.set("isShowing", this.$el.find('input').prop('checked'));
                this.trigger('isShowing:changed'); //notify parent layer
            },
            onDestroy: function () {
                this.markerOverlays.destroy();
            }
        });
        return SymbolCollectionView;
    });
