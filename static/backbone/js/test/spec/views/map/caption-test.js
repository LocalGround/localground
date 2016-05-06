/**
 * Created by zmmachar on 2/18/15.
 */
define(["underscore",
        "views/maps/caption/caption",
        "models/snapshot",
        "../../../../test/spec-helper"],
    function (_, CaptionManager, Snapshot) {
        'use strict';
        var captionManager, that, snapshot;
        var container = 'map-canvas';

        describe("CaptionManager: Test that it initializes correctly", function () {

            it("Loads correctly if an initial view is passed in", function () {
                that = this;
                snapshot = new Snapshot(this.snapshot);
                expect(function () {
                    captionManager = new CaptionManager({
                        container: container,
                        app: that.app,
                        snapshot: snapshot
                    });
                }).not.toThrow();
            });

        });

        describe("CaptionManager: Check that caption loads correctly", function () {

            it("Renders the caption", function () {
                snapshot = new Snapshot(this.snapshot);
                spyOn(CaptionManager.prototype, 'render').and.callThrough();
                captionManager = new CaptionManager({
                    caption: container,
                    app: this.app,
                    snapshot: snapshot
                });
                //CaptionManager doesn't implement render, so we actually want to check its prototype here
                expect(CaptionManager.prototype.render).toHaveBeenCalled();
                expect(captionManager.$el.find('#caption').text()).toEqual(' ' + this.snapshot.caption + ' ');
            });

            it("Does nothing if there is no caption", function () {
                snapshot = new Snapshot();
                spyOn(CaptionManager.prototype, 'render').and.callThrough();
                captionManager = new CaptionManager({
                    caption: container,
                    app: this.app,
                    snapshot: snapshot
                });
                expect(captionManager.$el.children().length).toEqual(0);
            });

            it("Toggles caption box when caption is clicked", function () {
                snapshot = new Snapshot(this.snapshot);
                spyOn(CaptionManager.prototype, 'toggleCaption');
                captionManager = new CaptionManager({
                    caption: container,
                    app: this.app,
                    snapshot: snapshot
                });
                captionManager.$el.find('#caption-toggle').click();
                expect(captionManager.toggleCaption).toHaveBeenCalled();
            });
        });
    });
