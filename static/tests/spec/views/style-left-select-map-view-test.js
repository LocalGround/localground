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
            spyOn(SelectMapView.prototype, 'setActiveMap');
            spyOn(SelectMapView.prototype, 'drawOnce');
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
                //expect(1).toEqual(-1);
                expect(mapView.drawOnce).toHaveBeenCalledTimes(1);

            });
        });

        describe("When MapView is rendered", function () {
            beforeEach(function () {
                initSpies();
                initView(this);
                initFixtures();
            });

            it("select should render correctly", function () {
                expect(fixture).toContainElement("#map-select");
                expect(fixture.find('option').length).toEqual(1);
                expect(fixture.find('option').length).toEqual(this.maps.length);
            });

            /*it("should have add button", function () {
                expect(1).toBe(-1);
            });*/
        });

        describe("Events tests:", function () {
            beforeEach(function () {
                initSpies();
                initView(this);
                initFixtures();
            });

            /*it("Calls newMap when 'create-new-map' app event is triggered", function () {
                expect(1).toEqual(-1);
            });*/

            it("when user changes the map selection, setActiveMap should be called", function () {
                expect(mapView.setActiveMap).toHaveBeenCalledTimes(0);
                fixture.find('#map-select').trigger("change");
                expect(mapView.setActiveMap).toHaveBeenCalledTimes(1);
            });
        });

        describe("Ensure that class methods work:", function () {
            beforeEach(function () {
                initSpies();
                mapView = new SelectMapView({
                    app: this.app
                });
                mapView.render();
                initFixtures();
            });

        });

        describe("Ensure that cases are handled when no map is defined:", function () {
            beforeEach(function () {
                initSpies();
                mapView = new SelectMapView({
                    app: this.app,
                    collection: new Maps(null, { projectID: this.app.getProjectID() })
                });
                mapView.render();
                initFixtures();
            });

            it("initializes successfully", function () {
                //*****NOTE: this is the source of no maps defined bug
                mapView.collection.trigger('reset');
                expect(mapView.app.currentMap).toBeUndefined();

            });
        });
    });
