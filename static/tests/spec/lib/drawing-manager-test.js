var rootDir = "../../";
define([
    rootDir + "lib/maps/controls/drawingManager",
    rootDir + "lib/maps/basemap"
],
    function (DrawingManager, BaseMapView) {
        'use strict';
        var initView = (scope) => {
            // add spies for all relevant objects and initialize dataManager:
            spyOn(DrawingManager.prototype, 'initialize').and.callThrough();
            spyOn(DrawingManager.prototype, 'initPolylineMode').and.callThrough();
            spyOn(DrawingManager.prototype, 'initDrawingManager').and.callThrough();

            // 2) add dummy HTML elements:
            scope.fixture = setFixtures('<div></div>');

            // 3) initialize Toolbar:
            let basemapView = new BaseMapView( {
                app: scope.app
            })
            scope.drawingManager = new DrawingManager({
                basemapView: basemapView
            });
            
        };

        describe("DrawingManager: Initialization Tests", function () {
            beforeEach(function () {
                initView(this);
            });

            it("DrawingManager Initialization called successfully ", function () {
                expect(this.drawingManager.initialize).toHaveBeenCalledTimes(1);
            });
            it("initPolylineMode works", function() {
                expect(this.drawingManager.initPolylineMode).toHaveBeenCalledTimes(0);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(0);
                this.drawingManager.initPolylineMode(777);
                expect(this.drawingManager.initPolylineMode).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledWith('google.maps.drawing.OverlayType.POLYLINE');
                expect(this.drawingManager.viewID).toEqual(777);
            })
        });
    });
