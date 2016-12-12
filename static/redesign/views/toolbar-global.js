define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/toolbar-global.html"
], function ($, _, Handlebars, Marionette, ToolbarTemplate) {
    "use strict";
    var Toolbar = Marionette.ItemView.extend({
        events: {
            'click #map-link': 'test',
            'click a': 'selectTab'
        },
        template: Handlebars.compile(ToolbarTemplate),

        initialize: function (opts) {
            _.extend(this, opts);
            this.model = this.app.selectedProject;
            this.app.activeTab = "media";
            Marionette.ItemView.prototype.initialize.call(this);
        },

        onRender: function () {
            this.$el.find(".project-detail > div").css('display', 'inline-block');
        },

        selectTab: function (e) {
            var $tab = $(e.currentTarget);
            this.app.activeTab = $tab.html().toLowerCase();
            this.$el.find("nav div").removeClass("selected");
            $tab.parent().addClass("selected");
            this.app.vent.trigger("tab-switch");
            e.preventDefault();
        },

        test: function () {
            console.log("test");
        }
    });
    return Toolbar;
});