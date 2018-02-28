define([
    "jquery",
    "underscore",
    "backbone",
    "handlebars",
    "marionette",
    "lib/forms/backbone-form",
    "models/video",
    "lib/modals/modal",
    "text!templates/create-video.html"
], function ($, _, Backbone, Handlebars, Marionette, DataForm,
    Video, Modal, CreateVideoTemplate) {
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
        modal: null,
        initialize: function (opts) {
            _.extend(this, opts);
            console.log(this.app.selectedProjectID);
            this.model = new Video({
                'project_id': this.app.selectedProjectID
            });
            // maybe initialize the modal
        },
        templateHelpers: function () {
            return {
                mode: this.mode,
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
                dm = this.app.dataManager;
            this.commitForm();
            this.model.save(null, {
                success: function (model, response) {
                    that.app.vent.trigger('success-message', "The form was saved successfully");
                    dm.getCollection("videos").add(model);
                    that.modal.hide();
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
