/*
  Data Detail Test goes here
*/

var rootDir = "../../../";
define([
    rootDir + "views/data-detail",
    "tests/spec-helper1"
],
    function (DataDetail) {

        'use strict';
        var fixture, newDataDetail, setupDataDetail, lat, lng;

        var map, layer;
        let record;

        const initSpies = function (scope) {
            spyOn(DataDetail.prototype, 'initialize').and.callThrough();
            spyOn(DataDetail.prototype, 'displayGeometryOptions').and.callThrough();
            spyOn(DataDetail.prototype, 'deleteMarker').and.callThrough();
            spyOn(DataDetail.prototype, 'notifyDrawingManager').and.callThrough();
            spyOn(DataDetail.prototype, 'initAddPoint').and.callThrough();
            spyOn(DataDetail.prototype, 'initAddPolygon').and.callThrough();
            spyOn(DataDetail.prototype, 'initAddPolyline').and.callThrough();
            spyOn(DataDetail.prototype, 'hideGeometryOptions').and.callThrough();
            spyOn(DataDetail.prototype, 'saveGeoJSON').and.callThrough();

            

            // don't call this one
            spyOn(DataDetail.prototype, 'commitForm');
            

            spyOn(scope.app.vent, 'trigger').and.callThrough();
            spyOn(scope.app.router, 'navigate');

        };

        const initView = function (scope) {
            
            record = scope.getRecord();

            scope.view = new DataDetail({
                app: scope.app,
                model: record
            });    
        };

        describe("DataDetail: Tests", function(){
            beforeEach(function(){
                initSpies(this);
                initView(this);
                
            });

            it("DataDetail successfully created", function(){
                expect(this.view).toEqual(jasmine.any(DataDetail));
            });

            it("deleteMarker() works", function() {
                this.view.render();
                console.log(this.view.model.get('geometry'));
                if (!this.view.model.get('geometry')) {
                    expect(DataDetail.prototype.displayGeometryOptions).toHaveBeenCalledTimes(0);
                    this.view.$el.find('#add-geometry').trigger('click');
                    expect(DataDetail.prototype.displayGeometryOptions).toHaveBeenCalledTimes(0);
                }
                expect(DataDetail.prototype.deleteMarker).toHaveBeenCalledTimes(0);
                this.view.$el.find('#delete-geometry').trigger('click');
                console.log(this.view.model.get('geometry'));
                //this.view.deleteMarker();
                expect(DataDetail.prototype.deleteMarker).toHaveBeenCalledTimes(1);

            });
            it("displayGeometryOptions() works", function() {
                this.view.model.set('geometry', null);
                this.view.render();
                
                expect(DataDetail.prototype.displayGeometryOptions).toHaveBeenCalledTimes(0);
                this.view.$el.find('#add-geometry').trigger('click');
                console.log(this.view.model.get('geometry'));
                //this.view.deleteMarker();
                expect(DataDetail.prototype.displayGeometryOptions).toHaveBeenCalledTimes(1);

                expect(this.view.$el.find('.add-marker-button').css('background')).toEqual('rgb(187, 187, 187)');
                expect(this.view.$el.find('.geometry-options').css('display')).toEqual('block');
            });

            it("initAddPoint() works", function() {
                this.view.model.set('geometry', null);
                this.view.render();

                
                this.view.$el.find('#add-geometry').trigger('click');

                expect(DataDetail.prototype.initAddPoint).toHaveBeenCalledTimes(0);
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledTimes(0);
                this.view.$el.find('#add-point').trigger('click');

                
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledWith(jasmine.any(Object), 'add-point');
                expect(DataDetail.prototype.initAddPoint).toHaveBeenCalledTimes(1);
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledTimes(1);

                // difficult to mock the event object from a click event, so here 
                // we will manually test that initAddPoint() passes the correct argument
                const mockEvent = {
                    test: 'string'
                }
                this.view.initAddPoint(mockEvent);
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledWith(mockEvent, 'add-point');
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledTimes(2);
            });

            it("initAddPolygon() works", function() {
                this.view.model.set('geometry', null);
                this.view.render();

                
                this.view.$el.find('#add-geometry').trigger('click');

                expect(DataDetail.prototype.initAddPolygon).toHaveBeenCalledTimes(0);
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledTimes(0);
                this.view.$el.find('#add-polygon').trigger('click');

                
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledWith(jasmine.any(Object), 'add-polygon');
                expect(DataDetail.prototype.initAddPolygon).toHaveBeenCalledTimes(1);
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledTimes(1);

                // difficult to mock the event object from a click event, so here 
                // we will manually test that initAddPoint() passes the correct argument
                const mockEvent = {
                    test: 'string'
                }
                this.view.initAddPolygon(mockEvent);
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledWith(mockEvent, 'add-polygon');
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledTimes(2);
            });

            it("initAddPolyline() works", function() {
                this.view.model.set('geometry', null);
                this.view.render();

                
                this.view.$el.find('#add-geometry').trigger('click');

                expect(DataDetail.prototype.initAddPolygon).toHaveBeenCalledTimes(0);
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledTimes(0);
                this.view.$el.find('#add-polyline').trigger('click');

                
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledWith(jasmine.any(Object), 'add-polyline');
                expect(DataDetail.prototype.initAddPolyline).toHaveBeenCalledTimes(1);
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledTimes(1);

                // difficult to mock the event object from a click event, so here 
                // we will manually test that initAddPoint() passes the correct argument
                const mockEvent = {
                    test: 'string'
                }
                this.view.initAddPolyline(mockEvent);
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledWith(mockEvent, 'add-polyline');
                expect(DataDetail.prototype.notifyDrawingManager).toHaveBeenCalledTimes(2);
            });
            it("notifyDrawingManager() works", function() {
                const mockEvent = {
                    test: 'string',
                    preventDefault: function() {
                        return;
                    }
                }
                this.view.cid = 777;
                this.view.model.set('geometry', null);
                this.view.render();

                expect(this.view.$el.find('.add-lat-lng').children()).not.toContain('#drop-marker-message');
                expect(DataDetail.prototype.hideGeometryOptions).toHaveBeenCalledTimes(0);

                this.view.notifyDrawingManager(mockEvent, 'add-point');
                
                expect(this.view.$el.find('.add-lat-lng').find('#drop-marker-message').length).toEqual(1);
                expect(this.view.$el.find('.add-lat-lng').children()).toContain('#drop-marker-message');

                expect(this.app.vent.trigger).toHaveBeenCalledWith('add-point', 777, mockEvent);
                //expect(DataDetail.prototype.hideGeometryOptions).toHaveBeenCalledTimes(1);
            });

            it("hideGeometryOptions() works", function() {
                this.view.model.set('geometry', null);
                this.view.render();

                this.view.$el.find('#add-geometry').trigger('click');

                expect(this.view.$el.find('.add-marker-button').css('background')).toEqual('rgb(187, 187, 187)');
                expect(this.view.$el.find('.geometry-options').css('display')).toEqual('block');

                expect(DataDetail.prototype.hideGeometryOptions).toHaveBeenCalledTimes(1);

                this.view.$el.find('#add-point').trigger('click');

                expect(DataDetail.prototype.hideGeometryOptions).toHaveBeenCalledTimes(2);
                                
                expect(this.view.$el.find('.add-marker-button').css('background')).toEqual('rgb(250, 250, 252)');
                expect(this.view.$el.find('.geometry-options').css('display')).toEqual('none');
            });
            it("DataDetailView recieves notification when a new geometry is completed by the DrawingManager", function () {
                this.view.model.set('geometry', null);
                // set view cid
                this.view.cid  = 456;
                const mockGeometry = {
                    geoJSON: {
                        "type": "Point",
                        "coordinates": [
                            -122.31663275419,
                            38.10623915271
                            ]
                        }, 
                    viewID: 456
                };



                expect(DataDetail.prototype.saveGeoJSON).toHaveBeenCalledTimes(0);
                
                this.app.vent.trigger('geometry-created', mockGeometry);

                expect(DataDetail.prototype.saveGeoJSON).toHaveBeenCalledTimes(1);
                expect(DataDetail.prototype.saveGeoJSON).toHaveBeenCalledWith(mockGeometry);
                expect(this.view.model.get('geometry')).toEqual(mockGeometry.geoJSON);
                
            });
        });

        

       
        

        

    });
