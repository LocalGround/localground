define(["jquery", "underscore", "marionette", "handlebars", "text!../carousel/carousel.html"],
    function ($, _, Marionette, Handlebars, CarouselTemplate) {
        'use strict';
        var Carousel = Marionette.ItemView.extend({
            events: {
                "click .next": "next",
                "click .prev": "prev"
            },
            counter: 0,
            template: Handlebars.compile(CarouselTemplate),
            initialize: function (opts) {
                opts = opts || {};
                _.extend(this, opts);
                this.render();
                this.$el.addClass('active-slide');
                this.navigate(0);
            },

            navigate: function (direction) {
                var $items = this.$el.find('.carousel-content li'),
                    amount = $items.length;
                $items.removeClass('current');
                this.counter += direction;
                if (this.counter < 0) {
                    this.counter = amount - 1;
                }
                if (this.counter >= amount) {
                    this.counter = 0;
                }
                $($items[this.counter]).addClass('current');
            },

            next: function () {
                this.navigate(1);
            },

            prev: function () {
                this.navigate(-1);
            }
        });
        return Carousel;
    });
