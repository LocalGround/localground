define(["jquery",
        "marionette",
        "handlebars",
        "text!../../templates/left/symbol-set.html",
        "collections/records",
        "collections/symbols",
        "apps/main/views/left/symbol-item-view",
        "apps/main/views/right/symbol-style-menu-view"
    ],
    function ($, Marionette, Handlebars, LayerItemTemplate, Records,
            Symbols, SymbolItemView, SymbolStyleMenuView) {
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
                this.popover = this.app.popover;
                if (this.model.get('isShowing')) {
                    this.showOverlays();
                }
                this.model.set('active', false);
            },

            emptyView: Marionette.ItemView.extend({
                className: 'symbol-item marker-container',
                initialize: function (opts) {
                    _.extend(this, opts);
                    var templateHTML = `<div>
                        No markers matching: {{ rule }}
                    </div>`
                    this.template = Handlebars.compile(templateHTML);
                },
                templateHelpers: function () {
                    return this.parent.model.toJSON()
                }
            }),
            renderSVG: function () {
                const icon = this.model.get('icon');
                return `<svg viewBox="${icon.viewBox}" width="23" height="23">
                    <path fill="${icon.fillColor}" stroke-linejoin="round"
                        stroke-linecap="round" paint-order="stroke"
                        stroke-width="2" stroke="#e7e7e7" d="${icon.path}">
                    </path>
                </svg>`
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
                'click .symbol-display': 'showHideOverlays',
                'mouseenter .symbol-edit': 'highlightSymbolContent',
                'mouseleave .symbol-edit': 'unHighlightSymbolContent'
            },
            modelEvents: function () {
                const events = {
                    'change:isShowing': 'redrawOverlays',
                    'change:title': 'render',
                    'change:active': 'handleSymbolHighlight'
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
                const title = this.model.get('title')
                name = this.collection.name;
                return {
                    empty: this.model.getModelsJSON().length === 0,
                    name: name,
                    icon: this.model.get('icon'),
                    markerList: this.model.getModelsJSON(),
                    property: title === '*' ? 'all ' + name : title,
                    isChecked: this.model.get("isShowing"),
                    layer_id: this.layerId,
                    map_id: this.mapId,
                    dataset: this.layer.get('dataset'),
                    isIndividual: this.layer.get('group_by') === 'individual',
                    svgIcon: this.renderSVG()
                }
            },

            saveAndRender: function () {
                this.layer.save();
                // doing a partial re-render so that the style popover doesn't
                // get blown away:
                // 1. re-render all child views:
                this._renderChildren();
                // 2. partial update of parent SVG:
                this.$el.find('svg').replaceWith(this.renderSVG());
                this.$el.find('.symbol-wrapper').css(
                    'background', this.model.get('icon').fillColor);
            },

            showSymbolEditMenu: function (event) {
                this.symbolMenu = new SymbolStyleMenuView({
                    app: this.app,
                    layer: this.layer,
                    model: this.model
                });
                this.popover.update({
                    $source: this.$el.find('.symbol-header'),
                    view: this.symbolMenu,
                    placement: 'right',
                    width: '250px',
                    height: '150px',
                    offsetX: '-30px',
                    title: 'Symbol Properties'
                });
                this.popover.show();
            },

            showOverlays: function () {
                this.children.each(view => {
                    if (view.overlay) {
                        view.overlay.show();
                    }
                })
            },

            hideOverlays: function () {
                this.children.each(view => {
                    if (view.overlay) {
                        view.overlay.hide();
                    }
                })
            },

            deleteOverlays: function () {
                console.log('delete overlays');
                this.children.each(view => {
                    if (view.overlay) {
                        view.overlay.remove();
                    }
                })
            },
            getMarkerOverlays: function () {
                // returns all child MarkerOverlays
                // (and handles views w/o overlays):
                return this.children.filter(itemView => itemView.overlay)
                    .map(itemView => itemView.overlay);
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

            handleSymbolHighlight: function() {
                if (this.model.get('active')) {
                    this.highlightSymbolContent();
                } else {
                    this.unHighlightSymbolContent();
                }
            },

            highlightSymbolContent: function () {
                console.log('HOVER, add color');
                this.$el.find('.symbol-wrapper').addClass('symbol-highlight');
            },
            unHighlightSymbolContent: function () {

                if (this.model.get('active')) {
                     // don't allow a hover event to affect highlighting if the symbol is active
                     // (i.e. if it is currently being edited)
                    return;
                }

                console.log('HOVER, remove color');
                this.$el.find('.symbol-wrapper').removeClass('symbol-highlight');
            },
            onDestroy: function() {
                console.log('destroy symbol collection view');
            }

        });
        return SymbolCollectionView;
    });
