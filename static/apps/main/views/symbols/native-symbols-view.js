define(["marionette",
"handlebars",
"text!../../templates/symbols/native-symbols.html"
],
function (Marionette, Handlebars, NativeSymbolsTemplate) {
'use strict';

    var NativeSymbolsView = Marionette.ItemView.extend(_.extend({}, {
        isShowing: false,
        template: Handlebars.compile(NativeSymbolsTemplate),

        initialize: function (opts) {
            this.app = opts.app;
            console.log("native symbols initialized");
        }
    }));
    return NativeSymbolsView;
});