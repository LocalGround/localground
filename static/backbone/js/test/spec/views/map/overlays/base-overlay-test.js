define([], function () {
    'use strict';
    var overlay;
    /*
     * Overriding the initialization function so that this test doesn't
     * have to rely on the Google Maps API
     */
    return {
        genericChecks: function (name, BaseClass) {
            var that;
            beforeEach(function () {
                // don't call functions that require Google Maps functionality:
                spyOn(BaseClass.prototype, "initInfoBubble");
                spyOn(BaseClass.prototype, "redraw");
                spyOn(BaseClass.prototype, "initOverlayType");
                spyOn(BaseClass.prototype, "changeMode");
            });

            describe(name + ": Test that it initializes correctly", function () {
                it("Loads correctly", function () {
                    that = this;
                    expect(function () {
                        overlay = new BaseClass({
                            app: that.app,
                            model: that.map_images.at(0)
                        });
                    }).not.toThrow();
                    expect(BaseClass.prototype.initInfoBubble).toHaveBeenCalled();
                    expect(BaseClass.prototype.initOverlayType).toHaveBeenCalled();
                });

                it("Listens for changeMode", function () {
                    overlay = new BaseClass({
                        app: that.app,
                        model: that.map_images.at(0)
                    });
                    that.app.vent.trigger("mode-change");
                    expect(BaseClass.prototype.changeMode).toHaveBeenCalled();
                });
            });
        }
    };
});