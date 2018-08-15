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
        models: [],
        events: {
            'blur #video_link': 'renderIframe',
            'change #video_link': 'renderIframe',
            'paste #video_link': 'renderIframe',
            'onpaste #video_link ': 'renderIframe'
        },
        renderIframe: function (e) {
            setTimeout(() => {
                const video = new Video({
                    'project_id': this.app.selectedProjectID
                });
                this.commitForm(video);
            }, 0);
        },
        initialize: function (opts) {
            _.extend(this, opts);
            this.models = [];
        },
        templateHelpers: function () {
            return {
                mode: this.mode,
                dataType: this.options.dataType,
                errorMessage: this.errorMessage,
                videos: this.models.map(model => {
                    return model.toTemplateJSON()
                })
            };
        },
        commitForm: function (video) {
            this.errorMessage = '';
            const url = this.$el.find('#video_link').val();
            if (url === '') {
                return;
            } else {
                video.set('video_link', url);
                video.save(null, {
                    success: () => {
                        this.models.push(video);
                        this.render();
                    },
                    error: (model, response) => {
                        this.errorMessage = 'This video could not be found on YouTube or Vimeo.';
                        this.render();
                    }
                });
            }
        },

        addModels: function () {
            const videos = this.app.dataManager.getCollection("videos");
            // add to data manager:
            this.models.forEach(model => {
                videos.add(model);
            });
            this.parentModel.trigger('add-models-to-marker', this.models)
            this.app.vent.trigger('add-models-to-marker', this.models);

        }
    });
    return CreateVideoView;

});
