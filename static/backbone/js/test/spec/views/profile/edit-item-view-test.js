define([
    "jquery",
    "profile-app",
    "views/profile/editItemView",
    "collections/photos",
    "models/photo",
    "../../../../test/spec-helper"
],
    function ($, ProfileApp, EditItemView, Photos, Photo) {
        'use strict';

        var editItemView;
        var profileApp;
        var listEditView;

        function initEditItemView(scope) {
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
            // spyOn(FilterView.prototype, "clickFilterArea").and.callThrough();

            // 3) initialize ProfileApp object:
            profileApp = new ProfileApp();
            profileApp.start(scope.profileOpts); // opts defined in spec-helpers

            // 4) these tests assume action on photos datatype:
            profileApp.objectType = "photos";

            listEditView = profileApp.mainView;
            listEditView.collection = scope.photos;

            console.log(listEditView);

        }

        describe("ProfileApplication: EditItemView Tests", function () {
            beforeEach(function () {
                initEditItemView(this);
            });

            afterEach(function () {
                $("#sandbox").remove();
            });

            it("Initializes with all of it's required initial data", function () {
                expect(1).toBe(1);
            });

        });
    });
