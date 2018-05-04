var rootDir = "../../";
define([
    rootDir + "lib/maps/controls/drawingManager",
    rootDir + "lib/maps/controls/mouseMover",
    rootDir + "lib/maps/basemap"
],
    function (DrawingManager, MouseMover, BaseMapView) {
        'use strict';
        // note: these tests mock a significant amount of the functionality 
        // carried out by the google maps api
        var initView = (scope) => {
            
            // add spies for all relevant objects and initialize DrawingManager:
            spyOn(DrawingManager.prototype, 'initialize').and.callThrough();
            spyOn(DrawingManager.prototype, 'initPolylineMode').and.callThrough();
            spyOn(DrawingManager.prototype, 'initPolygonMode').and.callThrough();
            spyOn(DrawingManager.prototype, 'initRectangleMode').and.callThrough();
            spyOn(DrawingManager.prototype, 'initPointMode');
            spyOn(DrawingManager.prototype, 'initDrawingManager').and.callThrough();
            spyOn(scope.app.vent, 'trigger').and.callThrough();

            
            // 3) initialize:
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
            it("initPolylineMode() works", function() {
                expect(this.drawingManager.initPolylineMode).toHaveBeenCalledTimes(0);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(0);
                this.app.vent.trigger('add-polyline', 777);
                expect(this.drawingManager.initPolylineMode).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledWith('polyline');
                expect(this.drawingManager.viewID).toEqual(777);
            });
            it("initPolygonMode() works", function() {
                expect(this.drawingManager.initPolygonMode).toHaveBeenCalledTimes(0);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(0);
                this.app.vent.trigger('add-polygon', 123);
                expect(this.drawingManager.initPolygonMode).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledWith('polygon');
                expect(this.drawingManager.viewID).toEqual(123);
            });
            it("initRectangleMode() works", function() {
                expect(this.drawingManager.initRectangleMode).toHaveBeenCalledTimes(0);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(0);
                this.app.vent.trigger('add-rectangle', 555);
                expect(this.drawingManager.initRectangleMode).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledWith('rectangle');
                expect(this.drawingManager.viewID).toEqual(555);
            });

            // not completely testing initPointMode due to difficulty spying on MouseMover
            it("initPointMode() works", function() {
                expect(this.drawingManager.initPointMode).toHaveBeenCalledTimes(0);
                this.app.vent.trigger('add-point', 456);
                expect(this.drawingManager.initPointMode).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.initPointMode).toHaveBeenCalledWith(456);
            });

            it("initDrawingManager() works", function() {
                expect(this.drawingManager.drawingManager).toEqual(undefined);
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(0);
                this.drawingManager.initDrawingManager('polygon');
                expect(this.drawingManager.initDrawingManager).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.drawingManager).not.toEqual(undefined);
            });

            it("pointComplete() works", function() {

                // this test mocks a lot of the functionality carried out by the google maps api
                const location = {
                        lng: function() {
                            return -119.352294921875;
                        },
                        lat: function() {
                            return 37.03275682753895;
                        }
                    };
                const geojson = {
                    type: 'Point',
                    coordinates: [-119.352294921875, 37.03275682753895]
                }
                spyOn(DrawingManager.prototype, 'point2LatLng').and.callFake(() => location);
                spyOn(DrawingManager.prototype, 'notify');
                spyOn(DrawingManager.prototype, 'clear');

                expect(this.drawingManager.point2LatLng).toHaveBeenCalledTimes(0);
                this.drawingManager.pointComplete('mock argument');
                expect(this.drawingManager.point2LatLng).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.notify).toHaveBeenCalledWith(geojson);
            });

            it("polygonComplete() works", function() {

                const geojson = {
                        "type":"Polygon",
                        "coordinates":[
                            [
                                [-119.352294921875,37.03275682753895],
                                [-118.539306640625,36.87472761020638],
                                [-119.022705078125,36.345600321682255],
                                [-119.352294921875,37.03275682753895]
                            ]
                        ]
                    };
                spyOn(DrawingManager.prototype, 'googlePolygonToGeoJSON').and.callFake(() => geojson);
                spyOn(DrawingManager.prototype, 'notify');
                spyOn(DrawingManager.prototype, 'clear');

                expect(this.drawingManager.googlePolygonToGeoJSON).toHaveBeenCalledTimes(0);
                this.drawingManager.polygonComplete('mock argument');
                expect(this.drawingManager.googlePolygonToGeoJSON).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.notify).toHaveBeenCalledWith(geojson);
                expect(this.drawingManager.clear).toHaveBeenCalledWith('mock argument');
            });

            it("polygonComplete() works", function() {

                const geojson = {
                        "type":"Polyline",
                        "coordinates":[
                            [
                                [-119.352294921875,37.03275682753895],
                                [-118.539306640625,36.87472761020638],
                                [-119.022705078125,36.345600321682255]                          
                            ]
                        ]
                    };
                spyOn(DrawingManager.prototype, 'googlePolylineToGeoJSON').and.callFake(() => geojson);
                spyOn(DrawingManager.prototype, 'notify');
                spyOn(DrawingManager.prototype, 'clear');

                expect(this.drawingManager.googlePolylineToGeoJSON).toHaveBeenCalledTimes(0);
                this.drawingManager.polylineComplete('mock argument');
                expect(this.drawingManager.googlePolylineToGeoJSON).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.notify).toHaveBeenCalledWith(geojson);
                expect(this.drawingManager.clear).toHaveBeenCalledWith('mock argument');
            });
            it("rectangleComplete() works", function() {
                const rect = {
                    setOptions: function(whatever) {
                        return;
                    }
                }
                const geojson = {
                        "type":"Polygon",
                        "coordinates":[
                            [
                                [-119.352294921875,37.03275682753895],
                                [-118.539306640625,36.87472761020638],
                                [-119.022705078125,36.345600321682255]                          
                            ]
                        ]
                    };
                spyOn(DrawingManager.prototype, 'getGeoJSONFromBounds').and.callFake(() => geojson);
                
                spyOn(DrawingManager.prototype, 'notify');
                spyOn(DrawingManager.prototype, 'clear');

                this.drawingManager.initDrawingManager('rectangle');

                expect(this.drawingManager.getGeoJSONFromBounds).toHaveBeenCalledTimes(0);
                this.drawingManager.rectangleComplete(rect);

                expect(this.drawingManager.getGeoJSONFromBounds).toHaveBeenCalledTimes(1);
                expect(this.drawingManager.notify).toHaveBeenCalledWith(geojson);
                expect(this.drawingManager.clear).toHaveBeenCalledWith(rect);
                expect($('body').css('cursor')).toEqual('auto');
            });
            it("notify() works", function() {
                spyOn(DrawingManager.prototype, 'notify').and.callThrough();

                this.drawingManager.viewID = 456;
                this.drawingManager.notify('mock arg');

                expect(this.app.vent.trigger).toHaveBeenCalledWith(
                    'geometry-created', 
                    {geoJSON: 'mock arg', viewID: 456}
                )
            });
            it("clear() works", function() {
                const tempOverlay = {
                    setMap: function(a) {
                        return;
                    }
                }
                this.drawingManager.initDrawingManager('point');

                spyOn(DrawingManager.prototype, 'clear').and.callThrough();
                spyOn(this.drawingManager.drawingManager, 'setOptions');
                spyOn(tempOverlay, 'setMap');

                this.drawingManager.clear(tempOverlay);

                expect(tempOverlay.setMap).toHaveBeenCalledWith(null);

                expect(this.drawingManager.drawingManager.setOptions).toHaveBeenCalledWith({
                    drawingMode: null,
                    drawingControl: false
                });
            });
        }); 
    });