var rootDir = "../../";
define([
    "backbone",
    rootDir + "apps/style/style-app",
    rootDir + "lib/maps/basemap",
    rootDir + "apps/style/router"
],
    function (Backbone, StyleApp, BaseMapView, Router) {
        'use strict';
        var styleApp, fixture, initApp;

        initApp = function (scope) {

            // 1) add spies for all relevant objects:
            spyOn(StyleApp.prototype, 'initialize').and.callThrough();
            spyOn(StyleApp.prototype, 'loadRegions').and.callThrough();
            spyOn(StyleApp.prototype, 'updateDisplay').and.callThrough();
            spyOn(StyleApp.prototype, 'hideList').and.callThrough();
            spyOn(StyleApp.prototype, 'unhideList').and.callThrough();
            spyOn(StyleApp.prototype, 'hideDetail').and.callThrough();
            spyOn(StyleApp.prototype, 'unhideDetail').and.callThrough();
            spyOn(StyleApp.prototype, 'showRightLayout').and.callThrough();
            spyOn(StyleApp.prototype, 'rerouteIfNeeded').and.callThrough();
            spyOn(BaseMapView.prototype, 'renderMap');
            spyOn(BaseMapView.prototype, 'initialize');
            spyOn(BaseMapView.prototype, 'onShow');
            spyOn(BaseMapView.prototype, 'redraw');

            // 3) add dummy HTML elements:
            fixture = setFixtures('<div id="toolbar-main"></div> \
                <div class="main-panel">\
                    <div id="left-panel"></div>\
                    <div id="map-panel">\
                        <div id="map"></div>\
                    </div>\
                    <div id="right-panel" class="side-panel"></div>\
                </div>');
            // 2) initialize ProfileApp object:
            styleApp = new StyleApp({
                dataManager: scope.dataManager
            });
            console.log('initializing...');
            styleApp.start(); // opts defined in spec-helpers
            fixture.append(styleApp.$el);
        };

        describe("StyleApp: Application-Level Tests", function () {
            beforeEach(function () {
                initApp(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });

            it("should initialize correctly", function () {
                expect(styleApp.initialize).toHaveBeenCalledTimes(1);
                expect(styleApp).toEqual(jasmine.any(StyleApp));
            });
        });

        describe("StyleApp: events should trigger corresponding functions", function() {
            beforeEach(function () {
                initApp(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });
            it('should call loadRegions', function () {
                expect(StyleApp.prototype.loadRegions).toHaveBeenCalledTimes(0);
                styleApp.vent.trigger('data-loaded');
                expect(StyleApp.prototype.loadRegions).toHaveBeenCalledTimes(1);
            });
            it('should call rerouteIfNeeded', function () {
                expect(StyleApp.prototype.rerouteIfNeeded).toHaveBeenCalledTimes(0);
                styleApp.vent.trigger('ready-for-routing');
                expect(StyleApp.prototype.rerouteIfNeeded).toHaveBeenCalledTimes(1);
            });
            it('should create RightPanel', function () {
                expect(StyleApp.prototype.showRightLayout).toHaveBeenCalledTimes(0);
                styleApp.vent.trigger('edit-layer', this.testMap.get("layers").at(2), "fake collection");
                expect(StyleApp.prototype.showRightLayout).toHaveBeenCalledTimes(1);
            });
        });

        describe("StyleApp: Map Resize Tests", function () {
            beforeEach(function () {
                initApp(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });

            it("listens for hide detail", function () {
                expect(StyleApp.prototype.updateDisplay).not.toHaveBeenCalled();
                expect(StyleApp.prototype.hideDetail).toHaveBeenCalledTimes(0);
                styleApp.vent.trigger('hide-detail');
                expect(StyleApp.prototype.hideDetail).toHaveBeenCalledTimes(1);
                expect(StyleApp.prototype.updateDisplay).toHaveBeenCalled();
            });

            it("listens for unhide detail", function () {
                expect(StyleApp.prototype.updateDisplay).not.toHaveBeenCalled();
                expect(StyleApp.prototype.unhideDetail).toHaveBeenCalledTimes(0);
                styleApp.vent.trigger('unhide-detail');
                expect(StyleApp.prototype.unhideDetail).toHaveBeenCalledTimes(1);
                expect(StyleApp.prototype.updateDisplay).toHaveBeenCalled();
            });

            it("listens for hide list", function () {
                expect(StyleApp.prototype.updateDisplay).not.toHaveBeenCalled();
                expect(StyleApp.prototype.hideList).toHaveBeenCalledTimes(0);
                styleApp.vent.trigger('hide-list');
                expect(StyleApp.prototype.hideList).toHaveBeenCalledTimes(1);
                expect(StyleApp.prototype.updateDisplay).toHaveBeenCalled();
            });

            it("listens for unhide list", function () {
                expect(StyleApp.prototype.updateDisplay).not.toHaveBeenCalled();
                expect(StyleApp.prototype.unhideList).toHaveBeenCalledTimes(0);
                styleApp.vent.trigger('unhide-list');
                expect(StyleApp.prototype.unhideList).toHaveBeenCalledTimes(1);
                expect(StyleApp.prototype.updateDisplay).toHaveBeenCalled();
            });
        });
/*
        describe('Router', function() {
            var trigger = {trigger: true};
            var router;
            beforeEach(function () {
                initApp(this);
                // This is the trick, right here:
                // The Backbone history code dodges our spies
                // unless we set them up exactly like this:
                Backbone.history.stop(); //stop the router
              //  spyOn(Router.prototype, 'index'); //spy on our routes, and they won't get called
             //   spyOn(Router.prototype, 'displayMap'); 

               // router = new StyleApp.prototype.Router(); // Set up the spies _before_ creating the router
                Backbone.history.start();
            });
            afterEach(function () {
                Backbone.history.stop();
            });
            it('/item routes to item with id', function(){
                //':mapId': 'displayMap',
                console.log(StyleApp.prototype);
                Router.prototype.navigate('/288', trigger);
                expect(router.displayMap).toHaveBeenCalledWith('288');
              });

        });
        */

    });

