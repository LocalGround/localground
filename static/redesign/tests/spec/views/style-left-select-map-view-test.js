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

            it(": collection should be correct", function () {
                expect(mapView.collection).toEqual(this.maps);
            });

            it(": drawOnce should have been called", function () {
                expect(1).toEqual(-1);
            });
        });
        
        describe("When MapView is rendered", function () {
            beforeEach(function () {
                initSpies();
                initView(this);
                initFixtures();
            });

            it("select should render correctly", function () {
                expect(fixture).toContainElement("select");
                expect(fixture.find('option').length).toEqual(1);
                expect(fixture.find('option').length).toEqual(this.maps.length);
            });

            it("should have correct html", function () {
                expect(fixture).toContainElement('#map-select');
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

        describe("Ensure that class methods work", function () {
            beforeEach(function () {
                initSpies();
                mapView = new SelectMapView({
                    app: this.app
                });
                mapView.render();
                initFixtures();
            });

            it("calls newMap when 'create-new-map' app event is triggered", function () {
                expect(1).toEqual(-1);
            });

            it("When save successful, success function is called", function () {
                expect(1).toEqual(-1);
            });

            it("Map save success function should add new map to the collection", function () {
                expect(1).toEqual(-1);
            });

            it("Map save success function should create a new collection if it's undefined", function () {
                expect(1).toEqual(-1);
            });

            it("When save successful, success function sets this.app.currentMap", function () {
                //note: this is the source of the "add layers" bug.
                expect(1).toEqual(-1);
            });

            it("setModel method sets this.app.currentMap", function () {
                expect(1).toEqual(-1);
            });

            it("when drawOnce called, the appropriate properties are set and events are called", function () {
                expect(1).toEqual(-1);
            });

            it("when changeMap called, the appropriate properties are set and events are called", function () {
                expect(1).toEqual(-1);
            });

            it("when showAddMapModal called, the appropriate properties are set and events are called", function () {
                expect(1).toEqual(-1);
            });

            it("when setCenterZoom called, the appropriate properties are set and events are called", function () {
                expect(1).toEqual(-1);
            });

            it("when setMapTypeId called, the appropriate properties are set and events are called", function () {
                expect(1).toEqual(-1);
            });
        });

        describe("Ensure that cases are handled when no map is defined", function () {
            beforeEach(function () {
                initSpies();
                mapView = new SelectMapView({
                    app: this.app,
                    collection: new Maps()
                });
                mapView.render();
                initFixtures();
            });

            it("initializes successfully with no maps defined", function () {
                mapView.collection.trigger('reset');
                expect(1).toEqual(-1);
            });

            it("displays informational message when no maps are defined", function () {
                expect(fixture.find('p')).toHaveText("informational message about what to do");
            });
        });
    });