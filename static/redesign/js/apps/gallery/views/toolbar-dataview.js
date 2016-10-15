define([
    "underscore",
    "jquery",
    "handlebars",
    "marionette",
    "text!../templates/toolbar-dataview.html"
], function (_, $, Handlebars, Marionette, ToolbarTemplate) {
    "use strict";
    var ToolbarDataView = Marionette.ItemView.extend({
        /*
        Because of the blinking, consider:
        http://stackoverflow.com/questions/10746706/attaching-backbone-js-views-to-existing-elements-vs-inserting-el-into-the-doms
        */
        events: {
            'click #toolbar-search': 'doSearch',
            'change #media-type': 'changeDisplay'
        },

        template: Handlebars.compile(ToolbarTemplate),

        initialize: function (opts) {
            _.extend(this, opts);
            Marionette.ItemView.prototype.initialize.call(this);
            this.template = Handlebars.compile(ToolbarTemplate);
        },

        doSearch: function () {
            //note: app.js is listening for the search-requested event
            var term = this.$el.find("#searchTerm").val();
            this.app.vent.trigger("search-requested", term);
        },

        changeDisplay: function (e) {
            var selection =  $(e.currentTarget).val();
            console.log(selection);
            this.app.vent.trigger("change-display", selection);
        }
    });
    return ToolbarDataView;
});