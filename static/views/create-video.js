define([
    "underscore",
    "handlebars",
    "marionette",
    "models/video",
    "text!templates/create-video.html"
], function (_, Handlebars, Marionette, Video, CreateVideoTemplate) {
    'use strict';

    var CreateVideoView = Marionette.CompositeView.extend({
        template: Handlebars.compile(CreateVideoTemplate),
        events: {
            'blur #video_link': 'renderIframe',
            'paste #video_link': 'renderIframe'
        },
        renderIframe: function (e) {
            var that = this;
            this.commitForm();
            this.model.save(null, {
                success: that.render
            });
        },
        initialize: function (opts) {
            _.extend(this, opts);
            this.model = new Video({
                'project_id': this.app.selectedProjectID
            });
        },
        templateHelpers: function () {
            return {
                mode: this.mode,
                dataType: this.options.dataType
            };
        },
        commitForm: function () {
            this.model.set('video_link', this.$el.find('#video_link').val());
        },

        saveModel: function () {
            var that = this;
            this.commitForm();
            this.model.save(null, {
                success: that.addToForm.bind(this),
                error: function (model, response) {
                    that.app.vent.trigger('error-message', "The form has not saved");
                    that.$el.find("#model-form").append("error saving");
                }
            });
        },
        addToForm: function (model, response) {
            this.app.vent.trigger('success-message', "The form was saved successfully");
            this.parentModel.trigger('add-models-to-marker', [ model ])
            this.app.vent.trigger('add-models-to-marker', [ model ]);
        }
    });
    return CreateVideoView;

});
