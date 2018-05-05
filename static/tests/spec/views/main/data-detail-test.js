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

        const initView = function (scope) {
            spyOn(DataDetail.prototype, 'initialize').and.callThrough();
            spyOn(DataDetail.prototype, 'displayGeometryOptions').and.callThrough();
            

            spyOn(scope.app.vent, 'trigger');
            spyOn(scope.app.router, 'navigate');

            
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

            it("displayGeometryOptions() works", function() {
                this.view.render();
                expect(this.view.displayGeometryOptions).toHaveBeenCalledTimes(0);
                this.view.$el.find('#add-geometry').trigger('click');
                expect(this.view.displayGeometryOptions).toHaveBeenCalledTimes(1);
                expect(this.view.$el.find('.add-marker-button').css('background')).toEqual('#bbbbbb');
                expect(this.view.$el.find('.add-marker-button').css('display')).toEqual('block');

            });

        });

        

       
        

        

    });
