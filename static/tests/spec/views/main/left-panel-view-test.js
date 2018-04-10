var rootDir = "../../../";
define([
    "jquery",
    "backbone",
    "marionette",
    rootDir + "lib/maps/overlays/marker",
    rootDir + "apps/main/views/left/left-panel",
    rootDir + "apps/main/views/left/map-title-view",
    rootDir + "apps/main/views/left/layer-list-view",
    rootDir + "apps/main/router",
    rootDir + "models/layer",
    "tests/spec-helper1"
],
    function ($, Backbone, Marionette, MarkerOverlay, LeftPanelView, MapTitleView,
            LayerListView, Router, Layer) {
        'use strict';
        var lpv, fixture;

        const initApp = (scope) => {


            // 1) add spies for all relevant objects:
            spyOn(Marionette.Region.prototype, 'show').and.callThrough();
            spyOn(scope.app.vent, 'trigger').and.callThrough();
            spyOn(LeftPanelView.prototype, 'initialize').and.callThrough();
            spyOn(LeftPanelView.prototype, 'onRender').and.callThrough();
            spyOn(LeftPanelView.prototype, 'deleteMap').and.callThrough();

            spyOn(MapTitleView.prototype, 'render').and.callThrough();
            spyOn(LayerListView.prototype, 'render').and.callThrough();

            spyOn(Layer.prototype, 'destroy').and.callThrough();

            //Interrupt propogation to Google Marker Overlays:
            spyOn(MarkerOverlay.prototype, "initialize");
            spyOn(MarkerOverlay.prototype, "redraw");



            // //do not execute:
            // spyOn(MainApp.prototype, 'showModal');


            // 3) add dummy HTML elements:
            fixture = setFixtures('<div></div>');
            // 2) initialize ProfileApp object:
            lpv = new LeftPanelView({
                app: scope.app,
                model: scope.map
            });
            fixture.append(lpv.$el);
        };

        describe("LeftPanelView initialization: ", function () {
            beforeEach(function () {
                initApp(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });

            it("initializes correctly", function () {
                expect(lpv.initialize).toHaveBeenCalledTimes(1);
                expect(lpv).toEqual(jasmine.any(LeftPanelView));
            });
            it("has correct regions", function() {
                expect(lpv.regions.menu).toEqual("#map_dropdown_region");
                expect(lpv.regions.layers).toEqual("#layers_region");
            });
            it("uses onRender() to display regions", function() {
                lpv.render();
                expect(lpv.onRender).toHaveBeenCalledTimes(1);

                expect(Marionette.Region.prototype.show).toHaveBeenCalledWith(jasmine.any(MapTitleView));
                expect(Marionette.Region.prototype.show).toHaveBeenCalledWith(jasmine.any(LayerListView));

                expect(MapTitleView.prototype.render).toHaveBeenCalledTimes(1);
                expect(LayerListView.prototype.render).toHaveBeenCalledTimes(1);
            });
        });
        describe("LeftPanelView function tests: ", function() {
            beforeEach(function () {
                initApp(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });

            it("clicking '#map-delete' calls deleteMap()", function () {
                lpv.render();
                expect(lpv.$el).toContainElement('#map-delete');
                expect(lpv.deleteMap).toHaveBeenCalledTimes(0);
                spyOn(window, 'confirm').and.returnValue(false);
                $(lpv.$el.find('#map-delete').click());
                expect(lpv.deleteMap).toHaveBeenCalledTimes(1);


            });
            // it("clicking '#map-delete' calls deleteMap()", function () {
            //     lpv.render();
            //     console.log(lpv);
            //     console.log(lpv.layers);
            //     //expect(Layer.prototype.destroy).not.toHaveBeenCalled();

            //     console.log(lpv.layers.currentView.children.length);
            //     spyOn(window, 'confirm').and.returnValue(true);
            //     $(lpv.$el.find('#map-delete').click());
            //     expect(Layer.prototype.destroy).toHaveBeenCalled();


            // });




        });

        // describe("MainApp vent listeners: ", function () {
        //     beforeEach(function () {
        //         initApp(this);
        //     });
        //     afterEach(function () {
        //         Backbone.history.stop();
        //     });
        //     it("Listens for 'route-map'", function() {
        //         expect(mainApp.setActiveMapModel).toHaveBeenCalledTimes(0);
        //         expect(Map.prototype.fetch).toHaveBeenCalledTimes(0);

        //         mainApp.vent.trigger('route-map', 2);
        //         expect(mainApp.setActiveMapModel).toHaveBeenCalledTimes(1);
        //         expect(Map.prototype.fetch).toHaveBeenCalledTimes(1);
        //         expect(mainApp.setActiveMapModel).toHaveBeenCalledWith(2);

        //     });
        //     it("Listens for 'hide-detail'", function() {
        //         expect(mainApp.hideDetail).toHaveBeenCalledTimes(0);
        //         mainApp.vent.trigger('hide-detail');
        //         expect(mainApp.hideDetail).toHaveBeenCalledTimes(1);
        //     });
        //     it("Listens for 'unhide-detail'", function() {
        //         expect(mainApp.unhideDetail).toHaveBeenCalledTimes(0);
        //         mainApp.vent.trigger('unhide-detail');
        //         expect(mainApp.unhideDetail).toHaveBeenCalledTimes(1);
        //     });


        // });

    });
