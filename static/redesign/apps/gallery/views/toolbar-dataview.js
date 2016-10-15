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
            'click #toolbar-clear': 'clearSearch',
            'change #media-type': 'changeDisplay'
        },

        template: Handlebars.compile(ToolbarTemplate),

        initialize: function (opts) {
            _.extend(this, opts);
            Marionette.ItemView.prototype.initialize.call(this);
            this.template = Handlebars.compile(ToolbarTemplate);
        },

        clearSearch: function () {
            this.app.vent.trigger("clear-search");
        },

        doSearch: function () {
            //note: app.js is listening for the search-requested event
            var term = this.$el.find("#searchTerm").val(),
                query = "WHERE name like %" + term +
                        "% OR caption like %" + term +
                        "%";
            this.app.vent.trigger("search-requested", query);
        },

        changeDisplay: function (e) {
            var selection =  $(e.currentTarget).val();
            console.log(selection);
            this.app.vent.trigger("change-display", selection);
        }
    });
    return ToolbarDataView;
});