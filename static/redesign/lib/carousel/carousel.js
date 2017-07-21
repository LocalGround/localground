define(["jquery", "underscore", "marionette", "handlebars",
        "collections/photos", "collections/audio", "collections/videos", "lib/audio/audio-player",
        "text!../carousel/carousel-container.html", "text!../carousel/carousel-container-audio.html",
        "text!../carousel/carousel-video-item.html",
        "text!../carousel/carousel-photo-item.html"],
    function ($, _, Marionette, Handlebars, Photos, Audio, Videos, AudioPlayer,
              CarouselContainerTemplate, CarouselContainerAudioTemplate, VideoItemTemplate, PhotoItemTemplate) {
        'use strict';
        var Carousel = Marionette.CompositeView.extend({
            events: {
                "click .next": "next",
                "click .prev": "prev",
                "click .show-slide": "jump",
                'mouseover .carouselbox': 'showArrows',
                'mouseout .carouselbox': 'hideArrows'
            },
            counter: 0,
            className: "active-slide",
            mode: "photos",
            childViewContainer: ".carousel-content",
            initialize: function (opts) {
                _.extend(this, opts);
                if (this.mode == "photos") {
                    this.template = Handlebars.compile(CarouselContainerTemplate);
                    var photos = this.model.get("children").photos.data;
                    this.collection = new Photos(this.filterFeaturedImage(photos));
                } else if (this.mode == "videos") {
                    this.template = Handlebars.compile(CarouselContainerTemplate);
                    this.collection = new Videos(this.model.get("children").videos.data);
                } else {
                    this.template = Handlebars.compile(CarouselContainerAudioTemplate);
                    this.collection = new Audio(this.model.get("children").audio.data);
                }
                this.render();
                //this.$el.addClass('active-slide');
                if (this.collection.length == 1 && this.mode !== "audio") {
                    this.$el.addClass('short');
                }
                this.navigate(0);
            },
            filterFeaturedImage: function(photos){
                var photosClone = _.clone(photos)
                var featuredImageID = this.featuredImage.id;
                for (var i = 0 ; i < photosClone.length; ++i){
                    if (featuredImageID == photosClone[i].id){
                        console.log("take out featured image");
                        photosClone.splice(i,1);
                    }
                }
                return photosClone;
            },

            showArrows: function () {
                if (this.mode === "audio" || this.collection.length === 1) {
                    return;
                }
                var $leftArrow, $rightArrow;
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                } else {
                    $leftArrow = $('<i class="fa fa-chevron-left prev"></i>');
                    $rightArrow = $('<i class="fa fa-chevron-right next"></i>');
                    this.$el.find('.carouselbox').append($leftArrow).append($rightArrow);
                }
            },
            hideArrows: function () {
                if (this.mode === "audio" || this.collection.length === 1) {
                    return;
                }
                var that = this;
                this.timeout = setTimeout(function () {
                    that.$el.find('.fa-chevron-left, .fa-chevron-right').remove();
                    that.timeout = null;
                }, 100);
            },
            childViewOptions: function () {
                return {
                    mode: this.mode,
                    app: this.app,
                    num_children: this.collection.length,
                    parent: this
                };
            },
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                        if (this.mode == "photos") {
                            this.template = Handlebars.compile(PhotoItemTemplate);
                        } else if (this.mode == "videos") {
                            this.template = Handlebars.compile(VideoItemTemplate);
                        } else {
                            this.template = Handlebars.compile("<div class='player-container audio-detail'></div>");
                        }
                    },
                    templateHelpers: function () {
                        console.log(this.num_children);
                        return {
                            num_children: this.num_children,
                            mode: this.mode
                        };
                    },
                    tagName: "li",
                    onRender: function () {
                        if (this.mode == "audio") {
                            var player = new AudioPlayer({
                                model: this.model,
                                audioMode: "detail",
                                app: this.app
                            });
                            this.$el.find('.player-container').append(player.$el);
                        }
                    }
                });
            },

            templateHelpers: function () {
                return {
                    num_children: this.collection.length,
                    isSpreadsheet: this.app.screenType === "spreadsheet"
                };
            },

            navigate: function () {
                if (this.mode == "audio") {
                    this.app.vent.trigger('audio-carousel-advanced');
                }
                var $items = this.$el.find('.carousel-content li'),
                    amount = this.collection.length;
                $items.removeClass('current').hide();
                if (this.counter < 0) {
                    this.counter = amount - 1;
                }
                if (this.counter >= amount) {
                    this.counter = 0;
                }
                this.updateCircles();
                $($items[this.counter]).addClass('current').show();
            },

            resetCurrentFrame: function () {
                //needed to stop playing iFrame videos:
                this.children.findByIndex(this.counter).render();
            },

            next: function () {
                this.resetCurrentFrame();
                this.counter += 1;
                this.navigate();
            },

            prev: function () {
                this.resetCurrentFrame();
                this.counter -= 1;
                this.navigate();
            },

            updateCircles: function () {
                var $items = this.$el.find('.show-slide'),
                    $clicked = $($items[this.counter]);
                $items.removeClass("fa-circle");
                $items.not($clicked).addClass("fa-circle-o");
                $clicked.addClass("fa-circle");
            },

            jump: function (e) {
                this.resetCurrentFrame();
                this.counter = parseInt($(e.target).attr("data-index"), 10);
                this.navigate();
            }
        });
        return Carousel;
    });
