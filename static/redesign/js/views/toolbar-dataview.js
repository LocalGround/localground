define([
    "underscore",
    "handlebars",
    "marionette",
    "text!../../templates/toolbar-dataview.html"
], function (_, Handlebars, Marionette, ToolbarTemplate) {
    "use strict";
    var ToolbarDataView = Marionette.ItemView.extend({
        /*
        Because of the blinking, consider:
        http://stackoverflow.com/questions/10746706/attaching-backbone-js-views-to-existing-elements-vs-inserting-el-into-the-doms
        */
        events: {
            'click #toolbar-search': 'doSearch',
            'click #toolbar-audio': 'displayAudio',
            'click #toolbar-photos': 'displayPhotos'
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

        displayAudio: function () {
            //note: app.js is listening for the search-requested event
            this.app.vent.trigger("display-audio");
        },

        displayPhotos: function () {
            //note: app.js is listening for the search-requested event
            this.app.vent.trigger("display-photos");
        }
    });
    return ToolbarDataView;
});