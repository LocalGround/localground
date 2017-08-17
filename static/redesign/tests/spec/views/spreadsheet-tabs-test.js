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
        newSpreadsheetTabs = new SpreadsheetTabs({
            app: scope.app,
            forms: scope.forms
        });
        newSpreadsheetTabs.render();
        fixture = setFixtures("<div></div>").append(newSpreadsheetTabs.$el);
    };

    describe("Spreadsheet Tabs: Render", function () {
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

        it("Successfully renders as intended", function(){
            // Rough draft setup until functions are well defined
            console.log(fixture.html());
            expect(1).toEqual(0);
        });
    });
});
