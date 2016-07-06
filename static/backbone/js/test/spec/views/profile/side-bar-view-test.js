define([
    "jquery",
    "profile-app",
    "views/profile/sideBarView",
    "collections/photos",
    "models/photo",
    "../../../../test/spec-helper"
],
    function ($, ProfileApp, SideBarView, Photos, Photo) {
        'use strict';

        var sideBarView;
        var profileApp;

        function initSideBarView(scope) {
            // to emulate actual functionality, let's create a
            // listEditView item (with photos collection)
            // from ProfileApp:
            var $sandbox = $('<div id="sandbox"></div>'),
                $r1 = $('<div id="region1"></div>'),
                $r2 = $('<div id="region2"</div>'),
                $r3 = $('<div id="region3"></div>');

            $(document.body).append($sandbox);
            $sandbox.append($r1).append($r2).append($r3);

            //add spies:
            spyOn($.fn, "click").and.callThrough();
            spyOn(SideBarView.prototype, "loadPhotosView").and.callThrough();
            spyOn(SideBarView.prototype, "loadScanView").and.callThrough();
            spyOn(SideBarView.prototype, "loadAudioView").and.callThrough();
            spyOn(SideBarView.prototype, "loadPrintView").and.callThrough();
            spyOn(SideBarView.prototype, "loadProjectView").and.callThrough();

            spyOn(ProfileApp.prototype, "showListView").and.callThrough();

            // 3) initialize ProfileApp object:
            profileApp = new ProfileApp();
            profileApp.start(scope.profileOpts); // opts defined in spec-helpers

            // 4) these tests assume action on photos datatype:
            profileApp.objectType = "photos";
            sideBarView = profileApp.sideBarView;

        }

        describe("ProfileApplication: SideBarView Tests", function () {
            beforeEach(function () {
                initSideBarView(this);
            });

            afterEach(function () {
                $("#sandbox").remove();
            });

            it("Initializes with all of it's required initial data", function () {
                expect(1).toBe(1);
            });

            it("Listens for photos view toggle", function () {
                $("#photos").trigger("click");
                expect(sideBarView.loadPhotosView).toHaveBeenCalled();
                expect(profileApp.showListView).toHaveBeenCalled();
            });

            it("Listens for audio view toggle", function () {
                $("#audio").trigger("click");
                expect(sideBarView.loadAudioView).toHaveBeenCalled();
                expect(profileApp.showListView).toHaveBeenCalled();
            });

            it("Listens for print view toggle", function () {
                $("#prints").trigger("click");
                expect(sideBarView.loadPrintView).toHaveBeenCalled();
                expect(profileApp.showListView).toHaveBeenCalled();
            });

            it("Listens for project view toggle", function () {
                $("#projects").trigger("click");
                expect(sideBarView.loadProjectView).toHaveBeenCalled();
                expect(profileApp.showListView).toHaveBeenCalled();
            });

            it("Listens for scan view toggle", function () {
                $("#scan").trigger("click");
                expect(sideBarView.loadScanView).toHaveBeenCalled();
                expect(profileApp.showListView).toHaveBeenCalled();
            });

        });
    });
