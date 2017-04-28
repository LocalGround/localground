var rootDir = "../../";
define([
    "marionette",
    "jquery",
    rootDir + "apps/style/views/left/left-panel",
    rootDir + "apps/style/views/left/select-map-view",
    rootDir + "apps/style/views/left/layer-list-view",
    rootDir + "apps/style/views/left/skin-view",
    rootDir + "apps/style/views/left/panel-styles-view", 
    rootDir + "apps/style/views/left/new-map-modal-view", 
    rootDir + "lib/modals/modal"
],
    function (Marionette, $, LeftPanelView, SelectMapView, LayerListView, SkinView, PanelStylesView, NewMapModal, Modal) {
        'use strict';
        var mapView, fixture;

        function initView(scope) {
            // 1) add spies for all relevant objects:
          
            spyOn(SelectMapView.prototype, 'initialize').and.callThrough();
            spyOn(SelectMapView.prototype, 'changeMap');
            spyOn(SelectMapView.prototype, 'showAddMapModal').and.callThrough();
            spyOn(Modal.prototype, 'show').and.callThrough();
            spyOn(Modal.prototype, 'update').and.callThrough();
    

            fixture = setFixtures('<div id="map_dropdown_region"></div>');

            // 2) initialize rightPanel object:
            mapView = new SelectMapView({
                app: scope.app,
                collection: scope.maps
            });
            mapView.render();

            // 3) set fixture:
            fixture.append(mapView.$el); 
        };

        describe("When MapView is initialized", function () {
            beforeEach(function () {
                initView(this);
            });

            afterEach(function () {
                Backbone.history.stop();
            });

            it("should initialize", function () {
                expect(mapView).toEqual(jasmine.any(SelectMapView));
                expect(mapView.initialize).toHaveBeenCalledTimes(1);
            });

            it("should have correct html", function () {
                expect(fixture).toContainElement('#map-select');    
            });

            it(": collection should be correct", function () {
                expect(mapView.collection).toEqual(this.maps);
            });
        });

        describe("Events tests", function () {
            beforeEach(function () {
                initView(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });

            it(": events should trigger correct functions", function () {
                expect(mapView.changeMap).toHaveBeenCalledTimes(0);
                fixture.find('#map-select').trigger("change");
                expect(mapView.changeMap).toHaveBeenCalledTimes(1);

                // open modal
                expect(mapView.showAddMapModal).toHaveBeenCalledTimes(0);
                fixture.find('.add-map').trigger("click");
                expect(mapView.showAddMapModal).toHaveBeenCalledTimes(1);
                
            });

            it("modal is called with correct initialization parameters", function () {
                expect(mapView.modal).toEqual(jasmine.any(Modal));
                expect(Modal.prototype.update).toHaveBeenCalledTimes(0);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(0);
                mapView.showAddMapModal();
                expect(Modal.prototype.update).toHaveBeenCalledTimes(1);
                expect(Modal.prototype.show).toHaveBeenCalledTimes(1);
            });

        });
    });


