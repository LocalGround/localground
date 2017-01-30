define([
    "backbone",
    "underscore",
    "handlebars",
    "marionette",
    "apps/gallery/views/media_browser",
    "text!../templates/photo-detail.html",
    "text!../templates/audio-detail.html",
    "text!../templates/marker-detail.html",
    "text!../templates/record-detail.html",
    "lib/audio/audio-player",
    "apps/gallery/views/data-list",
    "form" //extends Backbone
], function (Backbone, _, Handlebars, Marionette, MediaBrowser,
             PhotoTemplate, AudioTemplate, MarkerTemplate, RecordTemplate,
             AudioPlayer,
             DataList) {
    "use strict";
    var MediaEditor = Marionette.ItemView.extend({
        events: {
            'click .view-mode': 'switchToViewMode',
            'click .edit-mode': 'switchToEditMode',
            'click .save-model': 'saveModel',
            'click .delete-model': 'deleteModel',
            'click #add-media-button': 'showMediaBrowser',
            'click .detach_media': 'detachModel'
        },
        getTemplate: function () {
            if (this.app.dataType == "photos") {
                return Handlebars.compile(PhotoTemplate);
            } else if (this.app.dataType == "audio") {
                return Handlebars.compile(AudioTemplate);
            } else if (this.app.dataType == "markers") {
                return Handlebars.compile(MarkerTemplate);
            } else {
                return Handlebars.compile(RecordTemplate);
            }
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
            var mediaBrowser = new MediaBrowser({
                app: this.app
            });
            this.app.vent.trigger("show-modal", {
                title: 'Media Browser',
                width: 800,
                height: 400,
                view: mediaBrowser,
                saveButtonText: "Add",
                showSaveButton: true,
                saveFunction: mediaBrowser.addModels.bind(mediaBrowser)
            });
        },
        initialize: function (opts) {
            _.extend(this, opts);
            Marionette.ItemView.prototype.initialize.call(this);
            this.listenTo(this.app.vent, 'add-models-to-marker', this.attachModels);
        },

        modelEvents: {
            change: "render"
        },

        attachModels: function (models) {
            var that  = this;
            for (var i = 0; i < models.length; ++i){
                this.model.attach(models[i], function(){
                    that.model.fetch({reset: true});
                }, function(){
                })
            }
            this.app.vent.trigger('hide-modal');
        },
        /*
          Problem stems from that the model is undefined
          and it has to be defined inside the function
        */
        detachModel: function(e){
            if (!confirm("Want to remove media from site?")) return;
            var that = this;

            var $elem = $(e.target);
            var dataType = $elem.attr("data-type");
            var dataID = $elem.attr("data-id");
            this.model.detach(dataID, dataType, function(){
                that.model.fetch({reset: true});
            })


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
                dataType: this.app.dataType
            };
            return context;
        },
        onRender: function () {
            //https://github.com/powmedia/backbone-forms#custom-editors
            var fields, i, field, type, name;
            if (this.app.dataType.indexOf('form_') != -1) {
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

                if (this.app.dataType == "audio"){
                    var player = new AudioPlayer({
                        model: this.model
                    });
                    this.$el.find(".player-container").append(player.$el);
                }
            }
            this.$el.find('#model-form').append(this.form.$el);
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
        }
    });
    return MediaEditor;
});
