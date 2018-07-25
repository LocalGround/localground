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
            'paste #video_link': 'renderIframe',
            'onpaste #video_link ': 'renderIframe'
        },
        renderIframe: function (e) {
            var that = this;
            setTimeout(function(){
                if(that.model){
                    that.createNewVideo();
                    that.model.set("errorMessage", "");
                }
                that.commitForm();
                that.model.save(null, {
                    success: that.render,
                    error: function(model, response){
                        if (that.model.get("video_link") == ""){
                            that.model.set("errorMessage", "Link is empty");
                        } else {
                            that.model.set("errorMessage", "Needs a valid video link");
                        }
                        console.log("About to trigger error message", JSON.parse(response.responseText)[0]);
                        that.app.vent.trigger('error-message', JSON.parse(response.responseText)[0]);
                        that.$el.find("#model-form").append("error saving");
                        that.render();
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
            var that = this;
            this.commitForm();
            this.model.save(null, {
                success: that.addToForm.bind(this),
                error: function (model, response) {
                    if (that.model.get("video_link") == ""){
                        that.model.set("errorMessage", "Link is empty");
                    } else {
                        that.model.set("errorMessage", "Needs a valid video link");
                    }
                    that.app.vent.trigger('error-message', response.responseText[0]);
                    that.$el.find("#model-form").append("error saving");
                    that.render()
                }
            });
        },
        addToForm: function (model, response) {
            this.model.set("errorMessage", null);
            //attaching media to markers (from data detail):
            if (this.parentModel) {
                this.app.vent.trigger('success-message', "The form was saved successfully");
                this.parentModel.trigger('add-models-to-marker', [ model ])
                this.parentModel.trigger('add-media-to-model', [ model ]);
                this.app.vent.trigger('add-models-to-marker', [ model ]);
            }

            //for gallery and spreadsheet:
            else if (this.modal) {
                var dm = this.app.dataManager;
                dm.getCollection("videos").add(model);
                this.modal.hide();
            }
        }
    });
    return CreateVideoView;

});
