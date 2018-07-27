var rootDir = "../../../";
define([
    "jquery",
    "backbone",
    rootDir + "apps/presentation/presentation-app",
    rootDir + "lib/popovers/popover",
    rootDir + "lib/maps/basemap"
],
    function ($, Backbone, PresentationApp, Popover, Basemap) {
        'use strict';
        var presentationApp, fixture;

        function initApp(scope) {
            // 1) add dummy HTML elements:
            var $sandbox = $('<div class="main-panel presentation-main-panel none">'),
                $r1 = $('<div id="marker-detail-panel" class="side-panel"></div>'),
                $r2 = $('<div id="map-panel"><div id="map"></div></div>'),
                $r3 = $('<div id="presentation-title"></div>'),
                $r4 = $('<div id="legend"></div>');
            $sandbox.append($r1).append($r2).append($r3).append($r4);

            fixture = setFixtures($sandbox);

            // 2) add spies for all relevant objects:
            spyOn(PresentationApp.prototype, 'start');
            spyOn(PresentationApp.prototype, 'initialize').and.callThrough();
            spyOn(PresentationApp.prototype, 'loadRegions').and.callThrough();
            spyOn(PresentationApp.prototype, 'addMessageListeners');
            spyOn(PresentationApp.prototype, 'showMapTitle');
            spyOn(PresentationApp.prototype, 'showBasemap').and.callThrough();
            spyOn(PresentationApp.prototype, 'showLegend').and.callThrough();
            spyOn(PresentationApp.prototype, 'hideLegend').and.callThrough();
            spyOn(PresentationApp.prototype, 'showTitleCard').and.callThrough();

            spyOn(scope.app.vent, 'trigger').and.callThrough();

            // 3) initialize ProfileApp object:
            presentationApp = new PresentationApp({
                vent: scope.vent,
                projectJSON: scope.getProjectJSON(),
                mapJSON: scope.map.toJSON()
            });
            //presentationApp.dataManager = scope.dataManager;
            presentationApp.start();
        }

        describe("PresentationApp: Application-Level Tests", function () {
            beforeEach(function () {
                initApp(this);
            });

            afterEach(function () {
                Backbone.history.stop();
            });

            it("Application initialization", function () {
                presentationApp.updateDisplay();
                expect(presentationApp).toEqual(jasmine.any(PresentationApp));
                expect(presentationApp.initialize).toHaveBeenCalledTimes(1);
                expect(presentationApp.projectID).toEqual(3);
                expect(presentationApp.popover).toEqual(jasmine.any(Popover));
                expect(presentationApp.loadRegions).toHaveBeenCalledTimes(1);
                expect(presentationApp.addMessageListeners).toHaveBeenCalledTimes(1);  
            });

            it("loadRegions() works", function() {
            
                // loadRegions() already gets called in initialize()
                expect(presentationApp.showMapTitle).toHaveBeenCalledTimes(1);
                expect(presentationApp.showBasemap).toHaveBeenCalledTimes(1);
            });

            it("showBasemap() works", function() {
                spyOn(presentationApp.mapRegion, 'show');
                expect(presentationApp.mapRegion.show).toHaveBeenCalledTimes(0);

                presentationApp.showBasemap();
                
                expect(presentationApp.basemapView).toEqual(jasmine.any(Basemap));
                
                expect(presentationApp.basemapView.app).toEqual(presentationApp);
                expect(presentationApp.basemapView.activeMapTypeID).toEqual(5);
                expect(presentationApp.basemapView.zoom).toEqual(9);
                expect(presentationApp.basemapView.center.lat).toEqual(38.08138115948);
                expect(presentationApp.basemapView.center.lng).toEqual(-122.24659491239);

                expect(presentationApp.basemapView.showDropdownControl).toEqual(false);
                expect(presentationApp.basemapView.showFullscreenControl).toEqual(false);
                expect(presentationApp.basemapView.showSearchControl).toEqual(false);

                expect(presentationApp.mapRegion.show).toHaveBeenCalledTimes(1);
            });

            it("honors presentation settings (map metadata)", function() {
                expect(presentationApp.basemapView.allowPanZoom).toEqual(true);
                expect(presentationApp.basemapView.allowStreetView).toEqual(true);
            });

            it("displays legend according to user settings", function() {
                expect(presentationApp.hideLegend).toHaveBeenCalledTimes(0);
                expect(presentationApp.showLegend).toHaveBeenCalledTimes(0);

                presentationApp.initLegend();

                expect(presentationApp.hideLegend).toHaveBeenCalledTimes(0);
                expect(presentationApp.showLegend).toHaveBeenCalledTimes(1);

                presentationApp.model.get('metadata').displayLegend = false;

                presentationApp.initLegend();

                expect(presentationApp.hideLegend).toHaveBeenCalledTimes(1);
                expect(presentationApp.showLegend).toHaveBeenCalledTimes(1);

            });

            it("shows TitleCard with correct data", function() {
                expect(presentationApp.showTitleCard).toHaveBeenCalledTimes(0);

                presentationApp.vent.trigger('title-card');

                expect(presentationApp.showTitleCard).toHaveBeenCalledTimes(1);

                expect(presentationApp.sideRegion.currentView.model.get('title')).toEqual('Test Map Title');

                expect(presentationApp.sideRegion.currentView.model.get('description')).toEqual('Test description of the map.');
                
            });

        });
    });
