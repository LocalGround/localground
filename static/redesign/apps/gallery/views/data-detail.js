define([
    "jquery",
    "underscore",
    "backbone",
    "handlebars",
    "marionette",
    "collections/photos", "collections/audio", "collections/videos",
    "text!../templates/photo-detail.html",
    "text!../templates/audio-detail.html",
    "text!../templates/video-detail.html",
    "text!../templates/record-detail.html",
    "text!../templates/map-image-detail.html",
    "text!../templates/mobile-expand.html",
    "lib/audio/audio-player",
    "lib/carousel/carousel",
    "lib/maps/overlays/icon",
    "lib/forms/backbone-form",
    "touchPunch"
], function ($, _, Backbone, Handlebars, Marionette, Photos, Audio, Videos,
        PhotoTemplate, AudioTemplate, VideoTemplate, SiteTemplate,
        MapImageTemplate, MobileExpandTemplate, AudioPlayer, Carousel, Icon, DataForm) {
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
            "click #delete-geometry": "deleteMarker",
            "click #add-rectangle": "activateRectangleTrigger",
            "click .streetview": 'showStreetView',
            "click #open-full": 'openMobileDetail',
            "click .thumbnail-play-circle": 'playAudio'
        },
        getTemplate: function () {
            console.log(this.dataType, this.mobileView );
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
            if (this.mobileView == "expanded") {
                console.log("compile mobile expand");
                return Handlebars.compile(MobileExpandTemplate);
            }
            return Handlebars.compile(SiteTemplate);
        },
        featuredImageID: null,
        initialize: function (opts) {
            this.mobileView = null;
            _.extend(this, opts);
            this.bindFields();
            this.dataType = this.dataType || this.app.dataType;
            Marionette.ItemView.prototype.initialize.call(this);
            $('#marker-detail-panel').addClass('mobile-minimize');
            $(window).on("resize", _.bind(this.screenSize, this));
           // $(window).scroll(this.detectScroll);
         //   $(window).on("scroll",  _.bind(this.detectScroll, this));
           // $(document).on('scrollstart', _.bind(this.detectScroll, this));
            //$(window).on("scroll",  _.bind(this.detectScroll, this))
            this.isMobile();
            this.listenTo(this.app.vent, 'show-min-screen', this.contractMobile);
            this.listenTo(this.app.vent, 'show-max-screen', this.expandMobile);
            this.listenTo(this.app.vent, 'save-model', this.saveModel);
            this.listenTo(this.app.vent, 'streetview-hidden',           this.updateStreetViewButton);
        },

        expandMobile: function () {
            console.log("render expandMobile", this);
            this.mobileView = "expanded";
            this.getTemplate();
            this.render();
        },
        contractMobile: function () {
            console.log("render contractMobile", this);
            this.mobileView = null;
            this.getTemplate();
            this.render();
        },

        detectScroll: function (event) {
            console.log("scrolling");
            var triggerHeight = screen.height - (screen.height/3),
            scrollHeight = parseInt(this.$el.find('#parallax-body').css('top'), 10);

            /*
            var oldTranslateY = $('#parallax-body').css("transform"),
            dragEl = document.getElementById("parallax-body"),
            translateY = this.getComputedTranslateY(document.getElementById("parallax-body"));
            $('.min-thumbnail').remove();
            console.log(oldTranslateY, this.getComputedTranslateY(dragEl), translateY);
            */
            console.log(scrollHeight, triggerHeight, scrollHeight < triggerHeight, this.mobileView !== "expanded", "this.mobileview = " + this.mobileView );
            if (scrollHeight < triggerHeight && this.mobileView !== "expanded") {
                console.log("expand!");
                this.expandMobile();
               // $(window).scrollTop(screen.height/2.5);
            }
           // if (this.$el.find(".parallax."))
        },

        getComputedTranslateY: function(object) {
            if(!window.getComputedStyle) return;
            var style = getComputedStyle(object),
                transform = style.transform;
            var mat = transform.match(/^matrix3d\((.+)\)$/);
            if(mat) return parseFloat(mat[1].split(', ')[13]);
            mat = transform.match(/^matrix\((.+)\)$/);
            return mat ? parseFloat(mat[1].split(', ')[5]) : 0;
        },

        initParallax: function () {
            var that = this;
            var MoveItItem = function (el) {
                this.initialPosition = $(el).position().top;
                this.calculateDimensions = function () {
                    this.targetTop = this.$el.attr('data-target-top').replace("%", "");
                    this.finalPosition = parseFloat(this.targetTop, 10) * $(window).height() / 100;
                    that.distance = this.initialPosition - this.finalPosition;
                    this.scrollDistance = Math.abs($(window).height() - $(document).height());
                    this.speed = that.distance / this.scrollDistance;
                };
                this.$el = $(el).css({
                    position: "fixed",
                    top: this.initialPosition
                });

                this.calculateDimensions();

                this.lastDirection = "up";
                this.lastScrollTop = 0;

                this.update = function (scrollTop) {
                    var direction = (scrollTop > this.lastScrollTop) ? "up": "down";
                    if (direction !== this.lastDirection) {
                        console.log('switch');
                    }
                    if (direction == "down" && scrollTop <= 50) {
                        this.calculateDimensions();
                        console.log(that.distance);
                        console.log("showSmallTemplate", that.distance);
                    }

                    if (direction == "up" && scrollTop >= 200) {
                        this.calculateDimensions();                        //console.log(that.distance);
                        console.log("showBigTemplate", that.distance);
                    }
                    this.$el.css('top', this.initialPosition - scrollTop * this.speed);

                    //remember last values:
                    this.lastDirection = direction;
                    this.lastScrollTop = scrollTop;
                };
            };
            $.fn.moveIt = function () {
                var $window = $(window),
                    instances = [];
                $(this).each(function () {
                    instances.push(new MoveItItem($(this)));
                });

                window.onscroll = function () {
                    var scrollTop = $window.scrollTop();
                    instances.forEach(function (inst) {
                        inst.update(scrollTop);
                    });
                };
            };
            $(function () {
                $(window).scrollTop(0);
                $('.parallax').moveIt();
            });
        },



        /*initDraggable: function () {
            return;
            var that = this;

            $( '#marker-detail-panel' ).draggable({
               // handle: '.body-section',
                axis: 'y',
                handle: '.body-section',

                drag: function (event, ui) {
                    if  (ui.position.top <= 0) {
                        console.log("stop");
                    } else {
                        $('#marker-detail-panel').css('max-height', 'none');
                        $('.body-section').css('max-height', '50%');
                    //  $('.top-section').css('height', 'auto');
                        //var top = parseFloat($('.body-section').css('top'));
                        var top =  screen.height - ui.position.top;
                        console.log("dragging", top, screen.height, ui.position.top);

                        $('#marker-detail-panel').css({
                            'height':'auto',
                            'max-height': 'auto',
                        });

                        $('.body-section').css({
                            'height': top

                        });

                        $('.top-section').css({
                            'height': screen.height - ui.position.top
                        })

                        $('#presentation-title').css({
                            'opacity': 0
                        })

                        $('#legend').css({
                            'opacity': 0
                        })
                    }
                }
            });
        },*/

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
            //Define Class:
            var that = this, MouseMover, $follower, mm;
            MouseMover = function ($follower) {

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
                    that.icon = new Icon({
                        shape: shape,
                        strokeWeight: 6,
                        fillColor: that.model.collection.fillColor,
                        width: that.model.collection.size,
                        height: that.model.collection.size
                    }).generateGoogleIcon();
                    that.icon.width *= 1.5;
                    that.icon.height *= 1.5;
                    $follower.html(template(that.icon));
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
                        top: event.clientY - that.icon.height * 3 / 4 + 4,
                        left: event.clientX - that.icon.width * 3 / 4
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

        deleteMarker: function () {
            this.model.set("geometry", null);
            this.commitForm();
            this.model.save();
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
            "change:children": "render",
            "commit-data-no-save": "commitForm"
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
            var lat, lng, paragraph;
            if (this.model.get("geometry") && this.model.get("geometry").type === "Point") {
                lat =  this.model.get("geometry").coordinates[1].toFixed(4);
                lng =  this.model.get("geometry").coordinates[0].toFixed(4);
            }

            if (this.panelStyles) {
                paragraph = this.panelStyles.paragraph;
                this.$el.find('#marker-detail-panel').css('background-color', '#' + paragraph.backgroundColor);
                this.$el.find('.active-slide').css('background', 'paragraph.backgroundColor');
            }
            console.log("featured image: ", this.getFeaturedImage());
            console.log(this.mobileMode);

            return {
                mode: this.app.mode,
                dataType: this.dataType,
                audioMode: "detail",
                name: this.model.get("name") || this.model.get("display_name"),
                screenType: this.app.screenType,
                lat: lat,
                lng: lng,
                paragraph: paragraph,
                featuredImage: this.getFeaturedImage(),
                thumbnail: this.getThumbnail(),
                photo_count: this.getPhotos().length,
                audio_count: this.getAudio().length,
                video_count: this.getVideos().length,
                mobileMode: this.mobileMode,
                hasAudio: this.getAudio().length,
                video_photo_count: this.getVideos().length + this.getPhotos().length
            };
        },

        getThumbnail: function () {
            if (this.getFeaturedImage()) {
                return this.getFeaturedImage();
            } else if (!_.isEmpty(this.model.get("children"))) {
                console.log(this.model.get("children"));
                var photoData = this.model.get("children").photos.data;
                return photoData[0];
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
            var children = this.model.get("children") || {},
                featuredImage = this.getFeaturedImage(),
                photos = children.photos ? new Photos(children.photos.data) : new Photos([]);
            if (featuredImage) {
                photos.remove(photos.get(featuredImage.id));
            }
            return photos;
        },
        getAudio: function () {
            var children = this.model.get("children") || {};
            return children.audio ? new Audio(children.audio.data) : new Audio([]);
        },
        getVideos: function () {
            var children = this.model.get("children") || {};
            return children.videos ? new Videos(children.videos.data) : new Videos([]);
        },
        viewRender: function () {
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
            console.log(this.dataType, "On Render");
            if (this.app.mode == "view" || this.app.mode == "presentation") {
                this.viewRender();
            } else {
                this.editRender();
            }
            if (this.dataType == "audio") {
                console.log("Audio player initialized")
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
                this.initParallax();
            }
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
            this.commitForm();
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
                    console.log("about to hide details'")
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
        openMobileDetail: function () {

            console.log("init darggable", $( ".body-section" ));
            if ($('#marker-detail-panel').hasClass('mobile-minimize')) {

                $('#marker-detail-panel').addClass('mobile-full');
                $('#marker-detail-panel').removeClass('mobile-minimize');

                $('#legend').addClass('mobile-full-legend');
                $('#legend').removeClass('mobile-minimize-legend');

                $('#presentation-title').addClass('mobile-full-title');
                $('#presentation-title').removeClass('mobile-minimize-title');

            } else if ($('#marker-detail-panel').hasClass('mobile-full')) {

                $('#marker-detail-panel').addClass('mobile-minimize');
                $('#marker-detail-panel').removeClass('mobile-full');

                $('#legend').addClass('mobile-minimize-legend');
                $('#legend').removeClass('mobile-full-legend');

                $('#presentation-title').addClass('mobile-minimize-title');
                $('#presentation-title').removeClass('mobile-full-title');
            }

            console.log("mobile toggle");

        },

        playAudio: function () {
            var audio = this.$el.find(".audio").first().get(0);
            if (this.$el.find('.thumbnail-play').hasClass('fa-play')) {
                this.$el.find('.thumbnail-play').addClass("fa-pause");
                this.$el.find('.thumbnail-play').removeClass("fa-play");
                console.log("play audio");
                audio.play();
            } else {
                this.$el.find('.thumbnail-play').addClass("fa-play");
                this.$el.find('.thumbnail-play').removeClass("fa-pause");
                console.log("pause audio");
                audio.pause();
            }
        }
    });
    return MediaEditor;
});
