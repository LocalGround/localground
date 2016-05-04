define(["underscore",
        "views/maps/basemap",
        "lib/maps/controls/geolocation",
        "lib/maps/controls/searchBox",
        "lib/maps/controls/tileController",
        "lib/maps/controls/audioPlayer",
        "../../../../test/spec-helper"],
    function (_, Basemap, GeoLocation, SearchControl, TileController, AudioPlayer) {
        'use strict';
        var basemap, that;

        describe("Basemap: Test that basemap initializes correctly", function () {

            it("Loads correctly if valid initialization parameters passed in", function () {
                that = this;
                expect(function () {
                    var opts = _.clone(that.mapEditorInitializationParams);
                    opts = _.extend(opts, { app: that.app });
                    basemap = new Basemap(opts);
                }).not.toThrow();

                expect(basemap.tileManager).toEqual(jasmine.any(TileController));
                expect(basemap.geolocationControl).toEqual(jasmine.any(GeoLocation));
                expect(basemap.searchControl).toEqual(jasmine.any(SearchControl));
                google.maps.event.trigger(basemap.map, 'idle');

                //can't test AudioPlayer functionality unless map.idle event handler removed
                expect(basemap.audioPlayer).toEqual(jasmine.any(AudioPlayer));
            });

            it("Listens for change-zoom and change-center event handlers", function () {
                //init spies:
                spyOn(Basemap.prototype, "changeZoom");
                spyOn(Basemap.prototype, "changeCenter");

                //create basemap instance:
                var opts = _.clone(this.mapEditorInitializationParams);
                opts = _.extend(opts, { app: this.app });
                basemap = new Basemap(opts);

                //trigger events and ensure that events have been called:
                this.app.vent.trigger('change-center');
                this.app.vent.trigger('change-zoom');

                //make sure corresponding events were called:
                expect(basemap.changeZoom).toHaveBeenCalled();
                expect(basemap.changeCenter).toHaveBeenCalled();
            });

        });

        describe("Basemap: Internal methods work correctly", function () {

            //changeZoom method untestable (to my knowledge) b/c of the 'map idle' clause
            it("changeZoom method works", function () {
                //create basemap instance:
                spyOn(google.maps.Map.prototype, 'setZoom').and.callThrough();
                var opts = _.clone(this.mapEditorInitializationParams);
                opts = _.extend(opts, { app: this.app });
                basemap = new Basemap(opts);
                basemap.changeZoom(20);
                expect(google.maps.Map.prototype.setZoom).toHaveBeenCalled();
            });

            it("changeCenter method works", function () {
                //create basemap instance:
                var opts = _.clone(this.mapEditorInitializationParams);
                opts = _.extend(opts, { app: this.app });
                basemap = new Basemap(opts);

                //change center:
                basemap.changeCenter(new google.maps.LatLng(20, 19));
                expect(basemap.map.getCenter().lat()).toBe(20);
                expect(basemap.map.getCenter().lng()).toBe(19);
            });

        });

    });
