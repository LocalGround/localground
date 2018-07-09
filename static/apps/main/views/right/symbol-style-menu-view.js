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
            onRender: function () {
                var that = this,
                    fillColor = this.model.get('fillColor'),
                    strokeColor = this.model.get('strokeColor'),
                    id = this.model.get('id');

                //new color picker is added to the dom each time the icon is clicked,
                //so we remove the previous color picker with each additional click.
                //for this reason, each marker's picker needs to be uniquely identified
                $(".marker-fill-color-picker").remove();
                this.fillPicker = this.$el.find('#fill-color-picker').ColorPicker({
                    color: fillColor,
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(200);
                        return false;
                    },
                    onHide: function (colpkr) {
                        if (that.model.get('fillColor') !== fillColor) {
                            that.updateFillColor(fillColor);
                        }
                        $(colpkr).fadeOut(200);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        fillColor = "#" + hex;
                    }
                });
                $(".colorpicker:last-child").addClass('marker-fill-color-picker');

                $(".marker-stroke-color-picker").remove();
                this.strokePicker = this.$el.find('#stroke-color-picker').ColorPicker({
                    color: strokeColor,
                    onShow: function (colpkr) {
                        //console.log(strokeColor);
                        $(colpkr).fadeIn(200);
                        return false;
                    },
                    onHide: function (colpkr) {
                        if(that.model.get('strokeColor') !== strokeColor) {
                            that.updateStrokeColor(strokeColor);
                        }
                        $(colpkr).fadeOut(200);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        strokeColor = "#" + hex;
                    }
                });
                $(".colorpicker:last-child").addClass('marker-stroke-color-picker');
            },

            updateSymbolTitle: function(e) {
                this.model.set('title', this.$el.find('.symbol-title-input').val());
            },
            selectText: function (e) {
                $(e.target).select();
            },

            updateFillColor: function (hex) {
                this.model.set("fillColor", hex);
                $('#fill-color-picker').css('background', hex);
            },

            updateStrokeColor: function (hex) {
                this.model.set("strokeColor", hex);
                $('#stroke-color-picker').css('background', hex);
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
