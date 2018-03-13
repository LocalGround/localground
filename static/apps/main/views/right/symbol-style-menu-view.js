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
                this.render();
            },
            template: Handlebars.compile(SymbolStyleMenu),
            events: {
                'change .marker-shape': 'updateShape',
                'click .selected-symbol-div': 'showSymbols',
                'click .symbol-style-menu_close': 'hideSymbolStyleMenu',
                'change #marker-width': 'updateSize',
                'change #marker-opacity': 'updateOpacity',
                'change #stroke-weight': 'updateStrokeWidth',
                'change #stroke-opacity': 'updateStrokeOpacity'
            },
            /*modelEvents: {
                'change': 'updateLayerSymbols'
            },*/

            tagName: "div",
            className: "table-row",
            templateHelpers: function () {
                return {
                    groupBy: this.groupBy,
                    icons: IconLookup.getIcons(),
                    fillOpacity: this.model.get("fillOpacity"),
                    id: "cp" + this.model.get('id'),
                    metadata: this.model
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
                        console.log(strokeColor);
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
            updateFillColor: function (hex) {
                this.model.set("fillColor", hex);
                $('#fill-color-picker').css('color', hex);
            },
            updateStrokeColor: function (hex) {
                this.model.set("strokeColor", hex);
                $('#stroke-color-picker').css('color', hex);
            },
            updateShape: function () {
                this.model.set("shape", this.$el.find('.marker-shape').val());
            },
            updateLayerSymbols: function () {
                //this.layer.setSymbol(this.model);
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
                console.log('updateSize')
                var width = parseInt($(e.target).val());
                console.log(this.model.get('width'), width);
                this.model.set('width', width);
            },
            updateSymbolAttribute: function(key, value) {
                this.model.set(key, value);
            },
            showSymbols: function() {
                this.indSymbolsView = new IndSymbolLayoutView({
                    app: this,
                    el: this.$el.find('#ind-symbol-dropdown')
                });
            },
            hideSymbolStyleMenu: function(e) {
                this.app.vent.trigger('hide-symbol-style-menu', e);
            },

            rebuildMarkersAndSave: function() {
                this.delayExecution("mapTimer", () => {
                    this.layer.trigger('rebuild-markers')
                }, 250);
                this.layer.save();
            },

            delayExecution: function (timeoutVar, func, millisecs) {
                /*
                 * This method applies a time buffer to whatever
                 * "func" function is passed in as an argument. So,
                 * for example, if a user changes the width value,
                 * and then changes it again before "millisecs"
                 * milliseconds pass, the new value will "reset the clock,"
                 * and the "func" function won't fire until the
                 * user stops changing the value.
                 */
                if (this[timeoutVar]) {
                    clearTimeout(this[timeoutVar]);
                    this[timeoutVar] = null;
                }
                this[timeoutVar] = setTimeout(func, millisecs);
            }

        });
        return MarkerStyleChildView;
    });
