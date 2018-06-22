var rootDir = "../../";
define([
    rootDir + "lib/maps/controls/mouseMover",
    rootDir + 'lib/maps/overlays/icon'
],
    function (MouseMover, Icon) {
        'use strict';
        // note: these tests mock a significant amount of the functionality
        // carried out by the google maps api
        var initMouseMover = (scope) => {

            // add spies for all relevant objects and initialize MouseMover:
            spyOn(scope.app.vent, 'trigger');


            // 2) add dummy HTML elements:
            scope.fixture = setFixtures('<div></div>');


            // mock event object
            const mockEvent = {
                clientY: 101,
                clientX: 333
            }

            scope.mm = new MouseMover(mockEvent, {
                app: scope.app
            });


        };

        describe("MouseMover: Initialization Tests", function () {
            beforeEach(function () {
                initMouseMover(this);
            });
            afterEach(function() {
                this.mm.stop({
                    clientY: 201,
                    clientX: 233
                });
            })

            it("MouseMover Initialization called successfully ", function () {
                expect(this.mm.size).toEqual(35);
                expect(this.mm.color).toEqual('#ed867d');
            });
            it("generateIcon() works ", function () {
                expect($('html')).not.toContainElement('svg');
                this.mm.generateIcon();

                expect(this.mm.icon.width).toEqual(35);
                expect(this.mm.icon.strokeWeight).toEqual(6);
                expect(this.mm.icon.fillColor).toEqual('#ed867d');

                expect($('#follower')).toContainElement('svg');
            });

            it("start() works", function() {
                expect(() => {
                    this.mm.start();
                }).not.toThrow();
            });
            it("stop() works", function() {
                this.mm.stop({
                    clientY: 201,
                    clientX: 233
                });
                expect(this.app.vent.trigger).toHaveBeenCalledWith('point-complete', {
                    x: 233,
                    y: 201
                });

            });
            it("mouseListener() works", function() {
                this.mm.generateIcon();
                this.mm.mouseListener({
                    clientY: 201,
                    clientX: 233
                });
                expect($('#follower').css('top')).toEqual(201 - 35 * 3 / 4 + 4 + 'px');
                expect($('#follower').css('left')).toEqual(233 - 35 * 3 / 4 + 'px');
            });

        });
    });
