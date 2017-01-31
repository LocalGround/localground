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
            'click nav a': 'selectTab'
        },
        template: Handlebars.compile(ToolbarTemplate),

        initialize: function (opts) {
            _.extend(this, opts);
            this.model = this.app.dataManager.model;
            this.app.activeTab = "media";
            Marionette.ItemView.prototype.initialize.call(this);
            this.listenTo(this.app.vent, 'data-loaded', this.setModel);
        },

        setModel: function () {
            this.mdoel = this.app.dataManager.model;
            this.render();
        },

        onRender: function () {
            //this.$el.find(".project-detail > div").css('display', 'inline-block');
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