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
            

            spyOn(scope.app.vent, 'trigger');
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

        });

        

       
        

        

    });
