var rootDir = "../../";
define([
    rootDir + "lib/maps/controls/drawingManager",
    rootDir + "lib/maps/controls/mouseMover",
    rootDir + "lib/maps/basemap"
],
    function (DrawingManager, MouseMover, BaseMapView) {
        'use strict';
        var initView = (scope) => {
            //const mm = new MouseMover('add-point', {app: scope.app});
            //console.log(mm);
            // add spies for all relevant objects and initialize dataManager:
            spyOn(DrawingManager.prototype, 'initialize').and.callThrough();
            spyOn(DrawingManager.prototype, 'initPolylineMode').and.callThrough();
            spyOn(DrawingManager.prototype, 'initPolygonMode').and.callThrough();
            spyOn(DrawingManager.prototype, 'initRectangleMode').and.callThrough();
            spyOn(DrawingManager.prototype, 'initPointMode');
            spyOn(DrawingManager.prototype, 'initDrawingManager').and.callThrough();
            //spyOn(MouseMover.prototype, 'initialize');

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
                this.app.vent.trigger('add-polyline', 777);
                expect(this.drawingManager.initPolylineMode).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledWith('polyline');
                expect(this.drawingManager.viewID).toEqual(777);
            });
            it("initPolygonMode works", function() {
                expect(this.drawingManager.initPolygonMode).toHaveBeenCalledTimes(0);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(0);
                this.app.vent.trigger('add-polygon', 123);
                expect(this.drawingManager.initPolygonMode).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledWith('polygon');
                expect(this.drawingManager.viewID).toEqual(123);
            });
            it("initRectangleMode works", function() {
                expect(this.drawingManager.initRectangleMode).toHaveBeenCalledTimes(0);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(0);
                this.app.vent.trigger('add-rectangle', 555);
                expect(this.drawingManager.initRectangleMode).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledWith('rectangle');
                expect(this.drawingManager.viewID).toEqual(555);
            });

            // not completely testing initPointMode due to difficulty spying on MouseMover
            it("initPointMode works", function() {
                expect(this.drawingManager.initPointMode).toHaveBeenCalledTimes(0);
                this.app.vent.trigger('add-point', 456);
                expect(this.drawingManager.initPointMode).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initPointMode).toHaveBeenCalledWith(456);
            });

            it("initDrawingManager works", function() {
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(0);
                this.drawingManager.initDrawingManager('polygon');
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(1);
            });
        });

        
    });



    // don't bother testing pointToLatLong or use CallFake to mock some fake coordinates.
    // don't test google map events