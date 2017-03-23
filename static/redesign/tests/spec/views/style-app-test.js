var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/style/style-app"    
],
    function ($, StyleApp) {
        'use strict';
        var styleApp, fixture;

        function initApp(scope) {    

            var $sandbox = $('<div id="sandbox"></div>'),
                $r1 = $('<div id="toolbar-main"></div>'),
                $r2 = $('<div id="toolbar-dataview"></div>'),
                $r3 = $('<div id="map-panel"</div>');

            $(document.body).append($sandbox);
            $sandbox.append($r1);
            $sandbox.append($r2);
            $sandbox.append($r3);  
            console.log($sandbox);  
                
            // 1) add spies for all relevant objects:
            spyOn(StyleApp.prototype, 'initialize').and.callThrough();
            spyOn(StyleApp.prototype, 'resizeMap').and.callThrough();
          //  spyOn(GalleryApp.prototype, 'showMediaDetail');
          //  spyOn(Projects.prototype, "fetch").and.callThrough();

            // 2) initialize ProfileApp object:
            styleApp = new StyleApp();
            styleApp.start(); // opts defined in spec-helpers

            // 3) add dummy HTML elements:
          //  fixture = setFixtures('<div></div>').append(styleApp.$el);
        };

        describe("StyleApp: Application-Level Tests", function () {
            beforeEach(function () {
                initApp(this); 
            });

            it("should initialize correctly", function () {
                expect(styleApp.initialize).toHaveBeenCalledTimes(1);
                expect(styleApp).toEqual(jasmine.any(StyleApp));
                //test for data manager?
              //  console.log(styleApp.vent);
            });

            it("events should trigger correct functions", function () {
                  expect(styleApp.resizeMap).toHaveBeenCalledTimes(0);
                styleApp.vent.trigger('resize-map', 300);
                expect(styleApp.resizeMap).toHaveBeenCalledTimes(1);
            });
        });
        

/*
        describe("GalleryApp: Application-Level Tests", function () {
            beforeEach(function () {
                //called before each "it" test
                initApp(this);
            });

            afterEach(function () {
                //called after each "it" test
                $("#sandbox").remove();
                Backbone.history.stop();
            });

            it("Application calls methods successfully", function () {
                expect(galleryApp).toEqual(jasmine.any(GalleryApp));
                expect(galleryApp.initialize).toHaveBeenCalled();
                expect(galleryApp.projects.fetch).toHaveBeenCalled();
            });
*/

    });

