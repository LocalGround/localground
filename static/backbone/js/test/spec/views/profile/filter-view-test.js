define([
    "jquery",
    "profile-app",
    "views/profile/filterView",
    "collections/photos",
    "models/photo",
    "../../../../test/spec-helper"
],
    function ($, ProfileApp, FilterView, Photos, Photo) {
        'use strict';

        var filterView;
        var profileApp;
        var listEditView;

        function initFilterView(scope) {
            // to emulate actual functionality, let's create a
            // listEditView item (with photos collection)
            // from ProfileApp:
            var $sandbox = $('<div id="sandbox"></div>'),
                $r1 = $('<div id="region1"></div>'),
                $r2 = $('<div id="region2"</div>'),
                $r3 = $('<div id="region3"></div>');

            $(document.body).append($sandbox);
            $sandbox.append($r1).append($r2).append($r3);

            var params = [{ name : 'abc', value : '1234', operation: 'LIKE' }];

            //add spies:
            spyOn($.fn, "click").and.callThrough();
            spyOn(FilterView.prototype, "clickFilterArea").and.callThrough();
            spyOn(FilterView.prototype, "clearFilter").and.callThrough();
            spyOn(FilterView.prototype, "applyFilter").and.callThrough();
            
            spyOn(FilterView.prototype, "createParameterList").and.returnValue(params);


            spyOn(ProfileApp.prototype, "clearFilter").and.callThrough();
            spyOn(ProfileApp.prototype, "applyFilter").and.callThrough();

            spyOn(Photos.prototype, "clearServerQuery").and.callThrough();
            spyOn(Photos.prototype, "setServerQuery").and.callThrough();
            spyOn(Photos.prototype, "fetch").and.callThrough();



            // 3) initialize ProfileApp object:
            profileApp = new ProfileApp();
            profileApp.start(scope.profileOpts); // opts defined in spec-helpers

            // 4) these tests assume action on photos datatype:
            profileApp.objectType = "photos";
            filterView = profileApp.filterView;

            listEditView = profileApp.mainView;
            listEditView.collection = scope.photos;

        }

        describe("ProfileApplication: FilterView Tests", function () {
            beforeEach(function () {
                initFilterView(this);
            });

            afterEach(function () {
                $("#sandbox").remove();
            });

            it("Initializes with all of it's required initial data", function () {
                expect(1).toBe(1);
            });

            it("Listens for clicks on the filter view pop up.", function () {
                $("#filter-menu").trigger("click");
                expect(filterView.clickFilterArea).toHaveBeenCalled();
            });

            it("Listens for click of clear filter button", function () {
                $("#clearSearch").trigger("click");
                expect(filterView.clearFilter).toHaveBeenCalled();
                expect(profileApp.clearFilter).toHaveBeenCalled();

                var collection = profileApp.config[profileApp.objectType].collection;
                expect(collection.clearServerQuery).toHaveBeenCalled();
                expect(collection.fetch).toHaveBeenCalled();

            });

            it("Listens for click of apply filter button", function () {
                $("#submitSearch").trigger("click");
                expect(filterView.applyFilter).toHaveBeenCalled();
                expect(filterView.createParameterList).toHaveBeenCalled();
                expect(profileApp.applyFilter).toHaveBeenCalled();

                var collection = profileApp.config[profileApp.objectType].collection;
                expect(collection.setServerQuery).toHaveBeenCalled();
                expect(collection.fetch).toHaveBeenCalled();

            });
        });
    });
