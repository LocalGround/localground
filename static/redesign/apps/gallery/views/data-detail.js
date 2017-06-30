define([
    "jquery",
    "underscore",
    "handlebars",
    "marionette",
    "text!../templates/photo-detail.html",
    "text!../templates/audio-detail.html",
    "text!../templates/record-detail.html",
    "text!../templates/map-image-detail.html",
    "lib/audio/audio-player",
    "lib/carousel/carousel",
    "lib/maps/overlays/icon",
    "lib/forms/backbone-form"
], function ($, _, Handlebars, Marionette, PhotoTemplate, AudioTemplate, SiteTemplate,
        MapImageTemplate, AudioPlayer, Carousel, Icon, DataForm) {
    "use strict";
    var MediaEditor = Marionette.ItemView.extend({
        events: {
            'click .view-mode': 'switchToViewMode',
            'click .edit-mode': 'switchToEditMode',
            'click .save-model': 'saveModel',
            'click .delete-model': 'deleteModel',
            'click .hide': 'hideMapPanel',
            'click .show': 'showMapPanel',
            'click .rotate-left': 'rotatePhoto',
            'click .rotate-right': 'rotatePhoto',
            "click #add-geometry": "activateMarkerTrigger",
            "click #delete-geometry": "deleteMarkerTrigger",
            "click #add-rectangle": "activateRectangleTrigger"
        },
        getTemplate: function () {
            if (this.dataType == "photos") {
                return Handlebars.compile(PhotoTemplate);
            }
            if (this.dataType == "audio") {
                return Handlebars.compile(AudioTemplate);
            } else if (this.dataType == "map_images") {
                return Handlebars.compile(MapImageTemplate);
            }
            return Handlebars.compile(SiteTemplate);
        },
        initialize: function (opts) {
            _.extend(this, opts);
            this.bindFields();
            this.dataType = this.dataType || this.app.dataType;
            Marionette.ItemView.prototype.initialize.call(this);
            this.listenTo(this.app.vent, 'save-model', this.saveModel);
        },
        activateRectangleTrigger: function () {
            $('body').css({ cursor: 'crosshair' });
            this.app.vent.trigger("add-new-marker", this.model);
            this.app.vent.trigger("add-rectangle", this.model);
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
                    // If clicking an add new and click on marker, there is no overlay_type found
                    //*
                    // If outside, then save the model
                    // and add it to the end of the list so the marker
                    // so that new markers can be added seamlessly
                    if (shape.indexOf("form_") != -1) {
                        shape = "marker";
                    }
                    //*/
                    else {
                        console.log("The current form of adding marker on empty form is buggy");
                    }
                    icon = new Icon({
                        shape: shape,
                        strokeWeight: 6,
                        fillColor: that.model.collection.fillColor,
                        width: that.model.collection.size,
                        height: that.model.collection.size
                    }).generateGoogleIcon();
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

        deleteMarkerTrigger: function () {
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
        switchToViewMode: function () {
            this.app.mode = "view";
            this.app.vent.trigger('mode-change');
            this.render();
        },
        switchToEditMode: function () {
            this.app.mode = "edit";
            this.app.vent.trigger('mode-change');
            this.render();
        },
        switchToAddMode: function () {
            this.app.mode = "add";
            this.render();
        },
        templateHelpers: function () {
            var lat, lng;
            if (this.model.get("geometry") && this.model.get("geometry").type === "Point") {
                lat =  this.model.get("geometry").coordinates[1].toFixed(4);
                lng =  this.model.get("geometry").coordinates[0].toFixed(4);
            }
            return {
                mode: this.app.mode,
                dataType: this.dataType,
                audioMode: "detail",
                name: this.model.get("name") || this.model.get("display_name"),
                screenType: this.app.screenType,
                lat: lat,
                lng: lng
            };
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
            if (this.form) {
                this.form.remove();
            }
            this.form = new DataForm({
                model: this.model,
                schema: this.model.getFormSchema(),
                app: this.app
            }).render();
            this.$el.find('#model-form').append(this.form.$el);
        },

        onRender: function () {
            if (this.app.mode == "view" || this.app.mode == "presentation") {
                this.viewRender();
            } else {
                this.editRender();
            }
            if (this.dataType == "audio") {
                var player = new AudioPlayer({
                    model: this.model,
                    audioMode: "detail",
                    app: this.app
                });
                this.$el.find(".player-container").append(player.$el);
            }

        },

        rotatePhoto: function (e) {
            var $elem = $(e.target),
                rotation = $elem.attr("rotation");
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
