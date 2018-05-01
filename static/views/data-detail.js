define([
    "jquery",
    "underscore",
    "backbone",
    "handlebars",
    "marionette",
    "lib/forms/backbone-form",
    "collections/photos", "collections/audio", "collections/videos",
    "text!../templates/photo-detail.html",
    "text!../templates/audio-detail.html",
    "text!../templates/video-detail.html",
    "text!../templates/record-detail.html",
    "text!../templates/map-image-detail.html",
    "lib/audio/audio-player",
    "lib/carousel/carousel",
    "lib/maps/overlays/icon",
    "lib/maps/controls/mouseMover",
    "lib/parallax",
    "touchPunch"
], function ($, _, Backbone, Handlebars, Marionette, DataForm, Photos, Audio, Videos,
        PhotoTemplate, AudioTemplate, VideoTemplate, SiteTemplate,
        MapImageTemplate, AudioPlayer, Carousel, Icon, MouseMover, MoveItItem, TouchPunch) {
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
            "click #delete-geometry": "deleteMarker",
            "click #add-rectangle": "activateRectangleTrigger",
            "click .streetview": 'showStreetView',
            "click .thumbnail-play-circle": 'playAudio',
            'click .circle': 'openExpanded',

            // add event listeners for various geometry requests
            // first, a trigger to display dropdown menu
            "click #add-geometry": "displayGeometryOptions",
            // add point, polyline, or polygon
            'click #add-point': 'activateMarkerTrigger',
            'click #add-polyline': 'triggerPolyline',
            'click #add-polygon': 'triggerPolygon',
            'click': 'hideGeometryOptions'
        },

        displayGeometryOptions: function(e) {
            this.$el.find('.add-marker-button').css({background: '#bbbbbb'});
            this.$el.find('.geometry-options').css({display: 'block'});
        },

        hideGeometryOptions: function(e) {
            if (e && !$(e.target).hasClass('add-marker-button')) {
                this.$el.find('.add-marker-button').css({background: '#fafafc'});
                this.$el.find('.geometry-options').css({display: 'none'});
            };
        },

        triggerPolyline: function(e) {
            this.app.vent.trigger('add-polyline', this.model);
            this.hideGeometryOptions();
            e.preventDefault();
        },
        triggerPolygon: function(e) {
            //this.app.vent.trigger("add-new-marker", this.model);
            this.app.vent.trigger('add-polygon', this.model);
            this.hideGeometryOptions();
            e.preventDefault();
        },

        getTemplate: function () {
            if (this.dataType == "photos") {
                return Handlebars.compile(PhotoTemplate);
            }
            if (this.dataType == "audio") {
                return Handlebars.compile(AudioTemplate);
            }
            if (this.dataType == "videos") {
                return Handlebars.compile(VideoTemplate);
            }
            if (this.dataType == "map_images") {
                return Handlebars.compile(MapImageTemplate);
            }
            return Handlebars.compile(SiteTemplate);

        },
        featuredImageID: null,
        initialize: function (opts) {
            this.mobileView = null;
            this.expanded = false;
            this.clickNum = 1;
            _.extend(this, opts);
            console.log('data detail initialized', this);
            this.bindFields();
            this.dataType = this.dataType || this.app.dataType;
            Marionette.ItemView.prototype.initialize.call(this);
            $('#marker-detail-panel').addClass('mobile-minimize');
            $(window).on("resize", _.bind(this.screenSize, this));

            this.isMobile();

            this.listenTo(this.app.vent, 'save-model', this.saveModel);
            this.listenTo(this.app.vent, 'streetview-hidden', this.updateStreetViewButton);
            this.listenTo(this.app.vent, 'rerender-data-detail', this.render);
        },

        templateHelpers: function () {
            var lat, lng, paragraph, title;
            if (this.model.get("geometry") && this.model.get("geometry").type === "Point") {
                lat =  this.model.get("geometry").coordinates[1].toFixed(4);
                lng =  this.model.get("geometry").coordinates[0].toFixed(4);
            }

            if (this.panelStyles) {
                paragraph = this.panelStyles.paragraph;
                title = this.panelStyles.title;
                $('#marker-detail-panel').css('background-color', '#' + paragraph.backgroundColor);
                this.$el.find('.active-slide').css('background', 'paragraph.backgroundColor');
            }

            return {
                mode: this.app.mode,
                dataType: this.dataType,
                audioMode: "detail",
                name: this.model.get("name") || this.model.get("display_name"),
                geometry: !!this.model.get('geometry'),
                screenType: this.app.screenType,
                lat: lat,
                lng: lng,
                paragraph: paragraph,
                title: title,
                expanded: this.expanded,
                hasPhotoOrAudio: this.getPhotos().length > 0 || this.getAudio().length > 0,
                featuredImage: this.getFeaturedImage(),
                thumbnail: this.getThumbnail(),
                photo_count: this.getPhotos().length,
                audio_count: this.getAudio().length,
                video_count: this.getVideos().length,
                mobileMode: this.mobileMode,
                hasAudio: this.getAudio().length,
                hasPhotos: this.getPhotos().length,
                video_photo_count: this.getVideos().length + this.getPhotos().length
            };
        },

        openExpanded: function (event) {
            if ($(window).scrollTop() < 40) {
                $("html, body").animate({ scrollTop: this.scrollDistance - 60}, 600);
                this.$el.find(".circle-icon").addClass("icon-rotate");
            } else {
               $("html, body").animate({ scrollTop: "0" }, 600);
               this.$el.find(".circle-icon").removeClass("icon-rotate");
            }
        },




        remove: function () {
            window.removeEventListener('scroll', this.scrollEventListener);
            Backbone.View.prototype.remove.call(this);
        },

        isMobile: function () {
            if ($(window).width() >= 900) {
                this.mobileMode = false;
            } else if ($(window).width() <= 900) {
                this.mobileMode = true;
            }
        },

        screenSize: function () {
            if (this.oldWidth) {
                if (this.oldWidth < 900 && $(window).width() > 900) {
                    this.mobileMode = false;
                    this.render();
                } else if (this.oldWidth > 900 && $(window).width() < 900) {
                    this.mobileMode = true;
                    this.render();
                } else {
                    return;
                }
            } else {
                this.oldWidth = $(window).width();
                this.screenSize();
            }
            this.oldWidth = $(window).width();
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

            var $follower = $('<div id="follower"></div>');
            $('body').append($follower);

            const mm = new MouseMover($follower, {
                model: this.model,
                app: this.app
            });
            $(window).mousemove(mm.start.bind(mm));
            $follower.click(mm.stop);
            this.app.vent.trigger("add-new-marker", this.model);
            this.hideGeometryOptions();
        },

        deleteMarker: function () {
            console.log('data detail deleteMarker()')
            this.model.set('geometry', null);
            //Backbone.Model.prototype.set.call(this.model, "geoometry", null);
            this.commitForm();
            this.model.save();
            this.render();

        },

        bindFields: function () {
            if (!this.model || !this.model.get("overlay_type")) {
                return;
            }
            var i, f;
            if (this.model.get("overlay_type").indexOf("form_") != -1) {
                var something = this.model.attributes;
                for (i = 0; i < this.model.get("fields").length; i++) {
                    /* https://github.com/powmedia/backbone-forms */
                    f = this.model.get("fields")[i];
                    f.val = this.model.get(f.col_name);
                }
            }
        },

        modelEvents: {
            'change:media': 'render',
            'commit-data-no-save': 'commitForm'
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

        getThumbnail: function () {
            if (this.getFeaturedImage()) {
                return this.getFeaturedImage();
            } else if (!_.isEmpty(this.model.get("children"))) {
                if (this.model.get("children").photos) {
                    var photoData = this.model.get("children").photos.data;
                    return photoData[0];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        },

        getFeaturedImage: function () {
            if (!this.model.get("children") || !this.model.get("extras") || !this.model.get("children").photos) {
                return null;
            }
            var featuredID = this.model.get("extras").featured_image,
                photoData = this.model.get("children").photos.data,
                i;
            for (i = 0; i < photoData.length; ++i) {
                if (photoData[i].id === featuredID) {
                    return photoData[i];
                }
            }
            return null;
        },
        getPhotos: function () {
            var media = this.model.get("media") || {},
                featuredImage = this.getFeaturedImage(),
                photos = media.photos ? new Photos(media.photos.data,
                    { projectID: this.app.getProjectID() }) : new Photos([],
                    { projectID: this.app.getProjectID() });
            if (featuredImage) {
                photos.remove(photos.get(featuredImage.id));
            }
            return photos;
        },
        getAudio: function () {
            var media = this.model.get("media") || {};
            return media.audio ? new Audio(media.audio.data,
                { projectID: this.app.getProjectID() }) : new Audio([],
                { projectID: this.app.getProjectID() });
        },
        getVideos: function () {
            var media = this.model.get("media") || {};
            return media.videos ? new Videos(media.videos.data,
                { projectID: this.app.getProjectID() }) : new Videos([],
                { projectID: this.app.getProjectID() });
        },

        viewRender: function () {
            //return;
            //any extra view logic. Carousel functionality goes here
            var c,
                photos = this.getPhotos(),
                videos = this.getVideos(),
                audio = this.getAudio(),
                that = this,
                panelStyles,
                genericList,
                i;
            if (this.panelStyles) {
                panelStyles = this.panelStyles;
            }
            if (photos.length > 0 || videos.length > 0) {
                console.log("Finding carousel photos / videos")
                genericList = [];
                genericList = genericList.concat(photos.toJSON());
                genericList = genericList.concat(videos.toJSON());
                for (i = 0; i < genericList.length; i++) {
                    genericList[i].id = (i + 1);
                }
                c = new Carousel({
                    model: this.model,
                    app: this.app,
                    mode: "videos",
                    collection: new Backbone.Collection(genericList),
                    panelStyles: panelStyles
                });
                this.$el.find(".carousel-videos-photos").append(c.$el);
            }
            if (audio.length > 0) {
                console.log("Finding carousel audio")
                audio.forEach(function (audioTrack) {
                    c = new AudioPlayer({
                        model: audioTrack,
                        app: that.app,
                        panelStyles: panelStyles,
                        audioMode: "detail",
                        className: "audio-detail"
                    });
                    that.$el.find(".carousel-audio").append(c.$el);
                });
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
            try {
                console.log(this.model.get('geometry').toString());
            }
            catch (error) {
                console.log('its null');
            }
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
            // setTimeout necessary to register DOM element
            //setTimeout(this.initDraggable.bind(this), 50);
            if ($(window).width() < 900) {
                setTimeout(this.initParallax.bind(this), 10);
            }
        },
        initParallax: function () {
            var that = this;
            $.fn.moveIt = function () {
                if (that.scrollEventListener) {
                    window.removeEventListener("scroll", that.scrollEventListener);
                }
                var $window = $(window),
                    instances = [],
                    moveItem;
                $(this).each(function () {
                    moveItem = new MoveItItem($(this), that);
                    moveItem.initPosition();
                    instances.push(moveItem);
                });
                window.addEventListener("scroll", function () {
                    var scrollTop = $window.scrollTop();
                    instances.forEach(function (inst) {
                        inst.update(scrollTop);
                    });
                });
            };
            that.$el.find('.parallax').moveIt();
        },

        rotatePhoto: function (e) {
            var $elem = $(e.target),
                rotation = $elem.attr("rotation");
            this.$el.find(".rotate-message").show();
            this.$el.find(".edit-photo").css({
                filter: "brightness(0.4)"
            });
            this.model.rotate(rotation, this.render);
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
                isNew = this.model.get("id") ? false : true;
            console.log(isNew);
            this.commitForm();
            this.model.save(null, {
                success: function (model, response) {
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
                    that.destroy();
                    //trigger an event that clears out the deleted model's detail:
                    that.app.vent.trigger('hide-detail');
                }, error: function(){
                    alert("Entry has not been deleted");
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
        },
        showStreetView: function (e) {
            var $elem = $(e.target);
            if ($elem.html() === "Show Street View") {
                this.app.vent.trigger('show-streetview', this.model);
                $elem.html('Show Map');
            } else {
                $elem.html('Show Street View');
                this.app.vent.trigger('hide-streetview');
            }
            e.preventDefault();
        },
        updateStreetViewButton: function () {
            this.$el.find('.streetview').html('Show Street View');
        },

        playAudio: function () {
            var audio = this.$el.find(".audio").first().get(0);
            if (this.$el.find('.thumbnail-play').hasClass('fa-play')) {
                this.$el.find('.thumbnail-play').addClass("fa-pause");
                this.$el.find('.thumbnail-play').removeClass("fa-play");
                audio.play();
            } else {
                this.$el.find('.thumbnail-play').addClass("fa-play");
                this.$el.find('.thumbnail-play').removeClass("fa-pause");
                audio.pause();
            }
        }
    });
    return MediaEditor;
});
