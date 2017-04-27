var rootDir = "../../";
define([
    rootDir + "apps/style/views/left/select-map-view",
    rootDir + "tests/spec/views/style-app-show-hide-panel"
],
    function (SelectMapView, Helper) {
        'use strict';
        var mapView, fixture, initView;
        initView = function (scope) {
            // 1) add spies for all relevant objects:

            spyOn(SelectMapView.prototype, 'initialize').and.callThrough();
            spyOn(SelectMapView.prototype, 'changeMap');

            fixture = setFixtures('<div id="map_dropdown_region"></div>');

            // 2) initialize rightPanel object:
            mapView = new SelectMapView({
                app: scope.app,
                collection: scope.maps
            });
            mapView.render();

            // 3) set fixture:
            fixture.append(mapView.$el);
        };

        describe("When MapView is initialized", function () {
            beforeEach(function () {
                initView(this);
            });

            afterEach(function () {
                Backbone.history.stop();
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
                initView(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });

            it(": events should trigger correct functions", function () {
                expect(mapView.changeMap).toHaveBeenCalledTimes(0);
                fixture.find('#map-select').trigger("change");
                expect(mapView.changeMap).toHaveBeenCalledTimes(1);
            });
        });

        describe("Panel Show / Hide Tests", function () {
            Helper.genericChecks({ ClassType: SelectMapView });
        });
    });
