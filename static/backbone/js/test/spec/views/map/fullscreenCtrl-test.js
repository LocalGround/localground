/**
 * Created by zmmachar on 2/18/15.
 */
define(["underscore",
        "lib/maps/controls/fullScreenCtrl",
        "../../../../test/spec-helper"],
    function (_, FullScreenCtrl) {
        'use strict';
        var fullScreenCtrl, that;
        var container = 'map-canvas';

        describe("FullScreenCtrl: Test that it initializes correctly", function () {

            it("Loads correctly", function () {
                that = this;
                expect(function () {
                    fullScreenCtrl = new FullScreenCtrl({
                        el: container,
                        app: that.app
                    });
                }).not.toThrow();
            });

        });

        describe("FullScreenCtrl: Test button functionality", function () {

            it("Fires toggleFullscreen when button is clicked", function () {
                spyOn(FullScreenCtrl.prototype, 'toggleFullScreen');
                fullScreenCtrl = new FullScreenCtrl({
                        el: container,
                        app: that.app
                });

                fullScreenCtrl.$el.click();
                expect(fullScreenCtrl.toggleFullScreen).toHaveBeenCalled();
            });
        });

    });
