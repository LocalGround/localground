define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "marionette",
    "apps/gallery/views/media_browser",
    "apps/gallery/views/add-media",
    "text!../templates/photo-detail.html",
    "text!../templates/audio-detail.html",
    "text!../templates/record-detail.html",
    "models/audio",
    "lib/audio/audio-player",
    "lib/carousel/carousel",
    "form" //extends Backbone
], function ($, Backbone, _, Handlebars, Marionette, MediaBrowser,
             AddMedia, PhotoTemplate, AudioTemplate, SiteTemplate,
             Audio, AudioPlayer, Carousel) {
    "use strict";
    var MediaEditor = Marionette.ItemView.extend({
        events: {
            'click .view-mode': 'switchToViewMode',
            'click .edit-mode': 'switchToEditMode',
            'click .save-model': 'saveModel',
            'click .delete-model': 'deleteModel',
            'click #add-media-button': 'showMediaBrowser',
            'click .detach_media': 'detachModel',
            'click .hide': 'hideMapPanel',
            'click .show': 'showMapPanel'
        },
        getTemplate: function () {
            if (this.dataType == "photos") {
                return Handlebars.compile(PhotoTemplate);
            } else if (this.dataType == "audio") {
                return Handlebars.compile(AudioTemplate);
            }
            return Handlebars.compile(SiteTemplate);
        },
        showMediaBrowser: function () {
            // That is a good small start,
            // but there has to be a way to
            // utilize aspects of data view so that
            // it can show a collection of photos already stored in media

            /*
              I also made a js class that is like data-list.js but has only
              photos and audio as options.

              I am likely to set default collection to photos
              by assigning its data type to be photos
            */
            var addMediaLayoutView = new AddMedia({
                app: this.app
            });
            this.app.vent.trigger("show-modal", {
                title: 'Media Browser',
                width: 1100,
                height: 400,
                view: addMediaLayoutView,
                saveButtonText: "Add",
                showSaveButton: true,
                saveFunction: addMediaLayoutView.addModels.bind(addMediaLayoutView)
            });
        },
        initialize: function (opts) {
            _.extend(this, opts);
            this.dataType = this.dataType || this.app.dataType;
            Marionette.ItemView.prototype.initialize.call(this);
            this.listenTo(this.app.vent, 'add-models-to-marker', this.attachModels);
        },

        modelEvents: {
            change: "render"
        },

        attachModels: function (models) {
            var that = this,
                i = 0;
            for (i = 0; i < models.length; ++i) {
                this.model.attach(models[i], function () {
                    that.model.fetch({reset: true});
                }, function () {});
            }
            this.app.vent.trigger('hide-modal');
        },
        /*
          Problem stems from that the model is undefined
          and it has to be defined inside the function
        */
        detachModel: function (e) {
            var that = this,
                $elem = $(e.target),
                dataType = $elem.attr("data-type"),
                dataID = $elem.attr("data-id"),
                name = $elem.attr("media-name");
            if (!confirm("Are you sure you want to detach " +
                    name + " from this site? Note that this will not delete the media file -- it just detaches it.")) {
                return;
            }
            this.model.detach(dataID, dataType, function () {
                that.model.fetch({reset: true});
            });
        },
        switchToViewMode: function () {
            this.app.mode = "view";
            this.render();
        },
        switchToEditMode: function () {
            this.app.mode = "edit";
            this.render();
        },
        switchToAddMode: function () {
            this.app.mode = "add";
            this.render();
        },
        templateHelpers: function () {
            var context = {
                mode: this.app.mode,
                dataType: this.dataType,
                audioMode: "detail",
                screenType: this.app.screenType,
                audioCount: this.getAudioCount(),
                photoCount: this.getPhotoCount()
            };
            return context;
        },
        getPhotoCount: function () {
            var count = 0;
            if (this.model.get("children") && this.model.get("children").photos) {
                count = this.model.get("children").photos.data.length;
            }
            return count;
        },

        getAudioCount: function () {
            var count = 0;
            if (this.model.get("children") && this.model.get("children").audio) {
                count = this.model.get("children").audio.data.length;
            }
            return count;
        },
        viewRender: function () {
            //any extra view logic. Carousel functionality goes here
            var c;
            if (this.model.get("children") && this.model.get("children").photos) {
                c = new Carousel({
                    model: this.model,
                    app: this.app,
                    mode: "photos"
                });
                this.$el.find(".carousel-photo").append(c.$el);
            }
            if (this.model.get("children") && this.model.get("children").audio) {
                c = new Carousel({
                    model: this.model,
                    app: this.app,
                    mode: "audio"
                });
                this.$el.find(".carousel-audio").append(c.$el);
            }
        },
        editRender: function () {
            var fields,
                i,
                field,
                type,
                name,
                that = this,
                audio_attachments = [],
                player;
            if (this.dataType.indexOf('form_') != -1) {
                fields = {};
                for (i = 0; i < this.model.get("fields").length; i++) {
                    /* https://github.com/powmedia/backbone-forms */
                    field = this.model.get("fields")[i];
                    type = field.data_type.toLowerCase();
                    name = field.col_name;
                    switch (type) {
                    case "boolean":
                        fields[name] = 'Checkbox';
                        break;
                    case "integer":
                        fields[name] = 'Number';
                        break;
                    default:
                        fields[name] = 'Text';
                    }
                }
                this.form = new Backbone.Form({
                    model: this.model,
                    schema: fields
                }).render();
            } else {
                fields = ['name', 'caption', 'tags', 'attribution'];
                this.form = new Backbone.Form({
                    model: this.model,
                    fields: fields
                }).render();
            }
            if (this.dataType.indexOf("form_") != -1 || this.dataType == "markers") {
                audio_attachments = [];
                if (this.model.get("children") && this.model.get("children").audio) {
                    audio_attachments = this.model.get("children").audio.data;
                }
                _.each(audio_attachments, function (item) {
                    var $elem = that.$el.find(".audio-basic[data-id='" + item.id + "']")[0];
                    player = new AudioPlayer({
                        model: new Audio(item),
                        audioMode: "basic",
                        app: that.app
                    });
                    $elem.append(player.$el[0]);
                });
            }
            //https://github.com/powmedia/backbone-forms#custom-editors
            this.$el.find('#model-form').append(this.form.$el);
        },

        onRender: function () {
            if (this.app.mode == "view" || this.app.mode == "presentation") {
                this.viewRender();
            } else {
                this.editRender();
            }
            // render audio player if audio mode:
            if (this.dataType == "audio") {
                var player = new AudioPlayer({
                    model: this.model,
                    audioMode: "detail",
                    app: this.app
                });
                this.$el.find(".player-container").append(player.$el);
            }
        },
        saveModel: function () {
            var errors = this.form.commit({ validate: true }),
                that = this,
                isNew = this.model.get("id") ? false : true;
            if (errors) {
                console.log("errors: ", errors);
                return;
            }
            this.model.save(null, {
                success: function (model, response) {
                    //perhaps some sort of indication of success here?
                    that.$el.find(".success-message").show().delay(3000).fadeOut(1500);
                    if (!isNew) {
                        model.trigger('saved');
                    } else {
                        model.collection.add(model);
                    }
                },
                error: function (model, response) {
                    that.$el.find("#model-form").append("error saving");
                }
            });
        },
        deleteModel: function (e) {
            var that = this;
            if (!confirm("Are you sure you want to delete this entry?")) {
                return;
            }
            this.model.destroy({
                success: function () {
                    //trigger an event that clears out the deleted model's detail:
                    that.app.vent.trigger('hide-detail');
                }
            });
            e.preventDefault();
        },
        doNotDisplay: function () {
            this.$el.html("");
        },
        hideMapPanel: function (e) {
            $(e.target).removeClass("hide").addClass("show");
            console.log("about to hide...");
            this.app.vent.trigger('hide-detail');
            e.preventDefault();
        },
        showMapPanel: function (e) {
            $(e.target).removeClass("show").addClass("hide");
            console.log("about to show...");
            this.app.vent.trigger('unhide-detail');
            e.preventDefault();
        }
    });
    return MediaEditor;
});
