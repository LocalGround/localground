var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/gallery/gallery-app",
    rootDir + "apps/gallery/views/data-detail",
    rootDir + "views/toolbar-global",
    rootDir + "apps/gallery/views/toolbar-dataview",
    rootDir + "lib/data/dataManager",
    rootDir + "collections/projects" //,
    //"tests/spec-helper"
],
    function ($, GalleryApp, MediaDetail, ToolbarGlobal, ToolbarDataView, DataManager, Projects) {
        'use strict';
        var galleryApp;

        function initApp(scope) {
            // 1) add dummy HTML elements:
            var $sandbox = $('<div id="sandbox"></div>'),
                $r1 = $('<div class="main-panel"></div>'),
                $r2 = $('<div id="right-panel"></div>'),
                $r3 = $('<div id="map-panel"</div>'),
                $r4 = $('<div id="left-panel"</div>');


            $(document.body).append($sandbox);
            $sandbox.append($r1).append($r2).append($r3).append($r4);

            // 2) add spies for all relevant objects:
            spyOn(GalleryApp.prototype, 'start').and.callThrough();
            spyOn(GalleryApp.prototype, 'initialize').and.callThrough();
            spyOn(GalleryApp.prototype, 'loadRegions').and.callThrough();
            spyOn(GalleryApp.prototype, 'showGlobalToolbar');
            spyOn(GalleryApp.prototype, 'showDataToolbar');
            spyOn(GalleryApp.prototype, 'showMediaList');
            spyOn(GalleryApp.prototype, 'showMediaDetail');
            spyOn(GalleryApp.prototype, 'showSuccessMessage').and.callThrough();
            spyOn(GalleryApp.prototype, 'showWarningMessage').and.callThrough();
            spyOn(GalleryApp.prototype, 'showFailureMessage').and.callThrough();
            spyOn(GalleryApp.prototype, 'addMessageListeners').and.callThrough();

            spyOn(scope.app.vent, 'trigger').and.callThrough();

            spyOn(Projects.prototype, "fetch").and.callThrough();

            // 3) initialize ProfileApp object:
            galleryApp = new GalleryApp();
            galleryApp.start(); // opts defined in spec-helpers
        }

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
                expect(galleryApp.dataManager).toEqual(jasmine.any(DataManager));
                expect(galleryApp.addMessageListeners).toHaveBeenCalled();
            });

        });

        describe("GalleryApp: Display the status messages", function(){
            beforeEach(function(){
                initApp(this);
            });

            afterEach(function () {
                //called after each "it" test
                $("#sandbox").remove();
                Backbone.history.stop();
            });

            it("Shows the Success message", function(){
                expect(galleryApp.showSuccessMessage).toHaveBeenCalledTimes(0);
                galleryApp.vent.trigger('success-message', "Success Message Called");
                expect(galleryApp.showSuccessMessage).toHaveBeenCalledTimes(1);
                expect(galleryApp.showSuccessMessage).toHaveBeenCalledWith("Success Message Called");
            });

            it("Shows the Warning message", function(){
                expect(galleryApp.showWarningMessage).toHaveBeenCalledTimes(0);
                galleryApp.vent.trigger('warning-message', "Warning Message Called");
                expect(galleryApp.showWarningMessage).toHaveBeenCalledTimes(1);
                expect(galleryApp.showWarningMessage).toHaveBeenCalledWith("Warning Message Called");
            });

            it("Shows the Failure message", function(){
                expect(galleryApp.showFailureMessage).toHaveBeenCalledTimes(0);
                galleryApp.vent.trigger('error-message', "Failure Message Called");
                expect(galleryApp.showFailureMessage).toHaveBeenCalledTimes(1);
                expect(galleryApp.showFailureMessage).toHaveBeenCalledWith("Failure Message Called");
            });
        });
    });
