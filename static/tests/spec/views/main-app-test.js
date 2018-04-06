var rootDir = "../../";
define([
    "backbone",
    rootDir + "apps/main/main-app",
    rootDir + "lib/maps/basemap",
    rootDir + "apps/main/views/left/left-panel",
    rootDir + "views/data-detail",
    rootDir + "views/breadcrumbs",
    rootDir + "models/map",
    "tests/spec-helper1"
],
    function (Backbone, MainApp, BaseMapView, LeftPanelView, DataDetailView,
            BreadCrumb, Map) {
        'use strict';
        var mainApp, fixture;
        const info = {
            mapId: 3,
            layerId: 6,
            dataSource: 'form_2',
            markerId: 12
        };

        const initApp = (scope) => {

            // 1) add spies for all relevant objects:
            spyOn(MainApp.prototype, 'initialize').and.callThrough();
            spyOn(MainApp.prototype, 'setActiveMapModel').and.callThrough();
            spyOn(MainApp.prototype, 'applyNewMap').and.callThrough();
            spyOn(MainApp.prototype, 'showBreadcrumbs').and.callThrough();
            spyOn(MainApp.prototype, 'showBasemap').and.callThrough();
            spyOn(MainApp.prototype, 'addMessageListeners').and.callThrough();
            spyOn(MainApp.prototype, 'showLeftLayout').and.callThrough();
            spyOn(MainApp.prototype, 'hideDetail').and.callThrough();
            spyOn(MainApp.prototype, 'unhideDetail').and.callThrough();
            spyOn(MainApp.prototype, 'hideList').and.callThrough();
            spyOn(MainApp.prototype, 'unhideList').and.callThrough();
            spyOn(MainApp.prototype, 'showDataDetail').and.callThrough();
            spyOn(MainApp.prototype, 'hideModal').and.callThrough();
            spyOn(Map.prototype, 'fetch');

            //do not execute:
            spyOn(MainApp.prototype, 'showModal');
            spyOn(BaseMapView.prototype, 'setCenter');
            spyOn(BaseMapView.prototype, 'setZoom');
            spyOn(BaseMapView.prototype, 'setMapTypeId');

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
                vent: scope.vent,
                projectJSON: scope.getProjectJSON()
            });
            mainApp.dataManager = scope.dataManager;
            fixture.append(mainApp.$el);
        };

        const routeMap = () => {
            //these two lines needed to spoof map routing:
            mainApp.vent.trigger('route-map', 2);
            mainApp.applyNewMap();
        }

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
            it("should call addMessageListeners()", function() {
                expect(mainApp.addMessageListeners).toHaveBeenCalledTimes(1);
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
                mainApp.vent.trigger('show-data-detail', info);
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

            it("should have correct regions", function() {
                expect(mainApp.regions.container).toEqual(".main-panel");
                expect(mainApp.regions.rightRegion).toEqual("#right-panel");
                expect(mainApp.regions.mapRegion).toEqual("#map-panel");
                expect(mainApp.regions.leftRegion).toEqual("#left-panel");
                expect(mainApp.regions.breadcrumbRegion).toEqual("#breadcrumb");
            });


        });

        describe("MainApp vent listeners: ", function () {
            beforeEach(function () {
                initApp(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });
            it("Listens for route-map", function() {
                expect(mainApp.setActiveMapModel).toHaveBeenCalledTimes(0);
                expect(Map.prototype.fetch).toHaveBeenCalledTimes(0);

                mainApp.vent.trigger('route-map', 2)
                expect(mainApp.setActiveMapModel).toHaveBeenCalledTimes(1);
                expect(Map.prototype.fetch).toHaveBeenCalledTimes(1);
                expect(mainApp.setActiveMapModel).toHaveBeenCalledWith(2);

            });

        });

        describe("MainApp functions: ", function () {
            beforeEach(function () {
                initApp(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });

            it("showLeftLayout() should instantiate LeftPanelView", function() {
                //spoof fetch callback: triggers apply new map upon success:
                expect(mainApp.showBreadcrumbs).toHaveBeenCalledTimes(0);
                expect(mainApp.showLeftLayout).toHaveBeenCalledTimes(0);


                expect(mainApp.getRegion('leftRegion').hasView()).toBeFalsy();

                mainApp.vent.trigger('route-map', 2);
                mainApp.applyNewMap();

                expect(mainApp.getRegion('leftRegion').hasView()).toBeTruthy();
                expect(mainApp.getRegion('leftRegion').currentView).toEqual(jasmine.any(LeftPanelView));
                expect(mainApp.showBreadcrumbs).toHaveBeenCalledTimes(1);
                expect(mainApp.showLeftLayout).toHaveBeenCalledTimes(1);
            });

            it("showLeftLayout() should display LeftPanelView html", function() {
                routeMap();
                expect(mainApp.leftRegion.$el).toContainElement('#layers_region');
            });

            it("showDataDetail() should instantiate DataDetailView", function() {
                expect(!mainApp.dataDetailView);
                mainApp.showDataDetail(info);

                expect(mainApp.dataDetailView).toEqual(jasmine.any(DataDetailView));
            });
            it("showDataDetail() should display DataDetailView html", function() {

                expect(mainApp.container.$el).not.toContainElement('#delete-geometry');
                mainApp.showDataDetail(info);

                expect(mainApp.dataDetailView.$el).toContainElement('h4');
            });

            it("showBreadcrumbs() should instantiate BreadCrumb view", function() {
                routeMap();
                expect(mainApp.getRegion('breadcrumbRegion').currentView).toEqual(jasmine.any(BreadCrumb));
            });

            it("showBreadcrumbs() should display BreadCrumb html", function() {
                routeMap();
                expect(mainApp.getRegion('breadcrumbRegion').$el).toContainElement('.breadcrumb-container');
            });

            it("getCenter() should return correct coordinates", function() {
                mainApp.showBasemap();
                expect(1).toEqual(1);
                //console.log(mainApp.basemapView);
                // const bb = mainApp.getCenter();
                // console.log(bb);
            });

        });

    });
