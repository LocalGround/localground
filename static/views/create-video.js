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
            'change #video_link': 'renderIframe',
            'paste #video_link': 'renderIframe',
            'onpaste #video_link ': 'renderIframe'
        },
        renderIframe: function (e) {
            setTimeout(() => {
                if (this.model) {
                    this.createNewVideo();
                    this.model.set("errorMessage", "");
                }
                this.commitForm();
                this.model.save(null, {
                    success: this.render,
                    error: (model, response) => {
                        if (this.model.get("video_link") == ""){
                            this.model.set("errorMessage", "Link is empty");
                        } else {
                            this.model.set("errorMessage", "Needs a valid video link");
                        }
                        console.log("About to trigger error message", JSON.parse(response.responseText)[0]);
                        this.app.vent.trigger('error-message', JSON.parse(response.responseText)[0]);
                        this.$el.find("#model-form").append("error saving");
                        this.render();
                    }
                });
            },0);
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
        createNewVideo(){
            this.model = new Video({
                'project_id': this.app.selectedProjectID
            });
        },
        commitForm: function () {
            this.model.set('video_link', this.$el.find('#video_link').val());

        },
        saveModel: function () {
            this.commitForm();
            this.model.save(null, {
                error: (model, response) => {
                    if (this.model.get("video_link") === '') {
                        this.model.set("errorMessage", "Link is empty");
                    } else {
                        this.model.set("errorMessage", "Needs a valid video link");
                    }
                    this.render()
                }
            });
        },

        addModels: function () {
            if (this.model.id) {
                this.app.dataManager.getCollection("videos").add(this.model);
                this.parentModel.trigger('add-models-to-marker', [ this.model ])
                this.app.vent.trigger('add-models-to-marker', [ this.model ]);
            } else {
                alert('no video added');
            }
        }
    });
    return CreateVideoView;

});
