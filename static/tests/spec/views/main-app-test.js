var rootDir = "../../";
define([
    "backbone",
    rootDir + "apps/main/main-app",
    rootDir + "lib/maps/basemap",
    "tests/spec-helper1"
],
    function (Backbone, MainApp, BaseMapView) {
        'use strict';
        var mainApp, fixture, initApp;

        initApp = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(MainApp.prototype, 'initialize').and.callThrough();
            spyOn(MainApp.prototype, 'showBreadcrumbs').and.callThrough();
            spyOn(MainApp.prototype, 'showBasemap').and.callThrough();
            spyOn(MainApp.prototype, 'addMessageListeners').and.callThrough();
            spyOn(MainApp.prototype, 'loadRegions').and.callThrough();
            spyOn(MainApp.prototype, 'hideDetail').and.callThrough();
            spyOn(MainApp.prototype, 'unhideDetail').and.callThrough();
            spyOn(MainApp.prototype, 'hideList').and.callThrough();
            spyOn(MainApp.prototype, 'unhideList').and.callThrough();
            spyOn(MainApp.prototype, 'showDataDetail');
            spyOn(MainApp.prototype, 'showModal');
            spyOn(MainApp.prototype, 'hideModal').and.callThrough();

            // 3) add dummy HTML elements:
            fixture = setFixtures('<div id="breadcrumb" class="breadcrumb"></div> \
                <div class="main-panel">\
                    <div id="left-panel"></div>\
                    <div id="map-panel">\
                        <div id="map"></div>\
                    </div>\
                    <div id="right-panel" class="side-panel"></div>\
                </div>');
            // 2) initialize ProfileApp object:
            mainApp = new MainApp({
                dataManager: scope.dataManager,
                vent: scope.vent
            });
            fixture.append(mainApp.$el);
        };

        describe("MainApp initialization: ", function () {
            beforeEach(function () {
                initApp(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });

            it("should initialize correctly", function () {
                expect(mainApp.initialize).toHaveBeenCalledTimes(1);
                expect(mainApp).toEqual(jasmine.any(MainApp));
            });
            it("should call showBasemap()", function() {
                expect(mainApp.showBasemap).toHaveBeenCalledTimes(1);
            });
            it("should call showBreadcrumbs()", function() {
                expect(mainApp.showBreadcrumbs).toHaveBeenCalledTimes(1);
            });
            it("should call addMessageListeners()", function() {
                expect(mainApp.addMessageListeners).toHaveBeenCalledTimes(1);
            });
            it("should call loadRegions()", function() {
                expect(mainApp.loadRegions).toHaveBeenCalledTimes(1);
            });

            // .vent listeners
            it("should listen to 'hide-detail'", function() {
                expect(mainApp.hideDetail).toHaveBeenCalledTimes(0);
                mainApp.vent.trigger('hide-detail');
                expect(mainApp.hideDetail).toHaveBeenCalledTimes(1);
            });
            it("should listen to 'unhide-detail'", function() {
                expect(mainApp.unhideDetail).toHaveBeenCalledTimes(0);
                mainApp.vent.trigger('unhide-detail');
                expect(mainApp.unhideDetail).toHaveBeenCalledTimes(1);
            });
            it("should listen to 'hide-list'", function() {
                expect(mainApp.hideList).toHaveBeenCalledTimes(0);
                mainApp.vent.trigger('hide-list');
                expect(mainApp.hideList).toHaveBeenCalledTimes(1);
            });
            it("should listen to 'unhide-list'", function() {
                expect(mainApp.unhideList).toHaveBeenCalledTimes(0);
                mainApp.vent.trigger('unhide-list');
                expect(mainApp.unhideList).toHaveBeenCalledTimes(1);
            });
            it("should listen to 'hide-detail'", function() {
                expect(mainApp.hideDetail).toHaveBeenCalledTimes(0);
                mainApp.vent.trigger('hide-detail');
                expect(mainApp.hideDetail).toHaveBeenCalledTimes(1);
            });
            it("should listen to 'show-data-detail'", function() {
                expect(mainApp.showDataDetail).toHaveBeenCalledTimes(0);
                mainApp.vent.trigger('show-data-detail');
                expect(mainApp.showDataDetail).toHaveBeenCalledTimes(1);
            });
            it("should listen to 'show-modal'", function() {
                expect(mainApp.showModal).toHaveBeenCalledTimes(0);
                mainApp.vent.trigger('show-modal');
                expect(mainApp.showModal).toHaveBeenCalledTimes(1);
            });
            it("should listen to 'hide-modal'", function() {
                expect(mainApp.hideModal).toHaveBeenCalledTimes(0);
                mainApp.vent.trigger('hide-modal');
                expect(mainApp.hideModal).toHaveBeenCalledTimes(1);
            });

        });
    });
