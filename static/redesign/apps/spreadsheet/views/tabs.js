define([
    "backbone",
    "marionette",
    "handlebars",
    "text!../templates/tabs,html",
    "models/record",
    "models/marker"
], function (Backbone, Marionette, Handlebars, TabsTemplate, Record, Marker) {
    'use strict';
    var CreateFieldView = Marionette.ItemView.extend({
        template: function () {
            return Handlebars.compile(TabsTemplate);
        },
        initialize: function (opts) {
            _.extend(this, opts);
            this.fields = opts.fields;
            this.app = opts.app;
            // Will have to get more stuff in
        },

        selectTab: function(){
            /*
            Make sure that selected tab lods all the data
            and highlight the selected tab only
            */
        }

    });
    return CreateFieldView;

});
