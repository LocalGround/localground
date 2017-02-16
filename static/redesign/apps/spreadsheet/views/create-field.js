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
            //console.log("Creating field");
            this.model = new Field(null, { id: opts.formID });
            this.fields = opts.fields;
            this.app = opts.app;
            // see documentation: https://github.com/powmedia/backbone-forms
            this.form = new Backbone.Form({
                model: this.model,
                schema: {
                    col_alias: {
                        type: 'Text',
                        title: "Name",
                        validators: ['required']
                    },
                    data_type: {
                        title: 'Data Type',
                        type: 'Select',
                        options: { text: 'Text', integer: 'Integer', boolean: 'Boolean' }
                    }
                }
            }).render();
            /*
            this.render();
            this.$el.find("#model-form").append(this.form.$el);
            */
        },

        onShow: function(){
            this.render();
            this.$el.find("#model-form").append(this.form.$el);

        },
        saveToDatabase: function () {
            var that = this;
            // see the "saveModel" method of the
            // apps/gallery/views/data-detail.js to see
            // how to save, using Backbone forms
            var errors = this.form.commit({ validate: true });
            if (errors) {
                console.log("errors: ", errors);
                return;
            }
            this.model.set("ordering", this.fields.length+1); // list starting at 1, thus +1 needed
            this.model.save(
                null,
                {
                    success: function(){
                        // Successfully add a new field
                        that.fields.add(that.model);
                        that.app.vent.trigger("render-spreadsheet");
                        that.app.vent.trigger("hide-modal");
                    }
                }
            );

        }

    });
    return CreateFieldView;

});
