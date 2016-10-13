define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette"
], function ($, _, Handlebars, Marionette) {
    "use strict";
    var Toolbar = Marionette.ItemView.extend({
        events: {
            'click #map-link': 'test'
        },

        initialize: function (opts) {
            _.extend(this, opts);
            this.template = Handlebars.compile($('#toolbar-main').html());
            Marionette.ItemView.prototype.initialize.call(this);
        },

        test: function () {
            console.log("test");
        }
    });
    return Toolbar;
});