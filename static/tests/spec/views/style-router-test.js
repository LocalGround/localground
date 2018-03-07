var rootDir = "../../";
define([
    "backbone",
    rootDir + "apps/style/style-app",
  //  rootDir + "lib/maps/basemap",
    rootDir + "apps/style/router",
    rootDir + "apps/style/controller"
],
    function (Backbone, StyleApp, Router, Controller) {
        'use strict';
        var styleApp, fixture, initApp;

        initApp = function (scope) {
            // add dummy HTML elements:
            fixture = setFixtures('<div id="toolbar-main"></div> \
                <div class="main-panel">\
                    <div id="left-panel"></div>\
                    <div id="map-panel">\
                        <div id="map"></div>\
                    </div>\
                    <div id="right-panel" class="side-panel"></div>\
                </div>');

            // initialize ProfileApp object:
            styleApp = new StyleApp({
                dataManager: scope.dataManager
            });
            styleApp.start(); // opts defined in spec-helpers
            fixture.append(styleApp.$el);
        };

        describe('Router', function() {
            var trigger = {trigger: true};
            var router, controller;
            beforeEach(function () {
                initApp(this);

              //  Backbone.history.stop(); //stop the router
                spyOn(Controller.prototype, 'displayMap').and.callThrough();
                spyOn(Controller.prototype, 'newMap').and.callThrough();
                spyOn(Controller.prototype, 'newLayer').and.callThrough();
                spyOn(Controller.prototype, 'displayLayer').and.callThrough();
                spyOn(this.app.vent, 'trigger');

                // Set up the spies _before_ creating the router
                router = new Router({
                    app: this.app
                 });

                 controller = new Controller({
                     app: this.app
                 })
            //    Backbone.history.start();
            });
            afterEach(function () {
                // clear the url after each route
                Router.prototype.navigate('', trigger);

                Backbone.history.stop();
            });
            it('"/mapId" routes to requested map', function(){
                // ':mapId': 'displayMap',
                expect(controller.displayMap).toHaveBeenCalledTimes(0);
                router.navigate('/288', trigger);
                expect(controller.displayMap).toHaveBeenCalledTimes(1);
                expect(controller.displayMap).toHaveBeenCalledWith('288', null);
                expect(controller.app.vent.trigger).toHaveBeenCalledWith('route-map', '288');
            });

            it('"/new" routes to new map modal', function(){
                // 'new': 'newMap',
                expect(controller.newMap).toHaveBeenCalledTimes(0);
                router.navigate('/new', trigger);
                expect(controller.newMap).toHaveBeenCalledTimes(1);
                expect(controller.app.vent.trigger).toHaveBeenCalledWith('open-new-map-modal');
            });

            it('"/mapId/layers/new" routes to new layer', function(){
                // ':mapId/layers/new'
                expect(controller.newLayer).toHaveBeenCalledTimes(0);
                router.navigate('/288/layers/new', trigger);
                expect(controller.newLayer).toHaveBeenCalledTimes(1);
                expect(controller.newLayer).toHaveBeenCalledWith('288', null);
                expect(controller.app.vent.trigger).toHaveBeenCalledWith('route-new-layer', '288');

            });

            it('"/mapId/layers/layerId" routes to requested layer', function(){
                // ':mapId/layers/:layerId'
                expect(controller.displayLayer).toHaveBeenCalledTimes(0);
                router.navigate('/288/layers/4', trigger);
                expect(controller.displayLayer).toHaveBeenCalledTimes(1);
                expect(controller.displayLayer).toHaveBeenCalledWith('288', '4', null);
                expect(controller.app.vent.trigger).toHaveBeenCalledWith('route-layer', '288', '4');
            })
        });
    });
