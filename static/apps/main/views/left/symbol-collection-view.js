define(["jquery",
        "marionette",
        "handlebars",
        "text!../../templates/left/symbol-set.html",
        "collections/records",
        "collections/symbols",
        "apps/main/views/left/symbol-item-view"
    ],
    function ($, Marionette, Handlebars, LayerItemTemplate, Records, Symbols, SymbolItemView) {
        'use strict';
        /**
         * In this view, this.model = Symbol, this.collection = matching Records
         * (One symbol-view is instantiated for each Symbol object).
         * (A symbol-view will display all the markers that match its rules/criteria)
         */
        var SymbolCollectionView =  Marionette.CompositeView.extend({
            initialize: function (opts) {
                this.collection = this.model.getModels();
                console.log(this.collection);
                _.extend(this, opts);
                if (this.model.get('isShowing')) {
                    this.showOverlays();
                }
            },
            childViewContainer: '.symbol',
            childView: SymbolItemView,
            childViewOptions: function (model, index) {
                return {
                    app: this.app,
                    parent: this
                };
            },
            events: {
                //edit event here, pass the this.model to the right panel
                'click .layer-delete' : 'deleteLayer',
                'click .symbol-edit': 'showSymbolEditMenu',
                'click .symbol-display': 'showHideOverlays'
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
            onRender: function() {
                if(!this.model.get('isShowing')) {
                    this.$el.addClass('half-opac');
                }
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
                    data_source: this.layer.get('data_source'),
                    isIndividual: this.layer.get('group_by') === 'individual'
                }
            },

            saveAndRender: function () {
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
                this.children.each(view => {
                    if (view.overlay !== null) {
                        view.overlay.show();
                    }
                })
            },

            hideOverlays: function () {
                this.children.each(view => {
                    if (view.overlay !== null) {
                        view.overlay.hide();
                    }
                })
            },

            deleteOverlays: function () {
                console.log('delete overlays');
                this.children.each(view => {
                    if (view.overlay !== null) {
                        view.overlay.remove();
                    }
                })
            },
            showHideOverlays: function () {
                this.model.set("isShowing", !this.$el.find('.symbol-display').hasClass('fa-eye'));
                
                
                if(this.model.get('isShowing')) {
                    this.$el.removeClass('half-opac');
                    this.$el.find('.symbol-display').removeClass('fa-eye-slash');
                    this.$el.find('.symbol-display').addClass('fa-eye');
                } else {
                    this.$el.addClass('half-opac');
                    this.$el.find('.symbol-display').removeClass('fa-eye');
                    this.$el.find('.symbol-display').addClass('fa-eye-slash');
                }
            },
            onDestroy: function() {
                console.log('destroy symbol collection view');
            }

        });
        return SymbolCollectionView;
    });
