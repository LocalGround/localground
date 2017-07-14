var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/gallery/views/toolbar-dataview"
    //"tests/spec-helper"
],
    function ($, ToolbarDataView) {
        'use strict';
        var fixture,
            newToolbarDataview;

        function initSpies(scope) {
            spyOn(ToolbarDataView.prototype, "initialize").and.callThrough();
            spyOn(ToolbarDataView.prototype, "hideMenus").and.callThrough();
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

        function initToolbarDataview(scope){
            newToolbarDataview = new ToolbarDataView({
                app: scope.app
            });
        }

        describe("Toolbar Dataview: Start-up tests", function () {
            beforeEach(function () {
                //called before each "it" test
                initSpies(this);
            });



            it("Successfully calls initialize", function () {
                expect(ToolbarDataView.prototype.initialize).toHaveBeenCalledTimes(0);
                initToolbarDataview(this);
                expect(ToolbarDataView.prototype.initialize).toHaveBeenCalledTimes(1);
            });

        });

        describe("Toolbar Dataview: Menu Functions", function(){

            beforeEach(function(){
                initSpies(this);
                initToolbarDataview(this);
            });

            it ("Calls the Hide Menu", function(){
                expect(1).toEqual(-1)
            });

            it ("Calls the Toggle Menu", function(){
                expect(1).toEqual(-1)
            });

            it ("Calls the Change Mode", function(){
                expect(1).toEqual(-1)
            });

            it ("Calls the Change Display", function(){
                expect(1).toEqual(-1)
            });
        });

        describe("Toolbar Dataview: Trigger Add Functions", function(){

            beforeEach(function(){
                initSpies(this);
                initToolbarDataview(this);
            });

            it ("Calls the Trigger Add Row", function(){
                expect(1).toEqual(-1)
            });

            it ("Calls the Trigger Add New", function(){
                expect(1).toEqual(-1)
            });

            it ("Calls the Trigger New Map", function(){
                expect(1).toEqual(-1)
            });
        });

        describe("Toolbar Dataview: Create Media Functions", function(){

            beforeEach(function(){
                initSpies(this);
                initToolbarDataview(this);
            });

            it ("Calls the Create Media Upload", function(){
                expect(1).toEqual(-1)
            });

            it ("Calls the Create Map Image Upload Modal", function(){
                expect(1).toEqual(-1)
            });
        });

        describe("Toolbar Dataview: Modal Functions", function(){

            beforeEach(function(){
                initSpies(this);
                initToolbarDataview(this);
            });

            it ("Calls the Show Modal", function(){
                expect(1).toEqual(-1)
            });

            it ("Calls the Hide Modal", function(){
                expect(1).toEqual(-1)
            });
        });

        describe("Toolbar Dataview: Form Functions", function(){

            beforeEach(function(){
                initSpies(this);
                initToolbarDataview(this);
            });

            it ("Calls the Show Create Form", function(){
                expect(1).toEqual(-1)
            });

            it ("Calls the Edit Target Form", function(){
                expect(1).toEqual(-1)
            });
        });




    });
