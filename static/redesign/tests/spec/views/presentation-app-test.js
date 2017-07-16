var rootDir = "../../";
define([
    "jquery",
    "backbone",
    rootDir + "apps/presentation/presentation-app"
],
    function ($, Backbone, PresentationApp) {
        'use strict';
        var presentationApp, fixture;

        function initApp(scope) {
            // 1) add dummy HTML elements:
            var $sandbox = $('<div class="main-panel presentation-main-panel none">'),
                $r1 = $('<div id="marker-detail-panel" class="side-panel"></div>'),
                $r2 = $('<div id="map-panel"><div id="map"></div></div>'),
                $r3 = $('<div id="presentation-title"></div>'),
                $r4 = $('<div id="legend"></div>');
            $sandbox.append($r1).append($r2).append($r3).append($r4);

            fixture = setFixtures($sandbox);

            // 2) add spies for all relevant objects:
            spyOn(PresentationApp.prototype, 'start');
            spyOn(PresentationApp.prototype, 'initialize');
            spyOn(PresentationApp.prototype, 'loadRegions');

            spyOn(scope.app.vent, 'trigger').and.callThrough();

            // 3) initialize ProfileApp object:
            presentationApp = new PresentationApp();
            presentationApp.start();
        }

        describe("PresentationApp: Application-Level Tests", function () {
            beforeEach(function () {
                //called before each "it" test
                initApp(this);
            });

            afterEach(function () {
                Backbone.history.stop();
            });

            it("Application calls methods successfully", function () {
                expect(presentationApp).toEqual(jasmine.any(PresentationApp));
                expect(presentationApp.initialize).toHaveBeenCalled();
            });

        });
    });
