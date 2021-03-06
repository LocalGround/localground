define(["jquery", "underscore", "marionette", "handlebars",
        "text!../carousel/carousel-container.html",
        "text!../carousel/carousel-video-item.html",
        "text!../carousel/carousel-photo-item.html"
    ],
    function ($, _, Marionette, Handlebars,
              CarouselContainerTemplate, VideoItemTemplate, PhotoItemTemplate) {
        'use strict';
        var Carousel = Marionette.CompositeView.extend({
            events: {
                "click .next": "next",
                "click .prev": "prev",
                "click .show-slide": "jump",
                "click .close": "closeCarousel",
                'mouseover .carouselbox': 'showArrows',
                'mouseout .carouselbox': 'hideArrows',
                'click .photo': 'showFullScreen',
                'click .close-fullscreen': 'exitFullScreen'
            },
            counter: 0,
            className: "active-slide",
            childViewContainer: ".carousel-content",
            initialize: function (opts) {
                _.extend(this, opts);
                this.fullScreen = false;
                this.template = Handlebars.compile(CarouselContainerTemplate);
                this.render();
                this.navigate(0);
            },

            showArrows: function () {
                var $leftArrow, $rightArrow;
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                } else {
                    if (this.collection.length > 1) {
                        $leftArrow = $('<i class="fa fa-chevron-left prev"></i>');
                        $rightArrow = $('<i class="fa fa-chevron-right next"></i>');
                        this.$el.find('.carouselbox').append($leftArrow).append($rightArrow);
                    }
                }
            },
            hideArrows: function () {
                var that = this;
                this.timeout = setTimeout(function () {
                    that.$el.find('.fa-chevron-left, .fa-chevron-right').remove();
                    that.timeout = null;
                }, 100);
            },
            closeCarousel: function(){
                resetCurrentFrame();
                var $items = this.$el.find('.carousel-content li');
                $items.removeClass('current').hide();
            },
            childViewOptions: function () {
                return {
                    app: this.app,
                    num_children: this.collection.length,
                    parent: this,
                    panelStyles: this.panelStyles,
                    fullScreen: this.fullScreen
                };
            },
            getChildView: function (model) {
                //console.log(model.get("overlay_type"));
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                        if (model.get("overlay_type") == "photo") {
                            this.template = Handlebars.compile(PhotoItemTemplate);
                        } else if (model.get("overlay_type") == "video") {
                            this.template = Handlebars.compile(VideoItemTemplate);
                        }
                    },
                    templateHelpers: function () {
                        //console.log('template helpers', this.fullScreen, parent.fullScreen);
                        var paragraph;
                        if (this.panelStyles) {
                            paragraph = this.panelStyles.paragraph;
                        }
                        return {
                            num_children: this.num_children,
                            paragraph: paragraph,
                            fullScreen: this.fullScreen
                        };
                    },
                    tagName: "li"
                });
            },

            templateHelpers: function () {
                var paragraph;
                if (this.panelStyles) {
                    paragraph = this.panelStyles.paragraph;
                }
                return {
                    num_children: this.collection.length,
                    isSpreadsheet: this.app.screenType === "spreadsheet",
                    paragraph: paragraph,
                    fullScreen: this.fullScreen
                };
            },

            navigate: function () {
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
                //needed to stop playing media
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
                $items.removeClass("fas");
                $items.not($clicked).addClass("far");
                $clicked.addClass("fas");
            },

            jump: function (e) {
                this.resetCurrentFrame();
                this.counter = parseInt($(e.target).attr("data-index"), 10);
                this.navigate();
            },
            showFullScreen: function() {
                if (this.$el.hasClass('fullScreen')) {
                    return;
                }
                this.hideArrows();
                this.fullScreen = true;
                this.$el.find('.close-fullscreen').show();

                this.children.each(function(child) {
                    child.fullScreen = true;
                    child.render();
                });
                this.$el.addClass('fullScreen');
            },
            exitFullScreen: function() {
                this.fullScreen = false;
                this.$el.find('.close-fullscreen').hide();
                this.children.each(function(child) {
                    child.fullScreen = false;
                    child.render();
                });
                this.$el.removeClass('fullScreen');
            }
        });
        return Carousel;
    });
