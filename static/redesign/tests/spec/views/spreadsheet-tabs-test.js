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
        newSpreadsheet;

    var setupSpreadsheetTabTest = function(scope){

        spyOn(scope.app.vent, 'trigger').and.callThrough();

        // Will expand this soon
    };

    describe("Spreadsheet Tabs: Render", function(){
        it("Successfully renders as intended", function(){
            // Rough draft setup until functions are well defined
            expect(1).toEqual(0);
        });
    });




};
