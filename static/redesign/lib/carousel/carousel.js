define(["jquery", "underscore", "marionette", "handlebars",
        "text!../carousel/carousel-photo.html", "text!../carousel/carousel-audio.html"],
    function ($, _, Marionette, Handlebars, CarouselPhotoTemplate, CarouselAudioTemplate) {
        'use strict';
        var Carousel = Marionette.ItemView.extend({
            events: {
                "click .next": "next",
                "click .prev": "prev",
                "click .show-slide": "jump"
            },
            counter: 0,
            mode: "photo",
            initialize: function (opts) {
                _.extend(this, opts);
                if (this.mode == "photo") {
                    this.template = Handlebars.compile(CarouselPhotoTemplate);
                } else {
                    this.template = Handlebars.compile(CarouselAudioTemplate);
                }
                this.render();
                this.$el.addClass('active-slide');
                this.navigate(0);
            },
            numPhotos: function () {
                var children = this.model.get("children");
                if (children && children.photos && children.photos.data) {
                    return children.photos.data.length;
                }
                return 0;
            },
            templateHelpers: function () {
                return {
                    num_photos: this.numPhotos(),
                    isSpreadsheet: this.app.screenType === "spreadsheet"
                };
            },

            navigate: function () {
                var $items = this.$el.find('.carousel-content li'),
                    amount = $items.length;
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
