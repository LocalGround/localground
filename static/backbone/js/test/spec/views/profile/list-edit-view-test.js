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
        var profileApp;

        function initEditView(scope) {
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
            spyOn(ListEditView.prototype, "saveData").and.callThrough();
            spyOn(ListEditView.prototype, "onShow").and.callThrough();
            //todo: add more ListEditView spies here...
            spyOn(ListEditView.prototype, "viewEdit").and.callThrough();
            spyOn(ListEditView.prototype, "viewStatic").and.callThrough();
            spyOn(ListEditView.prototype, "updateChecked").and.callThrough();
            spyOn(ListEditView.prototype, "deleteData").and.callThrough();
            //
            spyOn(ListEditView.prototype, "refreshPaginator").and.callThrough();
            spyOn(Photos.prototype, "fetch");
            spyOn(Photos.prototype, "each").and.callThrough();
            spyOn(Photos.prototype, "get");
            spyOn(Photo.prototype, "trigger");
            spyOn(Photo.prototype, "destroy");

            // 3) initialize ProfileApp object:
            profileApp = new ProfileApp();
            profileApp.start(scope.profileOpts); // opts defined in spec-helpers

            // 4) these tests assume action on photos datatype:
            profileApp.objectType = "photos";
            listEditView = profileApp.mainView;
            listEditView.collection = scope.photos; //spoof fetch
        }

        describe("ProfileApplication: ListEditView Tests", function () {
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
                var collection = listEditView.collection,
                model = collection.at(0);

                model.set({checked : true});

                $("#deleteChanges").trigger("click");
                expect(listEditView.deleteData).toHaveBeenCalled();
                expect(collection.each).toHaveBeenCalled();
                expect(model.destroy).toHaveBeenCalled();

                expect(collection.fetch).toHaveBeenCalled();
                expect(listEditView.refreshPaginator).toHaveBeenCalled();

            });

            it("Listens for edit toggle", function () {
                //stub
                $("#viewEdit").trigger("click");
                expect(listEditView.viewEdit).toHaveBeenCalled();
                expect(listEditView.refreshPaginator).toHaveBeenCalled();
            });

            it("Listens for view toggle", function () {
                //stub
                $("#viewStatic").trigger("click");
                expect(listEditView.viewStatic).toHaveBeenCalled();
                expect(listEditView.refreshPaginator).toHaveBeenCalled();
            });

            it("Listens for update toggle", function () {
                //stub
                $("#listContainer").trigger("click");
                expect(1).toBe(1);
                // expect(listEditView.updateChecked).toHaveBeenCalled();
                // expect(listEditView.refreshPaginator).toHaveBeenCalled();
            });

        });
    });
