define([
    "underscore",
    "handlebars",
    "marionette",
    "collections/maps",
    "text!../templates/toolbar-global.html"
], function (_, Handlebars, Marionette, Maps, ToolbarTemplate) {
    "use strict";
    var Toolbar = Marionette.ItemView.extend({
        template: Handlebars.compile(ToolbarTemplate),
        previewURL: null,
        templateHelpers: function () {
            return {
                activeTab: this.app.activeTab,
                name: this.model.get("name") === "Untitled" ? "" : this.model.get("name"),
                previewURL: this.previewURL
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
            this.getPreviewMap();
        },

        getPreviewMap: function () {
            var that = this;
            this.maps = new Maps();
            this.maps.setServerQuery("WHERE project = " + this.app.getProjectID());
            this.maps.fetch({
                reset: true,
                success: function (collection) {
                    if (collection.length > 0) {
                        that.previewURL = collection.at(0).get("slug");
                        that.render();
                    }
                }
            });
        },

        setModel: function () {
            this.model = this.app.dataManager.model;
            this.render();
        }
    });
    return Toolbar;
});