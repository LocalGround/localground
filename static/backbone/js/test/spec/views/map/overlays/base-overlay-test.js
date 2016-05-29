define([], function () {
    'use strict';
    var overlay;
    /*
     * Overriding the initialization function so that this test doesn't
     * have to rely on the Google Maps API
     */
    return {
        genericChecks: function (name, overlay_type, BaseClass) {
            var that,
                initOverlay = function (scope) {
                    return new BaseClass({
                        app: scope.app,
                        model: scope.getModelByOverlayType(overlay_type)
                    });
                };
            beforeEach(function () {
                // don't call functions that require Google Maps functionality:
                spyOn(BaseClass.prototype, "initInfoBubble");
                spyOn(BaseClass.prototype, "redraw");
                spyOn(BaseClass.prototype, "initOverlayType");
                spyOn(BaseClass.prototype, "changeMode");
                spyOn(BaseClass.prototype, "restoreState").and.callThrough();

                // model events:
                spyOn(BaseClass.prototype, "show");
                spyOn(BaseClass.prototype, "hide");
                spyOn(BaseClass.prototype, "zoomTo");

                // not implemented by map-image overlay:
                spyOn(BaseClass.prototype, "updateOverlay");
                spyOn(BaseClass.prototype, "render");
                spyOn(BaseClass.prototype, "restoreModelGeometry");
            });

            describe(name + ": Test that it initializes correctly", function () {
                it("Loads correctly", function () {
                    that = this;
                    expect(function () {
                        overlay = initOverlay(that);
                    }).not.toThrow();
                    expect(BaseClass.prototype.initInfoBubble).toHaveBeenCalled();
                    expect(BaseClass.prototype.initOverlayType).toHaveBeenCalled();
                    expect(BaseClass.prototype.restoreState).toHaveBeenCalled();
                });

                it("Listens for changeMode", function () {
                    overlay = initOverlay(this);
                    this.app.vent.trigger("mode-change");
                    expect(BaseClass.prototype.changeMode).toHaveBeenCalled();
                });

                it("Saves and restores state", function () {
                    overlay = initOverlay(this);
                    overlay.state._isShowingOnMap = true;
                    overlay.saveState();
                    overlay = initOverlay(this);
                    expect(overlay.state._isShowingOnMap).toBeTruthy();
                    overlay.state._isShowingOnMap = false;
                    overlay.saveState();
                    overlay = initOverlay(this);
                    expect(overlay.state._isShowingOnMap).toBeFalsy();
                });

                it("Listens for model events", function () {
                    overlay = initOverlay(this);
                    overlay.model.trigger('show-overlay');
                    expect(BaseClass.prototype.show).toHaveBeenCalled();
                    overlay.model.trigger('hide-overlay');
                    expect(BaseClass.prototype.hide).toHaveBeenCalled();
                    overlay.model.trigger('zoom-to-overlay');
                    expect(BaseClass.prototype.zoomTo).toHaveBeenCalled();

                    if (overlay.model.get("overlay_type") == "map-image") {
                        return; // Map image overlay doesn't handle the events below
                    }

                    overlay.model.trigger('change:geometry');
                    expect(BaseClass.prototype.updateOverlay).toHaveBeenCalled();
                    overlay.model.trigger('change');
                    expect(BaseClass.prototype.render).toHaveBeenCalled();
                    overlay.model.trigger('reset-overlay');
                    expect(BaseClass.prototype.restoreModelGeometry).toHaveBeenCalled();
                });
            });
        }
    };
});