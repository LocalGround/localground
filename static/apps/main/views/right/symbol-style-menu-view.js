define(["jquery",
        "marionette",
        "handlebars",
        "lib/maps/icon-lookup",
        "apps/main/views/symbols/symbol-selection-layout-view",
        "text!../../templates/right/symbol-style-menu.html",
        'color-picker-eyecon'
    ],
    function ($, Marionette, Handlebars, IconLookup, IndSymbolLayoutView, SymbolStyleMenu) {
        'use strict';

        var MarkerStyleChildView = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
            },
            template: Handlebars.compile(SymbolStyleMenu),
            events: {
                'change #marker-width': 'updateSize',
                'change #marker-opacity': 'updateOpacity',
                'change #stroke-weight': 'updateStrokeWidth',
                'change #stroke-opacity': 'updateStrokeOpacity',
                'click .style-menu_shape-wrapper': 'updateShape',
                'focusout .symbol-title-input': 'updateSymbolTitle',
                'click .symbol-title-input': 'selectText'
            },
            modelEvents: function () {
                const events = {};
                [
                    'fillColor', 'strokeColor', 'shape', 'width', 'markerSize',
                    'fillOpacity', 'strokeOpacity', 'strokeWeight', 'title'
                ].forEach(attr => {
                    events[`change:${attr}`] = 'updateLayerSymbols';
                })
                return events;
            },

            tagName: "div",
            templateHelpers: function () {
                const len = (this.collection) ? this.collection.length : 1;
                return {
                    groupBy: this.groupBy,
                    icons: IconLookup.getIcons(),
                    fillOpacity: this.model.get("fillOpacity"),
                    id: "cp" + this.model.get('id'),
                    metadata: this.model,
                    shape: this.model.get('shape'),
                    count: len,
                    isIndividual: this.layer.isIndividual(),
                    items: len === 1 ? 'item' : 'items'
                };
            },
            initColorPicker: function (opts) {
                $('.' + opts.className).remove();
                this.$el.find('#' + opts.elementID).ColorPicker({
                   color: opts.color,
                   onShow: function (colpkr) {
                       $(colpkr).fadeIn(200);
                       return false;
                   },
                   onHide: (colpkr) => {
                       this.updateColor(opts.modelProperty, opts.color);
                       $('#' + opts.id).css('background', opts.color);
                       $(colpkr).fadeOut(200);
                       return false;
                   },
                   onChange: (hsb, hex, rgb) => {
                       opts.color = "#" + hex;
                   }
                });
                $(".colorpicker:last-child").addClass(opts.className);
            },
            onRender: function () {
                // fill colorpicker:
                this.initColorPicker({
                    className: 'marker-fill-color-picker',
                    elementID: 'fill-color-picker',
                    color: this.model.get('fillColor'),
                    modelProperty: 'fillColor'
                });

                // stroke colorpicker:
                this.initColorPicker({
                    className: 'marker-stroke-color-picker',
                    elementID: 'stroke-color-picker',
                    color: this.model.get('strokeColor'),
                    modelProperty: 'strokeColor'
                });
            },
            updateColor: function (prop, color) {
                if (this.model.get(prop)!== color) {
                    this.model.set(prop, color);
                }
            },
            updateSymbolTitle: function(e) {
                this.model.set('title', this.$el.find('.symbol-title-input').val());
            },
            selectText: function (e) {
                $(e.target).select();
            },

            updateShape: function (e) {
                const shape = e.currentTarget.dataset.shape;
                this.model.set('shape', shape);
            },

            updateLayerSymbols: function () {
                this.layer.save();
                this.render();
            },

            updateOpacity: function (e) {
                let opacity = parseFloat($(e.target).val());
                if (opacity > 1) {
                    opacity = 1;
                } else if (opacity < 0 ) {
                    opacity = 0;
                }
                this.model.set("fillOpacity", opacity);
            },

            updateStrokeWidth: function(e) {
                this.model.set("strokeWeight", parseFloat($(e.target).val()));
            },

            updateStrokeOpacity: function(e) {
                var opacity = parseFloat($(e.target).val());
                if (opacity > 1) {
                    opacity = 1;
                } else if (opacity < 0 ) {
                    opacity = 0;
                }
                this.model.set("strokeOpacity", opacity);
            },

            updateSize: function(e) {
                var width = parseInt($(e.target).val());
                this.model.set('width', width);
            }

        });
        return MarkerStyleChildView;
    });
