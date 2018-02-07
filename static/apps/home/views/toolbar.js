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
        /*
        Looks like there are conflicting names to represent username
        username is the old version of getting user name
        user.username is the new way to get user name
        */
        templateHelpers: function () {
            return {
                username: this.app.username,
                user: this.app.user
            };
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
