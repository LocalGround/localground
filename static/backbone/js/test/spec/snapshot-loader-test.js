define(["underscore",
        "lib/maps/data/snapshotLoader",
        "../../test/spec-helper"],
    function (_, SnapshotLoader) {
        'use strict';
        var snapshotLoader, that;

        describe("SnapshotLoader: Test that initializes correctly", function () {

            it("Loads correctly if an initial view is passed in", function () {
                that = this;
                expect(function () {
                    var snapshotLoader = new SnapshotLoader({
                        app: that.app,
                        snapshot: that.snapshot
                    });
                }).not.toThrow();
            });

        });

        describe("SnapshotLoader: Check that view loads correctly", function () {

            it("Triggers the changeZoom and the changeCenter methods in Basemap", function () {
                //spyOn(Basemap.prototype, "changeZoom");
                //spyOn(Basemap.prototype, "changeCenter");
                //spyOn(SnapshotLoader.prototype, "initialize");
                //spyOn(google.maps.Map.prototype, 'setZoom');
                //spyOn(google.maps.Map.prototype, 'idle');

                //var snapshotModel = new Snapshot(this.snapshot);
                var snapshotLoader = new SnapshotLoader({
                    app: this.app,
                    snapshot: this.snapshot
                });
                spyOn(this.app.vent, 'trigger').and.callThrough();
                spyOn(snapshotLoader, 'updateCollections');


                this.app.vent.trigger('map-ready');

                expect(snapshotLoader.updateCollections).toHaveBeenCalled();
                expect(this.app.vent.trigger).toHaveBeenCalledWith('change-center', jasmine.any(google.maps.LatLng)); //any lat/lng variable
                expect(this.app.vent.trigger).toHaveBeenCalledWith('change-zoom', this.snapshot.zoom);
                expect(this.app.vent.trigger).toHaveBeenCalledWith('set-map-type', this.snapshot.basemap);
            });
        });
    });