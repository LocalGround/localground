define([
    "backbone",
    "marionette",
    "handlebars",
    "models/field",
    "text!../templates/create-field.html",
    "form"
], function (Backbone, Marionette, Handlebars, Field, CreateFieldTemplate) {
    'use strict';
    var CreateFieldView = Marionette.ItemView.extend({
        template: Handlebars.compile(CreateFieldTemplate),
        initialize: function (opts) {
            this.model = new Field(null, { id: opts.formID });
            // see documentation: https://github.com/powmedia/backbone-forms
            this.form = new Backbone.Form({
                model: this.model,
                schema: {
                    name: {
                        type: 'Text',
                        validators: ['required']
                    },
                    data_type: {
                        title: 'Data Type',
                        type: 'Select',
                        options: { text: 'Text', integer: 'Integer', boolean: 'Boolean' }
                    }
                }
            }).render();
            this.render();
            this.$el.find("#model-form").append(this.form.$el);
        },
        saveToDatabase: function () {
            // see the "saveModel" method of the
            // apps/gallery/views/data-detail.js to see
            // how to save, using Backbone forms
            var errors = this.form.commit({ validate: true });
            if (errors) {
                console.log("errors: ", errors);
                return;
            }
            alert("save");
        }

    });
    return CreateFieldView;

});
