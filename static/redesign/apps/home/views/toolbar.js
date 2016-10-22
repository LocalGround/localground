define([
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/toolbar.html"
], function (_, Handlebars, Marionette, ToolbarTemplate) {
    "use strict";
    var ToolbarDataView = Marionette.ItemView.extend({

        template: Handlebars.compile(ToolbarTemplate),

        events: {
            'click #toggle-button': 'toggleVisibility'
        },

        initialize: function (opts) {
            _.extend(this, opts);
            Marionette.ItemView.prototype.initialize.call(this);
            this.render();
        },

        toggleVisibility: function () {
            this.$el.find('.dropdown-menu').toggle();
        }
    });
    return ToolbarDataView;
});