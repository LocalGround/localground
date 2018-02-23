define([
    "jquery",
    "underscore",
    "backbone",
    "handlebars",
    "marionette",
    "lib/forms/backbone-form",
    "models/video",
    "text!templates/create-video.html"
], function ($, _, Backbone, Handlebars, Marionette, DataForm,
    Video, CreateVideoTemplate) {
    'use strict';

    /*
    Decided to go forth with another view incolving video link
    Making a very rough draft version of create video layout
    with an html, but requires some configuration to choose between
    create media template and create video template
    */

    var CreateVideoView = Marionette.CompositeView.extend({
        models: [],
        // There must be some way to dynamically determine the template
        // dependong on data type
        template: Handlebars.compile(CreateVideoTemplate),
        initialize: function (opts) {
            this.model = new Video(null, {
                // replace with opts.projectID (?)
                projectID: 2
            });
            console.log(opts);
            console.log(DataForm);

        },
        templateHelpers: function () {
            return {
                mode: this.mode,
                //file_name: this.formatFilename(this.file.name),
                //file_size: this.formatFileSize(this.file.size),
                //errorMessage: this.errorMessage,
                //imageSerial: this.imageSerial,
                // having dataType does not help because
                // it is uninitialized
                dataType: this.options.dataType
            };
        },
        onRender: function () {
            this.form = new DataForm({
                model: this.model,
                schema: this.model.getFormSchema(),
                app: this.app
            }).render();
            this.$el.find('#model-form').append(this.form.$el);
        },
        commitForm: function () {
            var errors = this.form.commit({ validate: true });
            if (errors) {
                console.log("errors: ", errors);
                return;
            }
        },

        saveModel: function () {
            var that = this,
                isNew = this.model.get("id") ? false : true;
            console.log(isNew);
            this.commitForm();
            this.model.save(null, {
                success: function (model, response) {
                    that.app.vent.trigger('success-message', "The form was saved successfully");
                    if (!isNew) {
                        model.trigger('saved');
                    } else {
                        model.collection.add(model);
                    }
                },
                error: function (model, response) {

                    that.app.vent.trigger('error-message', "The form has not saved");
                    that.$el.find("#model-form").append("error saving");
                }
            });
        },
    });
    return CreateVideoView;

});
