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
                    fillOpacity: this.opacityToPercent(this.model.get('fillOpacity')),
                    strokeOpacity:  this.opacityToPercent(this.model.get('strokeOpacity')),
                    id: "cp" + this.model.get('id'),
                    metadata: this.model,
                    shape: this.model.get('shape'),
                    count: len,
                    isIndividual: this.layer.isIndividual(),
                    items: len === 1 ? 'item' : 'items'
                };
            },

            // for display purposes. Converts and opacity value (0.0 — 1.0) to a percentage (0% — 100%) 
            opacityToPercent: function(val) {
                return (val * 100) + '%'; 
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
                    this.updateLayerIfUniform(prop, color, this.layer);
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
                this.updateLayerIfUniform('shape', shape, this.layer);
            },

            updateLayerSymbols: function () {
                this.layer.save();
                this.render();
            },

            updateOpacity: function (e) {
                let opacity = parseFloat($(e.target).val())/100;
                if (opacity > 1) {
                    opacity = 1;
                    this.$el.find('#marker-opacity').val(this.opacityToPercent(opacity));
                } else if (opacity < 0 ) {
                    opacity = 0;
                    this.$el.find('#marker-opacity').val(this.opacityToPercent(opacity));
                }
                this.model.set("fillOpacity", opacity);
                this.updateLayerIfUniform('fillOpacity', opacity, this.layer);
            },

            updateStrokeWidth: function(e) {
                const strokeWeight = parseFloat($(e.target).val())
                this.model.set("strokeWeight", strokeWeight);
                this.updateLayerIfUniform('strokeWeight', strokeWeight, this.layer);
            },

            updateStrokeOpacity: function(e) {
                var opacity = parseFloat($(e.target).val())/100;
                if (opacity > 1) {
                    opacity = 1;
                    this.$el.find('#stroke-opacity').val(this.opacityToPercent(opacity));
                } else if (opacity < 0 ) {
                    opacity = 0;
                    this.$el.find('#stroke-opacity').val(this.opacityToPercent(opacity));
                }
                this.model.set("strokeOpacity", opacity);
                this.updateLayerIfUniform('strokeOpacity', opacity, this.layer);
            },

            updateSize: function(e) {
                var width = parseInt($(e.target).val());
                this.model.set('width', width);
                this.updateLayerIfUniform('width', width, this.layer);
            },
            
            updateLayerIfUniform: function(key, value, layer) {
                console.log('updateLayerIfUniform', key, value, layer);
                if (layer.isUniform()) {
                    console.log('layer is uniform');
                    let cloneOfMetadata = JSON.parse(JSON.stringify(layer.get('metadata')));
                    cloneOfMetadata[key] = value;
                    //layer.get('metadata')[key] = value;
                    layer.set('metadata', cloneOfMetadata);
                    console.log(layer.get('metadata'));
                    layer.save();
                }
            }

        });
        return MarkerStyleChildView;
    });
