define(["underscore",
        "lib/maps/data/viewLoader",
        "../../test/spec-helper"],
    function (_, ViewLoader) {
        'use strict';
        var viewLoader, that;
        describe("ViewLoader: Test that initializes correctly", function () {
            
            /*it("Raises an exception if the initial view object is missing", function () {
                that = this;
                expect(function () {
                    viewLoader = new ViewLoader({
                        app: that.app
                    });
                }).toThrow();
            });*/

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
            it("Restores the correct center point", function () {
                this.app.map = new google.maps.Map(document.getElementById('map_canvas'), {
                    center: { lat: -34, lng: 150 },
                    zoom: 3
                });
                viewLoader = new ViewLoader({
                    app: this.app,
                    view: this.view
                });
                // make sure that the map has initialized to { lat: 37, lng: -122 };
                // should be different from the map's initialization params. Probably doesn't
                // need to be an asynchronous call since map should get initialized before viewLoader:
                expect(viewLoader.app.map.getCenter().lat()).toEqual(37); // should be 37 (from spec-helper)
                expect(viewLoader.app.map.getCenter().lng()).toEqual(-122); // should be -122 (from spec-helper)
            });

            it("Restores the correct zoom level", function () {
                this.app.map = new google.maps.Map(document.getElementById('map_canvas'), {
                    center: { lat: -34, lng: 150 },
                    zoom: 3
                });
                viewLoader = new ViewLoader({
                    app: this.app,
                    view: this.view
                });
                expect(viewLoader.app.map.getZoom()).toEqual(18);
            });

            it("Restores the correct basemap id", function () {
                var that = this,
                    getProviderNameByID = function (id) {
                        var i;
                        for (i = 0; i < that.tilesets.length; i++) {
                            if (id == that.tilesets[i].id) { return that.tilesets[i].providerID; }
                        }
                        return "UNKNOWN PROVIDER";
                    };

                this.app.map = new google.maps.Map(document.getElementById('map_canvas'), {
                    center: { lat: -34, lng: 150 }
                });
                viewLoader = new ViewLoader({
                    app: this.app,
                    view: this.view
                });
                //after view is loaded, basemapID should be set:
                expect(viewLoader.app.map.getMapTypeId()).toEqual(getProviderNameByID(this.view.basemap));
            });
        });
    });
