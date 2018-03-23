define(["marionette",
        "handlebars",
        "lib/maps/overlays/marker",
        "text!../../templates/left/symbol-item-view.html"
    ],
    function (Marionette, Handlebars, MarkerOverlay, SymbolItemTemplate) {
        'use strict';
        /**
         * model --> Record
         */
        var SymbolItemView =  Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
                this.symbolModel = this.parent.model;
                this.overlay = new MarkerOverlay({
                    model: this.model,
                    symbol: this.symbolModel,
                    app: this.app,
                    isShowing: this.symbolModel.get('isShowing'),
                    displayOverlay: this.symbolModel.get('isShowing')
                });
                this.overlay.render();
            },
            active: false,
            events: {
                'click': 'makeActive'
            },

            template: Handlebars.compile(SymbolItemTemplate),
            tagName: "li",
            className: "symbol-item marker-container",
            templateHelpers: function () {
                return {
                    active: this.active,
                    layer_id: this.parent.layerId,
                    map_id: this.parent.mapId,
                    data_source: this.parent.layer.get('data_source')
                };
            },
            makeActive: function (e) {
                var activeItem = this.app.selectedItemView;
                if (activeItem) {
                    activeItem.active = false;
                    activeItem.render();
                    activeItem.overlay.deactivate();
                }
                this.app.selectedItemView = this;
                this.active = true;
                this.overlay.activate()
                this.render();
            },
            onDestroy: function () {
                this.overlay.destroy();
            }
        });
        return SymbolItemView;
    });
