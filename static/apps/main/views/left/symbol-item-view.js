define(["marionette",
        "handlebars",
        "text!../../templates/left/symbol-item-view.html"
    ],
    function (Marionette, Handlebars, SymbolItemTemplate) {
        'use strict';
        /**
         * model --> Record
         */
        var SymbolItemView =  Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
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
                if (this.app.selectedItemView) {
                    this.app.selectedItemView.active = false;
                    this.app.selectedItemView.render();
                }
                this.app.selectedItemView = this;
                this.active = true;
                this.render();
            },
            onDestroy: function () {
                //this.markerOverlays.destroy();
            }
        });
        return SymbolItemView;
    });
