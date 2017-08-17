var rootDir = "../../";
define([
    "handlebars",
    rootDir + "apps/spreadsheet/views/main",
    rootDir + "apps/spreadsheet/views/tabs",
    rootDir + "models/form",
    "tests/spec-helper"
],
function(Handlebars, Spreadsheet, SpreadsheetTabs, Form){
    "use strict";
    var fixture,
        newSpreadsheetTabs;

    var setupSpreadsheetTabTest = function (scope) {

        spyOn(scope.app.vent, 'trigger').and.callThrough();
        spyOn(SpreadsheetTabs.prototype, "switchTab").and.callThrough();
        spyOn(SpreadsheetTabs.prototype, "render").and.callThrough();
        newSpreadsheetTabs = new SpreadsheetTabs({
            app: scope.app,
            forms: scope.forms
        });
        newSpreadsheetTabs.render();
        fixture = setFixtures("<div></div>").append(newSpreadsheetTabs.$el);
    };

    describe("Spreadsheet Tabs Test", function () {
        beforeEach(function () {
            setupSpreadsheetTabTest(this);
        });
        /**
         * 1. Check to make sure that there's a tab for photos, audio, sites, videos, and any form
         * in the forms collection.
         *
         * 2. Make sure that the tab name, class, and link are rendered correctly
         *
         * 3. Make sure that when the tab is clicked, it triggers switchTab
         *
         * 4. Make sure that switch tab does it's job (i.e. changes the dataType appropriately
         * and calls the render function)
         *
         * 5. Make sure that after tab switch, the tab that was just clicked has the
         *    tab-selected class in the DOM.
         *
         */

        it("Renders all the elements correctly", function(){

            var tabs = fixture.find(".tab");
            expect(tabs[0]).toHaveAttr("data-value", "photos");
            expect(tabs[1]).toHaveAttr("data-value", "audio");
            expect(tabs[2]).toHaveAttr("data-value", "videos");
            expect(tabs[3]).toHaveAttr("data-value", "markers");
            expect(tabs[4]).toHaveAttr("data-value", "form_1");
            expect(tabs[5]).toHaveAttr("data-value", "form_2");
            expect(tabs[0].innerHTML).toEqual("Photos");
            expect(tabs[1].innerHTML).toEqual("Audio");
            expect(tabs[2].innerHTML).toEqual("Videos");
            expect(tabs[3].innerHTML).toEqual("Sites");
            expect(tabs[4].innerHTML).toEqual("Test Form");
            expect(tabs[5].innerHTML).toEqual("Animals");
            expect(tabs[0]).toHaveAttr("href", "#/photos");
            expect(tabs[1]).toHaveAttr("href", "#/audio");
            expect(tabs[2]).toHaveAttr("href", "#/videos");
            expect(tabs[3]).toHaveAttr("href", "#/markers");
            expect(tabs[4]).toHaveAttr("href", "#/form_1");
            expect(tabs[5]).toHaveAttr("href", "#/form_2");
            expect(fixture.find(".tab-selected").length).toEqual(1);
        });

        it("Successfully switches active tab after clicking on another", function(){
            var tabs = fixture.find(".tab");
            var activeTabOnStart = fixture.find(".tab-selected");
            expect(this.app.dataType).toEqual("markers");
            expect(SpreadsheetTabs.prototype.switchTab).toHaveBeenCalledTimes(0);
            expect(SpreadsheetTabs.prototype.render).toHaveBeenCalledTimes(1);
            expect(tabs[3]).toHaveClass("tab-selected");
            $(tabs[0]).trigger('click');
            tabs = fixture.find(".tab");
            expect(SpreadsheetTabs.prototype.switchTab).toHaveBeenCalledTimes(1);
            expect(SpreadsheetTabs.prototype.render).toHaveBeenCalledTimes(2);
            expect(this.app.dataType).toEqual("photos");
            expect(tabs[3]).not.toHaveClass("tab-selected");

        });

    });
});
