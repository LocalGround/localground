define(["underscore",
        "lib/maps/data/viewLoader",
        "views/maps/basemap",
        "../../test/spec-helper"],
    function (_, ViewLoader, Basemap) {
        'use strict';
        var viewLoader, that;
        describe("ViewLoader: Test that initializes correctly", function () {

            it("Loads correctly if an initial view is passed in", function () {
                that = this;
                expect(function () {
                    viewLoader = new ViewLoader({
                        app: that.app,
                        view: that.view
                    });
                }).not.toThrow();
            });

        });

        describe("ViewLoader: Check that view loads correctly", function () {

            it("Triggers the changeZoom and the changeCenter methods in Basemap", function () {
                //spyOn(Basemap.prototype, "changeZoom");
                //spyOn(Basemap.prototype, "changeCenter");
                //spyOn(ViewLoader.prototype, "initialize");
                spyOn(google.maps.Map.prototype, 'setZoom');
                //spyOn(google.maps.Map.prototype, 'idle');

                var basemapOpts = _.extend(_.clone(this.mapEditorInitializationParams), { app: this.app }),
                    basemap = new Basemap(basemapOpts);
                viewLoader = new ViewLoader({
                    app: this.app,
                    view: this.view
                });
                expect(basemap.map.setZoom).toHaveBeenCalled();
                //expect(basemap.map.idle).toHaveBeenCalled();
                //console.log(basemap.map.setZoom.calls.count());
                //expect(basemap.changeZoom).toHaveBeenCalled();
                //expect(basemap.changeCenter).toHaveBeenCalled();
            });
        });
    });
