/*
  Data Detail Test goes here
*/

var rootDir = "../../../";
define([
    rootDir + "apps/main/views/left/add-marker-menu",
    rootDir + "views/data-detail",
    "tests/spec-helper1"
],
    function (AddMarkerMenu, DataDetail) {

        'use strict';
        var lat, lng;

        const initSpies = function (scope) {

            spyOn(AddMarkerMenu.prototype, 'initialize').and.callThrough();
            spyOn(AddMarkerMenu.prototype, 'notifyDrawingManager').and.callThrough();
            spyOn(AddMarkerMenu.prototype, 'initAddPoint').and.callThrough();
            spyOn(AddMarkerMenu.prototype, 'initAddPolygon').and.callThrough();
            spyOn(AddMarkerMenu.prototype, 'initAddPolyline').and.callThrough();
            spyOn(AddMarkerMenu.prototype, 'initAddRectangle').and.callThrough();
            spyOn(scope.app.vent, 'trigger').and.callThrough();

        };

        const initView = function (scope) {

            scope.mockEvent = {
                test: 'string',
                preventDefault: function() {
                    return;
                }
            };
            scope.parent = new DataDetail({
                app: scope.app,
                model: scope.getRecord()
            })

            scope.view = new AddMarkerMenu({
                app: scope.app,
                model: scope.getRecord(),
                parent: scope.parent
            });
        };

        describe("AddMarkerMenu: Tests", function(){
            beforeEach(function(){
                initSpies(this);
                initView(this);
            });

            it("AddMarkerMenu successfully created", function(){
                expect(this.view).toEqual(jasmine.any(AddMarkerMenu));
            });

            it("renders menu correctly", function() {
                this.view.render();
                expect(this.view.$el.find('svg').length).toEqual(3);
                expect(this.view.$el).toContainElement('#Circle');
                expect(this.view.$el).toContainElement('#Polyline');
                expect(this.view.$el).toContainElement('#Polygon');
                expect(this.view.$el).toContainElement('.geometry-list-wrapper');
                expect(this.view.$el.find('#select-point span')).toContainText('Point');
                expect(this.view.$el.find('#select-polyline span')).toContainText('Polyline');
                expect(this.view.$el.find('#select-polygon span')).toContainText('Polygon');
            });

            it("initAddPoint() works", function() {
                this.view.model.set('geometry', null);
                this.view.render();


                this.view.$el.find('#add-geometry').trigger('click');

                expect(AddMarkerMenu.prototype.initAddPoint).toHaveBeenCalledTimes(0);
                expect(AddMarkerMenu.prototype.notifyDrawingManager).toHaveBeenCalledTimes(0);
                this.view.$el.find('#select-point').trigger('click');


                expect(AddMarkerMenu.prototype.notifyDrawingManager).toHaveBeenCalledWith(jasmine.any(Object), 'add-point');
                expect(AddMarkerMenu.prototype.initAddPoint).toHaveBeenCalledTimes(1);
                expect(AddMarkerMenu.prototype.notifyDrawingManager).toHaveBeenCalledTimes(1);

            });

            it("initAddPolygon() works", function() {
                this.view.model.set('geometry', null);
                this.view.render();


                this.view.$el.find('#add-geometry').trigger('click');

                expect(AddMarkerMenu.prototype.initAddPolygon).toHaveBeenCalledTimes(0);
                expect(AddMarkerMenu.prototype.notifyDrawingManager).toHaveBeenCalledTimes(0);
                this.view.$el.find('#select-polygon').trigger('click');


                expect(AddMarkerMenu.prototype.notifyDrawingManager).toHaveBeenCalledWith(jasmine.any(Object), 'add-polygon');
                expect(AddMarkerMenu.prototype.initAddPolygon).toHaveBeenCalledTimes(1);
                expect(AddMarkerMenu.prototype.notifyDrawingManager).toHaveBeenCalledTimes(1);
                this.view.notifyDrawingManager(this.mockEvent, 'add-polygon');
                expect(this.app.vent.trigger).toHaveBeenCalledWith('add-polygon', this.parent.cid, this.mockEvent);

            });

            it("initAddPolyline() works", function() {
                this.view.model.set('geometry', null);
                this.view.render();


                this.view.$el.find('#add-geometry').trigger('click');

                expect(AddMarkerMenu.prototype.initAddPolygon).toHaveBeenCalledTimes(0);
                expect(AddMarkerMenu.prototype.notifyDrawingManager).toHaveBeenCalledTimes(0);
                this.view.$el.find('#select-polyline').trigger('click');


                expect(AddMarkerMenu.prototype.notifyDrawingManager).toHaveBeenCalledWith(jasmine.any(Object), 'add-polyline');
                expect(AddMarkerMenu.prototype.initAddPolyline).toHaveBeenCalledTimes(1);
                expect(AddMarkerMenu.prototype.notifyDrawingManager).toHaveBeenCalledTimes(1);
                this.view.notifyDrawingManager(this.mockEvent, 'add-polyline');
                expect(this.app.vent.trigger).toHaveBeenCalledWith('add-polyline', this.parent.cid, this.mockEvent);

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
                this.view.notifyDrawingManager(this.mockEvent, 'add-point');
                expect(this.app.vent.trigger).toHaveBeenCalledWith('add-point', this.parent.cid, this.mockEvent);
            });

        });

    });
