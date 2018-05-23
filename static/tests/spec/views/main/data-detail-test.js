/*
  Data Detail Test goes here
*/

var rootDir = "../../../";
define([
    rootDir + "views/data-detail",
    rootDir + "lib/popovers/popover",
    rootDir + "apps/main/views/left/add-marker-menu",
    "tests/spec-helper1"
],
    function (DataDetail, Popover, AddMarkerMenu) {

        'use strict';

        const initSpies = function (scope) {
            spyOn(DataDetail.prototype, 'initialize').and.callThrough();
            spyOn(DataDetail.prototype, 'displayGeometryOptions').and.callThrough();
            spyOn(DataDetail.prototype, 'deleteMarker').and.callThrough();
            spyOn(DataDetail.prototype, 'saveGeoJSON').and.callThrough();
            spyOn(Popover.prototype, 'update').and.callThrough();
            spyOn(AddMarkerMenu.prototype, 'initialize').and.callThrough();
            spyOn(scope.app.vent, 'trigger').and.callThrough();

            // don't call this one
            spyOn(DataDetail.prototype, 'commitForm');

        };

        const initView = function (scope) {
            scope.view = new DataDetail({
                app: scope.app,
                model: scope.getRecord()
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
            it("displayGeometryOptions() works when geometry does not exist", function() {
                this.view.model.set('geometry', null);
                this.view.render();

                expect(Popover.prototype.update).toHaveBeenCalledTimes(0);
                expect(AddMarkerMenu.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(DataDetail.prototype.displayGeometryOptions).toHaveBeenCalledTimes(0);

                this.view.$el.find('#add-geometry').trigger('click');
                expect(Popover.prototype.update).toHaveBeenCalledTimes(1);
                expect(AddMarkerMenu.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(DataDetail.prototype.displayGeometryOptions).toHaveBeenCalledTimes(1);
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
