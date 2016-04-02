define([
    "jquery",
    "profile-app",
    "views/profile/filterView",
    "views/profile/listEditView",
    "views/profile/sideBarView",
    "collections/photos",
    "../../../../test/spec-helper"
],
    function ($, ProfileApp, FilterView, ListEditView, SideBarView, Photos) {
        'use strict';
        var profileApp;

        function initApp(scope) {
            /*
             * this function is called before each test
             * by Jasmine's "beforeEach" hook
             */
            
            // 1) add dummy HTML elements:
            var $sandbox = $('<div id="sandbox"></div>'),
                $r1 = $('<div id="region1"></div>'),
                $r2 = $('<div id="region2"</div>'),
                $r3 = $('<div id="region3"></div>');

            $(document.body).append($sandbox);
            $sandbox.append($r1).append($r2).append($r3);

            /* Note: Important to add spies before you initialize the
               object
            */
            // 2) add spies for all relevant objects:
            spyOn(ProfileApp.prototype, 'showListView').and.callThrough();
            spyOn(ProfileApp.prototype, 'applyFilter').and.callThrough();
            spyOn(ProfileApp.prototype, 'clearFilter').and.callThrough();
            spyOn(ListEditView.prototype, 'onShow');

            //also add spies for relevant sub-objects:
            spyOn(Photos.prototype, "fetch");
            spyOn(Photos.prototype, "setServerQuery");
            spyOn(Photos.prototype, "clearServerQuery");

            // 3) initialize ProfileApp object:
            profileApp = new ProfileApp();
            profileApp.start(scope.profileOpts); // opts defined in spec-helpers

            // 4) these tests assume action on photos datatype:
            profileApp.objectType = "photos";
        }

        describe("ProfileApplication: Initialization and Event Handler Tests", function () {
            beforeEach(function () {
                //called before each "it" test
                initApp(this);
            });

            afterEach(function () {
                //called after each "it" test
                $("#sandbox").remove();
            });

            it("Application initializes subviews successfully", function () {
                expect(profileApp.mainView).toEqual(jasmine.any(ListEditView));
                expect(profileApp.filterView).toEqual(jasmine.any(FilterView));
                expect(profileApp.sideBarView).toEqual(jasmine.any(SideBarView));
            });

            it("Calls showListView when show-list-view event triggered", function () {
                profileApp.vent.trigger("show-list-view");
                expect(profileApp.showListView).toHaveBeenCalled();
                expect(profileApp.mainView.onShow).toHaveBeenCalled();
            });

            it("Calls applyFilter when apply-filter event triggered", function () {
                var params = [{name: "name", value: "rand", operation: "LIKE"}],
                    collection = profileApp.config.photos.collection;
                profileApp.vent.trigger("apply-filter", params);
                expect(profileApp.applyFilter).toHaveBeenCalledWith(params);
                expect(collection.setServerQuery).toHaveBeenCalledWith(params);
                expect(collection.fetch).toHaveBeenCalled();
            });

            it("Calls clearFilter when clear-filter event triggered", function () {
                var collection = profileApp.config.photos.collection;
                profileApp.vent.trigger("clear-filter");
                expect(profileApp.clearFilter).toHaveBeenCalled();
                expect(collection.clearServerQuery).toHaveBeenCalled();
                expect(collection.fetch).toHaveBeenCalled();
            });

        });
    });
