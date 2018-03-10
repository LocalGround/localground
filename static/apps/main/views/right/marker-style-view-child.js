define(["jquery",
        "marionette",
        "handlebars",
        "lib/maps/icon-lookup",
        "apps/main/views/symbols/symbol-selection-layout-view",
        "text!../../templates/right/marker-style-child.html",
        'color-picker-eyecon'
    ],
    function ($, Marionette, Handlebars, IconLookup, IndSymbolLayoutView, MarkerStyleChildTemplate) {
        'use strict';

        var MarkerStyleChildView = Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.listenTo(this.app.vent, "update-opacity", this.updateSymbolOpacity);
                this.render();
            },
            template: Handlebars.compile(MarkerStyleChildTemplate),
            events: {
                'change .marker-shape': 'updateShape',
                'click .selected-symbol-div': 'showSymbols'
            },
            /*modelEvents: {
                'change': 'updateLayerSymbols'
            },*/

            tagName: "div",
            className: "table-row",
            templateHelpers: function () {
                return {
                    dataType: this.dataType,
                    icons: IconLookup.getIcons(),
                    fillOpacity: this.model.get("fillOpacity"),
                    id: "cp" + this.model.get('id')
                };
            },
            onRender: function () {
                console.log('msv child render');
                var that = this,
                    color = this.model.get('fillColor'),
                    id = this.model.get('id');

                //new color picker is added to the dom each time the icon is clicked,
                //so we remove the previous color picker with each additional click.
                //for this reason, each marker's picker needs to be uniquely identified
                $(".marker-child-color-picker" + id).remove();
                this.picker = this.$el.find('.jscolor').ColorPicker({
                    color: color,
                    onShow: function (colpkr) {
                        $(colpkr).fadeIn(500);
                        return false;
                    },
                    onHide: function (colpkr) {
                        that.updateFillColor(color);
                        $(colpkr).fadeOut(500);
                        return false;
                    },
                    onChange: function (hsb, hex, rgb) {
                        color = "#" + hex;
                    }
                });
                $(".colorpicker:last-child").addClass('marker-child-color-picker' + id);
            },
            updateFillColor: function (newHex) {
                this.model.set("fillColor", newHex);
                //this.app.vent.trigger('update-map');
            },
            updateShape: function () {
                this.model.set("shape", this.$el.find('.marker-shape').val());
                //this.app.vent.trigger('update-map'); //added
            },
            /*updateLayerSymbols: function () {
                this.layer.setSymbol(this.model);
                this.render();
            },*/
            updateSymbolOpacity: function (opacity) {
                this.model.set("fillOpacity", opacity);
            },
            showSymbols: function() {
                this.indSymbolsView = new IndSymbolLayoutView({
                    app: this,
                    el: this.$el.find('#ind-symbol-dropdown')
                });
                console.log(this.symbolsView);
            }


        });
        return MarkerStyleChildView;
    });
