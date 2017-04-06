define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/generate-print.html"
], function ($, _, Handlebars, Marionette, PrintTemplate) {
    'use strict';
    var GeneratePrintView = Marionette.ItemView.extend({
        initialize: function (opts) {
            _.extend(this, opts);
            this.render();
        },
        events: {
            'click .delete-field': 'doDelete'
        },
        template: Handlebars.compile(PrintTemplate),
        tagName: "div"
    });
    return GeneratePrintView;

});
