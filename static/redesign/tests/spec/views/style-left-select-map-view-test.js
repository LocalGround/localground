var rootDir = "../../";
define([
    rootDir + "apps/style/views/left/select-map-view",
    rootDir + "collections/maps",
    rootDir + "tests/spec/views/style-app-show-hide-panel"
],
    function (SelectMapView, Maps, Helper) {
        'use strict';
        var mapView, fixture, initSpies, initView, initFixtures;
        initSpies = function () {
            // 1) add spies for all relevant objects:

            spyOn(SelectMapView.prototype, 'initialize').and.callThrough();
            spyOn(SelectMapView.prototype, 'changeMap');
        };
        initView = function (scope) {
            // 2) initialize rightPanel object:
            mapView = new SelectMapView({
                app: scope.app,
                collection: scope.maps
            });
            mapView.render();
        };
        initFixtures = function () {
            fixture = setFixtures('<div id="map_dropdown_region"></div>');
            fixture.append(mapView.$el);
        };

        describe("When MapView is initialized", function () {
            beforeEach(function () {
                initSpies();
                initView(this);
                initFixtures();
            });

            it("should initialize", function () {
                expect(mapView).toEqual(jasmine.any(SelectMapView));
                expect(mapView.initialize).toHaveBeenCalledTimes(1);
            });

            it("should have correct html", function () {
                expect(fixture).toContainElement('#map-select');    
            });

            it(": collection should be correct", function () {
                expect(mapView.collection).toEqual(this.maps);
            });
        });

        describe("Events tests", function () {
            beforeEach(function () {
                initSpies();
                initView(this);
                initFixtures();
            });

            it(": events should trigger correct functions", function () {
                expect(mapView.changeMap).toHaveBeenCalledTimes(0);
                fixture.find('#map-select').trigger("change");
                expect(mapView.changeMap).toHaveBeenCalledTimes(1);
            });
        });

        describe("Panel Show / Hide Tests", function () {
            Helper.genericChecks({
                ClassType: SelectMapView,
                name: "SelectMapView"
            });
        });
        
        describe("No maps defined", function () {
            beforeEach(function () {
                initSpies();
                mapView = new SelectMapView({
                    app: this.app,
                    collection: new Maps()
                });
                mapView.render();
                initFixtures();
            });

            it(":initializes successfully with no maps defined", function () {
                mapView.collection.trigger('reset');
                expect(1).toEqual(1);
            });
        });
    });