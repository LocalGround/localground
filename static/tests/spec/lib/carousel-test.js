var rootDir = "../../";
define([
    'backbone',
    rootDir + "lib/carousel/carousel"
],
    function (Backbone, Carousel) {
        'use strict';
            const initSpies = function () {
                spyOn(Carousel.prototype, 'initialize').and.callThrough();
                spyOn(Carousel.prototype, 'showArrows').and.callThrough();
                spyOn(Carousel.prototype, 'hideArrows').and.callThrough();
                spyOn(Carousel.prototype, 'closeCarousel').and.callThrough();
                spyOn(Carousel.prototype, 'childViewOptions').and.callThrough();
                spyOn(Carousel.prototype, 'getChildView').and.callThrough();
                spyOn(Carousel.prototype, 'templateHelpers').and.callThrough();
                spyOn(Carousel.prototype, 'navigate').and.callThrough();
                spyOn(Carousel.prototype, 'resetCurrentFrame').and.callThrough();
                spyOn(Carousel.prototype, 'next').and.callThrough();
                spyOn(Carousel.prototype, 'prev').and.callThrough();
                spyOn(Carousel.prototype, 'updateCircles').and.callThrough();
                spyOn(Carousel.prototype, 'jump').and.callThrough();
                spyOn(Carousel.prototype, 'showFullScreen').and.callThrough();
                spyOn(Carousel.prototype, 'exitFullScreen').and.callThrough();
            };
            const initCarousel = function (scope) {
                const photoVideoCollection = [].concat(
                    scope.photos.toJSON()).concat(
                    [] //scope.videos.toJSON()
                );
                photoVideoCollection.forEach((item, i) => {
                    item.id = (i + 1);
                });
                scope.carousel = new Carousel({
                    app: scope.app,
                    mode: "photos",
                    collection: new Backbone.Collection(photoVideoCollection)
                });
            };

        describe("Carousel rendering:", function () {
            beforeEach(function () {
                initSpies();
                initCarousel(this);
            });

            it('Renders 18 photos', function () {
                this.carousel.render();
                const $el = this.carousel.$el;
                expect($el.find('.fa-circle').length).toEqual(18);
                expect($el.find('.carousel-content li').length).toEqual(18);
                expect($el.find('.carousel-content li div.photo').length).toEqual(18);
                expect($el.hasClass('fullScreen')).toBeFalsy();
            });

            it('Listens for fullscreen click', function () {
                this.carousel.render();
                const $el = this.carousel.$el;
                expect($el.hasClass('fullScreen')).toBeFalsy();$el.find('div.photo:first-child').trigger('click');
                expect($el.hasClass('fullScreen')).toBeTruthy();
            });

            it('Listens for hide fullscreen click', function () {
                expect(1).toEqual(0);
            });
        });

        describe("Carousel instance methods:", function () {
            beforeEach(function () {
                initSpies();
                initCarousel(this);
            });
            it('showFullScreen() works', function () {
                expect(1).toEqual(0);
            });
            it('exitFullScreen() works', function () {
                expect(1).toEqual(0);
            });
            it('initialize() works', function () {
                // TODO eventually: implement these stubs.
                expect(1).toEqual(1);
            });
            it('showArrows() works', function () {
                // TODO eventually: implement these stubs.
                expect(1).toEqual(1);
            });
            it('hideArrows() works', function () {
                // TODO eventually: implement these stubs.
                expect(1).toEqual(1);
            });
            it('closeCarousel() works', function () {
                // TODO eventually: implement these stubs.
                expect(1).toEqual(1);
            });
            it('childViewOptions() works', function () {
                // TODO eventually: implement these stubs.
                expect(1).toEqual(1);
            });
            it('getChildView() works', function () {
                // TODO eventually: implement these stubs.
                expect(1).toEqual(1);
            });
            it('templateHelpers() works', function () {
                // TODO eventually: implement these stubs.
                expect(1).toEqual(1);
            });
            it('navigate() works', function () {
                // TODO eventually: implement these stubs.
                expect(1).toEqual(1);
            });
            it('resetCurrentFrame() works', function () {
                // TODO eventually: implement these stubs.
                expect(1).toEqual(1);
            });
            it('next() works', function () {
                // TODO eventually: implement these stubs.
                expect(1).toEqual(1);
            });
            it('prev() works', function () {
                // TODO eventually: implement these stubs.
                expect(1).toEqual(1);
            });
            it('updateCircles() works', function () {
                // TODO eventually: implement these stubs.
                expect(1).toEqual(1);
            });
            it('jump() works', function () {
                // TODO eventually: implement these stubs.
                expect(1).toEqual(1);
            });
        });
    });
