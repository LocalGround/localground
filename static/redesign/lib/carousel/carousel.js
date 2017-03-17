define(["jquery", "underscore", "marionette", "handlebars",
        "collections/photos", "collections/audio", "lib/audio/audio-player",
        "text!../carousel/carousel-photo.html", "text!../carousel/carousel-audio.html",
        "text!../carousel/carousel-photo-item.html"],
    function ($, _, Marionette, Handlebars, Photos, Audio, AudioPlayer,
              CarouselPhotoTemplate, CarouselAudioTemplate, PhotoItemTemplate) {
        'use strict';
        var Carousel = Marionette.CompositeView.extend({
            events: {
                "click .next": "next",
                "click .prev": "prev",
                "click .show-slide": "jump"
            },
            counter: 0,
            mode: "photos",
            childViewContainer: ".carousel-content",
            initialize: function (opts) {
                _.extend(this, opts);
                if (this.mode == "photos") {
                    this.template = Handlebars.compile(CarouselPhotoTemplate);
                    this.collection = new Photos(this.model.get("children").photos.data);
                } else {
                    this.template = Handlebars.compile(CarouselAudioTemplate);
                    this.collection = new Audio(this.model.get("children").audio.data);
                }
                this.render();
                if (this.collection.length > 1) {
                    this.$el.addClass('active-slide');
                }
                this.navigate(0);
            },
            childViewOptions: function () {
                return {
                    mode: this.mode,
                    app: this.app,
                    num_children: this.collection.length
                };
            },
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                        if (this.mode == "photos") {
                            this.template = Handlebars.compile(PhotoItemTemplate);
                        } else {
                            this.template = Handlebars.compile("<div class='player-container audio-detail'></div>");
                        }
                    },
                    templateHelpers: function () {
                        console.log(this.num_children);
                        return {
                            num_children: this.num_children
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
                $items.removeClass('current');
                if (this.counter < 0) {
                    this.counter = amount - 1;
                }
                if (this.counter >= amount) {
                    this.counter = 0;
                }
                this.updateCircles();
                $($items[this.counter]).addClass('current');
            },

            next: function () {
                this.counter += 1;
                this.navigate();
            },

            prev: function () {
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
                this.counter = parseInt($(e.target).attr("data-index"), 10);
                this.navigate();
            }
        });
        return Carousel;
    });
