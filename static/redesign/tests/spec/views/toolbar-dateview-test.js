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
            spyOn(ToolbarDataView.prototype, "triggerAddNew").and.callThrough();
            spyOn(ToolbarDataView.prototype, "triggerAddNewMap");
            spyOn(ToolbarDataView.prototype, "updateNewObejctRoute").and.callThrough();
            spyOn(ToolbarDataView.prototype, "renderAndRoute").and.callThrough();
            spyOn(ToolbarDataView.prototype, "doSearch").and.callThrough();
            spyOn(ToolbarDataView.prototype, "changeDisplay").and.callThrough();
            spyOn(ToolbarDataView.prototype, "createMediaUploadModal").and.callThrough();
            spyOn(ToolbarDataView.prototype, "createMapImageUploadModal").and.callThrough();
            spyOn(ToolbarDataView.prototype, "showModal");
            spyOn(ToolbarDataView.prototype, "hideModal").and.callThrough();
            spyOn(ToolbarDataView.prototype, "editTargetForm").and.callThrough();
            spyOn(ToolbarDataView.prototype, "showCreateForm").and.callThrough();
        }

        function initToolbarDataview(scope){
            scope.app.screenType = "map";
            scope.app.activeTab = "data";
            newToolbarDataview = new ToolbarDataView({
                app: scope.app,
                forms: scope.forms
                // Tinking about setting up the default screentype to map, but how?
            });
            fixture = setFixtures("<div></div>");
            fixture.append(newToolbarDataview.$el);
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
                // When the user clicks on the body, the menu should hide
                expect(ToolbarDataView.prototype.hideMenus).toHaveBeenCalledTimes(0);
                $("body").trigger("click");
                expect(ToolbarDataView.prototype.hideMenus).toHaveBeenCalledTimes(1);
                //expect(1).toEqual(-1)
            });

            it ("Calls the Toggle Menu", function(){
                // When user clicks on the "add", toggle the menu
                expect(ToolbarDataView.prototype.toggleMenu).toHaveBeenCalledTimes(0);
                fixture.find(".add").trigger("click");
                expect(ToolbarDataView.prototype.toggleMenu).toHaveBeenCalledTimes(1);
                //expect(1).toEqual(-1)
            });

            /*
            // This only works for gallery and spreadsheet mode
            it ("Calls the Change Display", function(){
                expect(ToolbarDataView.prototype.changeDisplay).toHaveBeenCalledTimes(0);
                console.log(fixture[0].innerHTML);
                fixture.find(".media-type").trigger("change");
                expect(ToolbarDataView.prototype.changeDisplay).toHaveBeenCalledTimes(1);
            });
            */
        });

        describe("Toolbar Dataview: Trigger Add Functions", function(){

            beforeEach(function(){
                initSpies(this);
                initToolbarDataview(this);
            });
            /*
            // Only available for spreadsheet and gallery
            it ("Calls the Trigger Add New", function(){
                expect(1).toEqual(-1)
            });
            */

            it ("Calls the Trigger Add New Map", function(){
                expect(ToolbarDataView.prototype.triggerAddNewMap).toHaveBeenCalledTimes(0);
                fixture.find(".add-new").trigger("click");
                expect(ToolbarDataView.prototype.triggerAddNewMap).toHaveBeenCalledTimes(1);
                //expect(1).toEqual(-1)
            });
        });

        describe("Toolbar Dataview: Create Media Functions", function(){

            beforeEach(function(){
                initSpies(this);
                initToolbarDataview(this);
            });

            it ("Calls the Create Media Upload Modal", function(){
                expect(ToolbarDataView.prototype.createMediaUploadModal).toHaveBeenCalledTimes(0);
                fixture.find(".add-media").trigger("click");
                expect(ToolbarDataView.prototype.createMediaUploadModal).toHaveBeenCalledTimes(1);
                //expect(1).toEqual(-1)
            });

            it ("Calls the Create Map Image Upload Modal", function(){
                expect(ToolbarDataView.prototype.createMapImageUploadModal).toHaveBeenCalledTimes(0);
                fixture.find(".add-map-image").trigger("click");
                expect(ToolbarDataView.prototype.createMapImageUploadModal).toHaveBeenCalledTimes(1);
                //expect(1).toEqual(-1)
            });
        });

        describe("Toolbar Dataview: Modal Functions", function(){

            beforeEach(function(){
                initSpies(this);
                initToolbarDataview(this);
            });

            it ("Calls the Show Modal", function(){
                expect(ToolbarDataView.prototype.showModal).toHaveBeenCalledTimes(0);
                newToolbarDataview.app.vent.trigger("show-modal");
                expect(ToolbarDataView.prototype.showModal).toHaveBeenCalledTimes(1);
                //expect(1).toEqual(-1)
            });

            it ("Calls the Hide Modal", function(){
                expect(ToolbarDataView.prototype.hideModal).toHaveBeenCalledTimes(0);
                newToolbarDataview.app.vent.trigger("hide-modal");
                expect(ToolbarDataView.prototype.hideModal).toHaveBeenCalledTimes(1);
                //expect(1).toEqual(-1)
            });
        });

        describe("Toolbar Dataview: Form Functions", function(){

            beforeEach(function(){
                initSpies(this);
                initToolbarDataview(this);
            });

            it ("Calls the Show Create Form", function(){
                expect(ToolbarDataView.prototype.showCreateForm).toHaveBeenCalledTimes(0);
                fixture.find(".add-type").trigger("click");
                expect(ToolbarDataView.prototype.showCreateForm).toHaveBeenCalledTimes(1);
                //expect(1).toEqual(-1)
            });

            it ("Calls the Edit Target Form", function(){
                // This one has 'e' as parameter. It has to be spoofed
                expect(ToolbarDataView.prototype.editTargetForm).toHaveBeenCalledTimes(0);
                console.log(fixture[0].innerHTML);
                fixture.find(".edit-type").trigger("click", {
                    target: {
                            parentElement: {innerText: "HELLO"}
                        }
                    });
                expect(ToolbarDataView.prototype.editTargetForm).toHaveBeenCalledTimes(1);
                //expect(1).toEqual(-1)
            });
        });




    });
