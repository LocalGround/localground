define([
    "jquery",
    "profile-app",
    "views/profile/listEditView",
    "collections/photos",
    "models/photo",
    "../../../../test/spec-helper"
],
    function ($, ProfileApp, ListEditView, Photos, Photo) {
        'use strict';
        var listEditView;

        function initEditView(scope) {
            // to emulate actual functionality, let's create a
            // listEditView item (with photos collection)
            // from ProfileApp:
            var $sandbox = $('<div id="sandbox"></div>'),
                $r1 = $('<div id="region1"></div>'),
                $r2 = $('<div id="region2"</div>'),
                $r3 = $('<div id="region3"></div>'),
                profileApp = null;

            $(document.body).append($sandbox);
            $sandbox.append($r1).append($r2).append($r3);

            //add spies:
            spyOn($.fn, "click").and.callThrough();
            spyOn(ListEditView.prototype, "saveData").and.callThrough();
            spyOn(ListEditView.prototype, "onShow").and.callThrough();
            //todo: add more ListEditView spies here...
            //
            //
            //
            spyOn(ListEditView.prototype, "refreshPaginator").and.callThrough();
            spyOn(Photos.prototype, "fetch");
            spyOn(Photos.prototype, "each").and.callThrough();
            spyOn(Photos.prototype, "get");
            spyOn(Photo.prototype, "trigger");

            // 3) initialize ProfileApp object:
            profileApp = new ProfileApp();
            profileApp.start(scope.profileOpts); // opts defined in spec-helpers

            // 4) these tests assume action on photos datatype:
            profileApp.objectType = "photos";
            listEditView = profileApp.mainView;
            listEditView.collection = scope.photos; //spoof fetch
        }

        describe("ProfileApplication: Initialization and Event Handler Tests", function () {
            beforeEach(function () {
                initEditView(this);
            });

            afterEach(function () {
                $("#sandbox").remove();
            });

            it("Initializes with all of it's required initial data", function () {
                expect(listEditView.collection).toEqual(jasmine.any(Photos));
                expect(listEditView.app).toEqual(jasmine.any(ProfileApp));
            });

            it("Listens for save changes", function () {
                var collection = listEditView.collection,
                    model = collection.at(0);
                $("#saveChanges").trigger("click");
                expect(listEditView.saveData).toHaveBeenCalled();
                expect(collection.each).toHaveBeenCalled();
                expect(model.trigger).toHaveBeenCalledWith("save-if-edited");
            });

            it("Listens for delete changes", function () {
                // make sure that deleteData function is called and that
                // collection.forEach and photo.destroy are called. This will
                // requires adding more spies to the "initEditView" function
                // above:
                expect(1).toBe(1);
            });

            it("Listens for delete changes", function () {
                //stub
                expect(1).toBe(1);
            });

            it("Listens for edit toggle", function () {
                //stub
                expect(1).toBe(1);
            });

            it("Listens for view toggle", function () {
                //stub
                expect(1).toBe(1);
            });

            it("Listens for update toggle", function () {
                //stub
                expect(1).toBe(1);
            });

        });
    });
