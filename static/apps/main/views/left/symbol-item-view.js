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
                console.log(this.model);
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
                    'active': this.active
                };
            },
            makeActive: function () {
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
