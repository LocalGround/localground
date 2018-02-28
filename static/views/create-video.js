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
                console.log("PASTING LINK")
                console.log(e);
                console.log(e.target);
                console.log(e.target.value);
                if(that.model){
                    that.createNewVideo();
                }
                that.commitForm();
                that.model.save(null, {
                    success: that.render
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
                dataType: this.options.dataType,
                errorMessage: this.model.errorMessage
            };
        },
        createNewVideo(){
            this.model = new Video({
                'project_id': this.app.selectedProjectID
            });
        },
        commitForm: function () {
            console.log(this.$el.find('#video_link').val());
            this.model.set('video_link', this.$el.find('#video_link').val());
        },

        saveModel: function () {
            var that = this;
            this.commitForm();
            this.model.save(null, {
                success: that.addToForm.bind(this),
                error: function (model, response) {
                    if (that.model.get("video_provider") == "" && that.model.get("video_id") == ""){
                        this.model.errorMessage = "Pasted invalid video link";
                    } else if (that.model.get("video_id") == ""){
                        this.model.errorMessage = "Need a valid video ID";
                    }
                    that.$el.find("#model-form").append("error saving");
                }
            });
        },
        addToForm: function (model, response) {
            //attaching media to markers (from data detail):
            if (this.parentModel) {
                this.app.vent.trigger('success-message', "The form was saved successfully");
                this.parentModel.trigger('add-models-to-marker', [ model ])
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
