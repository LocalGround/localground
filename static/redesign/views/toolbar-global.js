define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/toolbar-global.html"
], function ($, _, Handlebars, Marionette, ToolbarTemplate) {
    "use strict";
    var Toolbar = Marionette.ItemView.extend({
        template: Handlebars.compile(ToolbarTemplate),

        templateHelpers: function () {
            return {
                activeTab: this.app.activeTab
            };
        },

        initialize: function (opts) {
            _.extend(this, opts);
            if (this.app.dataManager) {
                this.model = this.app.dataManager.model;
            }
            this.app.activeTab = "data";
            if (this.app.screenType == "style") {
                this.app.activeTab = "style";
            }
            Marionette.ItemView.prototype.initialize.call(this);
            this.listenTo(this.app.vent, 'data-loaded', this.setModel);
        },

        setModel: function () {
            this.model = this.app.dataManager.model;
            this.render();
        }
    });
    return Toolbar;
});