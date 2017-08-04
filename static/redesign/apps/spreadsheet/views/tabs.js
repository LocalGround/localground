define([
    "backbone",
    "marionette",
    "handlebars",
    "text!../templates/tabs,html",
    "models/record",
    "models/marker",
    "forms"
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
            console.log(this);
            this.forms = new Forms();
            this.listenTo(this.forms, "reset", this.render);
            this.forms.setServerQuery("WHERE project = " + this.app.getProjectID());
            this.forms.fetch({ reset: true });
        },

        templateHelpers: function(){

            return {
                forms: this.forms.toJSON()
            };
        },

        selectTab: function(){
            /*
            Make sure that selected tab lods all the data
            and highlight the selected tab only
            */
        },

        onShow: function(){

            console.log("Calling On Show in Tabs")
            this.render();
        }

    });
    return CreateFieldView;

});
