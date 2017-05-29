define([
    "jquery",
    "backbone",
    "underscore",
    "handlebars",
    "marionette",
    "models/association",
    "models/audio",
    "apps/gallery/views/media_browser",
    "apps/gallery/views/add-media",
    "text!../templates/photo-detail.html",
    "text!../templates/audio-detail.html",
    "text!../templates/record-detail.html",
    "text!../templates/map-image-detail.html",
    "lib/audio/audio-player",
    "lib/carousel/carousel",
    "lib/maps/overlays/icon",
    "form", //extends Backbone
    "form-list"
], function ($, Backbone, _, Handlebars, Marionette, Association, Audio,
             MediaBrowser, AddMedia, PhotoTemplate, AudioTemplate, SiteTemplate,
             MapImageTemplate, AudioPlayer, Carousel, Icon) {
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
            'click .show': 'showMapPanel',
            'click .rotate-left': 'rotatePhoto',
            'click .rotate-right': 'rotatePhoto',
            "click .add-marker-button": "activateMarkerTrigger",
            "click .delete-marker-button": "deleteMarkerTrigger"
        },
        getTemplate: function () {
            if (this.dataType == "photos") {
                return Handlebars.compile(PhotoTemplate);
            } else if (this.dataType == "audio") {
                return Handlebars.compile(AudioTemplate);
            } else if (this.dataType == "map_images") {
                return Handlebars.compile(MapImageTemplate);
            }
            return Handlebars.compile(SiteTemplate);
        },
        showMediaBrowser: function () {
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
            this.bindFields();
            this.dataType = this.dataType || this.app.dataType;
            Marionette.ItemView.prototype.initialize.call(this);
            this.listenTo(this.app.vent, 'add-models-to-marker', this.attachModels);
            this.listenTo(this.app.vent, 'save-model', this.saveModel);
        },

        activateMarkerTrigger: function () {
            if (this.$el.find('#drop-marker-message').get(0)) {
                //button has already been clicked
                return;
            }
            this.$el.find("#add-marker-button").css({
                background: "#4e70d4",
                color: "white"
            });
            this.$el.find(".add-lat-lng").append("<p id='drop-marker-message'>click on the map to add location</p>");
            //Define Class:
            var that = this, MouseMover, $follower, mm;
            MouseMover = function ($follower) {
                var icon;
                this.generateIcon = function () {
                    var template, shape;
                    template = Handlebars.compile('<svg viewBox="{{ viewBox }}" width="{{ width }}" height="{{ height }}">' +
                        '    <path fill="{{ fillColor }}" paint-order="stroke" stroke-width="{{ strokeWeight }}" stroke-opacity="0.5" stroke="{{ fillColor }}" d="{{ path }}"></path>' +
                        '</svg>');
                    shape = that.model.get("overlay_type");
                    if (shape.indexOf("form_") != -1) {
                        shape = "marker";
                    }
                    icon = new Icon({ shape: shape, strokeWeight: 6 }).generateGoogleIcon();
                    icon.width *= 1.5;
                    icon.height *= 1.5;
                    $follower.html(template(icon));
                    $follower.show();
                };
                this.start = function () {
                    this.generateIcon();
                    $(window).bind('mousemove', this.mouseListener);
                };
                this.stop = function (event) {
                    $(window).unbind('mousemove');
                    $follower.remove();
                    that.app.vent.trigger("place-marker", {
                        x: event.clientX,
                        y: event.clientY
                    });
                };
                this.mouseListener = function (event) {
                    $follower.css({
                        top: event.clientY - icon.height * 3 / 4 + 4,
                        left: event.clientX - icon.width * 3 / 4
                    });
                };
            };

            //Instantiate Class and Add UI Event Handlers:
            $follower = $('<div id="follower"></div>');
            $('body').append($follower);
            mm = new MouseMover($follower);
            $(window).mousemove(mm.start.bind(mm));
            $follower.click(mm.stop);
            this.app.vent.trigger("add-new-marker", this.model);
        },

        deleteMarkerTrigger: function(){
            this.app.vent.trigger("delete-marker", this.model);
        },

        bindFields: function () {
            if (!this.model || !this.model.get("overlay_type")) {
                return;
            }
            var i, f;
            if (this.model.get("overlay_type").indexOf("form_") != -1) {
                for (i = 0; i < this.model.get("fields").length; i++) {
                    /* https://github.com/powmedia/backbone-forms */
                    f = this.model.get("fields")[i];
                    f.val = this.model.get(f.col_name);
                }
            }
        },

        modelEvents: {
            change: "render"
        },

        attachModels: function (models) {
            var that = this;
            if (this.model.get("id")) {
                this.attachMedia(models);
            } else {
                this.model.save(null, {
                    success: function () {
                        that.attachMedia(models);
                        that.model.collection.add(that.model);
                    }
                });
            }
            this.app.vent.trigger('hide-modal');
        },

        attachMedia: function (models) {
            var that = this, i, ordering;
            for (i = 0; i < models.length; ++i) {
                ordering = this.model.get("photo_count") + this.model.get("audio_count");
                this.model.attach(models[i], (ordering + i + 1), function () {
                    that.model.fetch({reset: true});
                });
            }
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

            var lat, lng, context;
            //sets filler html string if a marker location has not been set
            if (this.model.get("geometry") && this.model.get("geometry").type === "Point") {
                lat = this.model.get("geometry").coordinates[1].toFixed(4);
                lng = this.model.get("geometry").coordinates[0].toFixed(4);
            }
            context = {
                mode: this.app.mode,
                dataType: this.dataType,
                audioMode: "detail",
                name: this.model.get("name") || this.model.get("display_name"),
                screenType: this.app.screenType,
                lat: lat,
                lng: lng
            };
            return context;
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
                title,
                that = this,
                audio_attachments = [],
                player;
            if (this.dataType.indexOf('form_') != -1) {
                fields = {};
                console.log(this.model.get("fields"));
                for (i = 0; i < this.model.get("fields").length; i++) {
                    /* https://github.com/powmedia/backbone-forms */
                    field = this.model.get("fields")[i];
                    field.val = this.model.get(field.col_name);
                    type = field.data_type.toLowerCase();
                    name = field.col_name;
                    title = field.col_alias;
                    switch (type) {
                    case "rating":
                        var options = [],
                            extras = JSON.parse(field.extras),
                            j;
                        for (j = 0; j < extras.length; j++) {
                            options.push({
                                val: extras[j].value,
                                label: extras[j].name
                            });
                        }
                        fields[name] = { type: 'Select', title: title, options: options };
                        break;
                    case "choice":
                        var options = JSON.parse(field.extras);
                        //dummy options for testing
                        options = ["red", "orange", "green", "blue", "yellow", "purple"];
                        fields[name] = { type: 'Select', title: title, options: options };
                        break;
                    case "date-time":
                        // TODO: make this a date picker / calendar like the spreadsheet
                        // Samples:
                        // https://github.com/dbushell/Pikaday
                        // https://coderwall.com/p/70pw4a/datepicker-for-backbone-form
                        fields[name] = { type: 'DateTime', title: title };
                        break;
                    case "boolean":
                        fields[name] = { type: 'Checkbox', title: title };
                        break;
                    case "integer":
                    case "decimal":
                        fields[name] = { type: 'Number', title: title };
                        break;
                    default:
                        fields[name] = { type: 'TextArea', title: title };
                    }
                }
                this.form = new Backbone.Form({
                    model: this.model,
                    schema: fields
                }).render();
            } else {
                this.form = new Backbone.Form({
                    model: this.model,
                    schema: this.model.schema
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

            // The Column arranger functions go here
            this.sortMediaTable();
        },

        sortMediaTable: function(){
            //http://stackoverflow.com/questions/13885665/how-to-exclude-an-element-from-being-dragged-in-sortable-list
            var sortableFields = this.$el.find(".attached-media-container");
            var that  = this;
            sortableFields.sortable({
                helper: this.fixHelper,
                items : '.attached-container',
                //cancel: ''//,
                // Still need work on getting the right models since below code returns undefined error
                //*
                update: function (event, ui) {
                    var newOrder = ui.item.index(),
                        modelID = ui.item.find('.detach_media').attr('data-id'),
                        association;

                    association = new Association({
                        form_id: that.model.get("overlay_type").split("_")[1],
                        overlay_type: that.model.get("overlay_type"),
                        record_id: that.model.get("id"),
                        model_type: "photos",
                        object_id: modelID,
                        id: modelID
                    });
                    association.save({ ordering: newOrder}, {patch: true});
                }
            }).disableSelection();
        },

        // Fix helper with preserved width of cells
        fixHelper: function(e, ui){
            // I want to apply changes made to the media only, not the add media
            // However, by default it does sort all the items around,
            // even with target name tag inside children
            ui.children().each(function(){
                $(this).width($(this).width());
            });
            return ui;
        },

        rotatePhoto: function(e){
            var $elem = $(e.target);
            var rotation = $elem.attr("rotation");
            this.$el.find(".rotate-message").show();
            this.$el.find(".edit-photo").css({
                filter: "brightness(0.4)"
            });
            this.model.rotate(rotation);
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
            this.app.vent.trigger('hide-detail');
            e.preventDefault();
        },
        showMapPanel: function (e) {
            $(e.target).removeClass("show").addClass("hide");
            this.app.vent.trigger('unhide-detail');
            e.preventDefault();
        }
    });
    return MediaEditor;
});
