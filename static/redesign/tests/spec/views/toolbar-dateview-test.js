var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/gallery/views/toolbar-dataview"
    //"tests/spec-helper"
],
    function ($, ToolbarDataView) {
        'use strict';
        var fixture;

        function initSpies(scope) {
            spyOn(ToolbarDataView.prototype, "initalize").and.callThrough();
            spyOn(ToolbarDataView.prototype, "hideMenu").and.callThrough();
            spyOn(ToolbarDataView.prototype, "toggleMenu").and.callThrough();
            spyOn(ToolbarDataView.prototype, "triggerAddRow").and.callThrough();
            spyOn(ToolbarDataView.prototype, "triggerAddNew").and.callThrough();
            spyOn(ToolbarDataView.prototype, "triggerAddNewMap").and.callThrough();
            spyOn(ToolbarDataView.prototype, "changeMode").and.callThrough();
            spyOn(ToolbarDataView.prototype, "updateNewObejctRoute").and.callThrough();
            spyOn(ToolbarDataView.prototype, "renderAndRoute").and.callThrough();
            spyOn(ToolbarDataView.prototype, "doSearch").and.callThrough();
            spyOn(ToolbarDataView.prototype, "changeDisplay").and.callThrough();
            spyOn(ToolbarDataView.prototype, "createMediaUploadModal").and.callThrough();
            spyOn(ToolbarDataView.prototype, "createMapImageUploadModal").and.callThrough();
            spyOn(ToolbarDataView.prototype, "showModal").and.callThrough();
            spyOn(ToolbarDataView.prototype, "hideModal").and.callThrough();
            spyOn(ToolbarDataView.prototype, "editTargetForm").and.callThrough();
            spyOn(ToolbarDataView.prototype, "showCreateForm").and.callThrough();
        }

        describe("GalleryApp: Application-Level Tests", function () {
            beforeEach(function () {
                //called before each "it" test
                initSpies(this);
            });



            it("Placehilder Fail Test", function () {
                expect(1).toEqual(-1);
            });

        });


    });
