define([
    "jquery",
    "marionette",
    "handlebars",
    "text!../templates/tabs.html",
    "collections/forms"
], function ($, Marionette, Handlebars, TabsTemplate, Forms) {
    'use strict';
    var CreateFieldView = Marionette.ItemView.extend({
        events: {
            'click .tab': 'switchTab'
        },
        initialize: function (opts) {
            _.extend(this, opts);
            this.template = Handlebars.compile(TabsTemplate);
            this.fields = opts.fields;
            this.app = opts.app;
            this.forms = new Forms();
            this.listenTo(this.forms, "reset", this.render);
            this.forms.setServerQuery("WHERE project = " + this.app.getProjectID());
            this.forms.fetch({ reset: true });
        },

        switchTab: function (e) {
            this.app.dataType = $(e.target).attr("data-value");
            this.render();
        },

        templateHelpers: function () {
            this.forms.each(function (model) {
                model.set("instance_type", "form_" + model.id);
            });
            console.log(this.forms.toJSON());
            return {
                forms: this.forms.toJSON(),
                dataType: this.app.dataType
            };
        }

    });
    return CreateFieldView;

});
