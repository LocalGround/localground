define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette"
], function ($, _, Handlebars, Marionette, Projects) {
    "use strict";
    var Toolbar = Marionette.ItemView.extend({
        events: {
            'click #map-link': 'test'
        },

        initialize: function (opts) {
            _.extend(this, opts);
            this.model = this.app.selectedProject;
            if (!this.model) {
                alert("this.app.selectedProject must be defined");
            }
            this.template = Handlebars.compile($('#toolbar-main').html());
            Marionette.ItemView.prototype.initialize.call(this);
        },

        onRender: function () {
            this.$el.find("#project-header").show();
        },

        test: function () {
            console.log("test");
        }
    });
    return Toolbar;
});