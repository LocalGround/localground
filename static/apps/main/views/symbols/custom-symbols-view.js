define(["marionette",
"handlebars",
"text!../../templates/symbols/custom-symbols.html"
],
function (Marionette, Handlebars, CustomSymbolsTemplate) {
'use strict';

var CustomSymbolsView = Marionette.ItemView.extend(_.extend({}, {
    isShowing: false,
    template: Handlebars.compile(CustomSymbolsTemplate),

    initialize: function (opts) {
        this.app = opts.app;
    }
}));
return CustomSymbolsView;
});