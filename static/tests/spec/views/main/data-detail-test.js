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
        var fixture, newDataDetail, setupDataDetail, initSpies, lat, lng;

        var map, layer;
        let record;

        const initSpies = function (scope) {
            spyOn(DataDetail.prototype, 'initialize').and.callThrough();
            spyOn(DataDetail.prototype, 'displayGeometryOptions').and.callThrough();
            spyOn(DataDetail.prototype, 'deleteMarker').and.callThrough();
            

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
                initView(this);
            });

            it("DataDetail successfully created", function(){
                expect(this.view).toEqual(jasmine.any(DataDetail));
            });

            it("deleteMarker() works", function() {
                this.view.render();
                expect(DataDetail.prototype.deleteMarker).toHaveBeenCalledTimes(0);
                this.view.$el.find('#delete-geometry').trigger('click');
                expect(DataDetail.prototype.deleteMarker).toHaveBeenCalledTimes(1);
                // expect(this.view.$el.find('.add-marker-button').css('background')).toEqual('#bbbbbb');
                // expect(this.view.$el.find('.add-marker-button').css('display')).toEqual('block');

            });

        });

        

       
        

        

    });
