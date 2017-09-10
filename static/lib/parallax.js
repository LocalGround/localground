define([
    "jquery"
], function ($) {
    "use strict";

    var MoveItItem = function ($el, that) {

        var bgColor = that.$el.find('.circle').css('background-color');
        var mainColor = that.$el.find('.circle-icon').css('color');
        this.$el = $el;
        this.initialPosition = $el.position().top;
        this.initPosition = function () {
            this.targetTop = this.$el.attr('data-target-top').replace("%", "");
            this.finalPosition = parseFloat(this.targetTop, 10) * $(window).height() / 100;
            that.distance = this.initialPosition - this.finalPosition;
            that.scrollDistance = Math.abs($(window).height() - $(document).height());
            this.speed = that.distance / that.scrollDistance;
            this.className = this.$el.get(0).className;
            this.lastDirection = "up";
            this.lastScrollTop = 0;
             console.log("--------------------");
             console.log("className", this.className);
             console.log("initialPosition", this.initialPosition);
             console.log("finalPosition", this.finalPosition);
             console.log("scrollDistance", that.scrollDistance);
             console.log("distance", that.distance);
             console.log("speed", this.speed);
        };
        this.$el.css({
            position: "absolute"
        });
        this.holdOff = false;
        this.updateTimeout;

        this.initPosition();
        this.expand = function () {
            this.$el.find('.expanded').show();
            this.$el.find('.contracted').hide();
            this.$el.find('.parallax').removeClass('parallax-contracted');
            this.$el.find('.parallax').addClass('parallax-expanded');
            this.$el.find('.circle-icon').addClass("icon-rotate");

            // swap colors
            this.$el.find('.circle').css('background-color', mainColor);
            this.$el.find('.circle-icon').css('color', bgColor);
        };

        this.contract = function () {
            this.$el.find('.expanded').hide();
            this.$el.find('.contracted').show();
            this.$el.find('.parallax').removeClass('parallax-expanded');
            this.$el.find('.parallax').addClass('parallax-contracted');
            this.$el.find(".circle-icon").removeClass("icon-rotate");
            // swap colors
            this.$el.find('.circle').css('background-color', bgColor);
            this.$el.find('.circle-icon').css('color', mainColor);
        };
        this.update = function (scrollTop) {
            if (that.holdOff) {
                return;
            }
            var direction = (scrollTop > this.lastScrollTop) ? "up": "down";
            console.log(this.className, direction, scrollTop, this.lastScrollTop);
            var initialDivHeight = 90;
            //var endScroll = that.scrollDistance - initialDivHeight;
            //console.log(that.scrollDistance , initialDivHeight, endScroll, $('.black').css('top'), $('.body').css('top'), scrollTop);

            if (direction !== this.lastDirection) {
                var me = this;
                this.holdOff = true;
                if (me.updateTimeout) {
                    clearTimeout(this.updateTimeout);
                }
                me.updateTimeout = setTimeout(function () {
                    console.log("timeout!!");
                    me.holdOff = false;
                }, 500);
            }


            if (this.holdOff) {
                console.log(this.holdOff);
                return;
            }
            console.log(this.holdOff, direction);
            if (direction === "down") {
                this.contract();
                console.log("showSmallTemplate", that.distance, this.initialPosition - scrollTop * this.speed);
            } else {
                this.expand();
                console.log("showBigTemplate", that.distance, this.initialPosition - scrollTop * this.speed);
            }
            this.$el.css('top', this.initialPosition - scrollTop * this.speed);

            this.lastDirection = direction;
            this.lastScrollTop = scrollTop;
        };
    };
    return MoveItItem;
});
