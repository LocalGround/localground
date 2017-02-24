var rootDir = "../../../";
define([
    "jquery",
    rootDir + "apps/gallery/gallery-app",
    rootDir + "apps/gallery/views/media-detail",
    rootDir + "views/toolbar-global",
    rootDir + "apps/gallery/views/toolbar-dataview",
    rootDir + "collections/projects" //,
    //"tests/spec-helper"
],
    function ($, GalleryApp, MediaDetail, ToolbarGlobal, ToolbarDataView, Projects) {
        'use strict';
        var galleryApp;

        function initApp(scope) {
            // 1) add dummy HTML elements:
            var $sandbox = $('<div id="sandbox"></div>'),
                $r1 = $('<div id="toolbar-main"></div>'),
                $r2 = $('<div id="toolbar-dataview"></div>'),
                $r3 = $('<div id="main-panel"</div>');

            $(document.body).append($sandbox);
            $sandbox.append($r1).append($r2).append($r3);

            // 2) add spies for all relevant objects:
            spyOn(GalleryApp.prototype, 'start').and.callThrough();
            spyOn(GalleryApp.prototype, 'initialize').and.callThrough();
            spyOn(GalleryApp.prototype, 'selectProjectLoadRegions').and.callThrough();
            spyOn(GalleryApp.prototype, 'loadRegions').and.callThrough();
            spyOn(GalleryApp.prototype, 'showGlobalToolbar').and.callThrough();
            spyOn(GalleryApp.prototype, 'showDataToolbar').and.callThrough();
            spyOn(GalleryApp.prototype, 'showMediaList');
            spyOn(GalleryApp.prototype, 'showMediaDetail');

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
                expect(galleryApp.projects.fetch).toHaveBeenCalled();
            });

            it("Initializes subviews successfully and calls all the methods", function () {
                galleryApp.projects.trigger('reset');
                expect(galleryApp.selectProjectLoadRegions).toHaveBeenCalled();
                expect(galleryApp.loadRegions).toHaveBeenCalled();
                expect(galleryApp.showGlobalToolbar).toHaveBeenCalled();
                expect(galleryApp.showDataToolbar).toHaveBeenCalled();
                expect(galleryApp.showMediaList).toHaveBeenCalled();
                expect(galleryApp.toolbarView).toEqual(jasmine.any(ToolbarGlobal));
                expect(galleryApp.toolbarDataView).toEqual(jasmine.any(ToolbarDataView));
            });

            it("Responds to media list trigger", function () {
                expect(galleryApp.showMediaList).not.toHaveBeenCalled();
                galleryApp.vent.trigger('show-detail', 3);
                galleryApp.vent.trigger('show-list', 'audio');
                expect(galleryApp.showMediaList).toHaveBeenCalledWith('audio');
            });

            it("Responds to media detail trigger", function () {
                expect(galleryApp.showMediaDetail).not.toHaveBeenCalled();
                galleryApp.vent.trigger('show-detail', 3);
                expect(galleryApp.showMediaDetail).toHaveBeenCalledWith(3);
            });

        });
    });
