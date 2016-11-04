var rootDir = "../../../";
define([
    "jquery",
    rootDir + "apps/spreadsheet/spreadsheet-app",
    rootDir + "apps/spreadsheet/views/main",
    rootDir + "views/toolbar-global",
    rootDir + "apps/gallery/views/toolbar-dataview",
    rootDir + "collections/projects" //,
    //"tests/spec-helper"
],
    function ($, SpreadsheetApp, SpreadsheetView, ToolbarGlobal, ToolbarDataView, Projects) {
        'use strict';
        var spreadsheetApp;

        function initApp(scope) {
            // 1) add dummy HTML elements:
            var $sandbox = $('<div id="sandbox"></div>'),
                $r1 = $('<div id="toolbar-main"></div>'),
                $r2 = $('<div id="toolbar-dataview"></div>'),
                $r3 = $('<div class="main-panel"</div>');

            $(document.body).append($sandbox);
            $sandbox.append($r1).append($r2).append($r3);

            // 2) add spies for all relevant objects:
            spyOn(SpreadsheetApp.prototype, 'start').and.callThrough();
            spyOn(SpreadsheetApp.prototype, 'initialize').and.callThrough();
            spyOn(SpreadsheetApp.prototype, 'selectProject');
            spyOn(SpreadsheetApp.prototype, 'selectProjectLoadRegions').and.callThrough();
            spyOn(SpreadsheetApp.prototype, 'loadRegions');
            spyOn(SpreadsheetApp.prototype, 'showSpreadsheet');//.and.callThrough();
            //spyOn(SpreadsheetView.prototype, 'displaySpreadsheet');

            spyOn(Projects.prototype, "fetch").and.callThrough();

            // 3) initialize ProfileApp object:
            spreadsheetApp = new SpreadsheetApp();
            spreadsheetApp.start(); // opts defined in spec-helpers
            spreadsheetApp.selectedProject = { id: 1 };
        }

        describe("SpreadsheetApp: Application-Level Tests", function () {
            beforeEach(function () {
                //called before each "it" test
                initApp(this);
            });

            afterEach(function () {
                //called after each "it" test
                $("#sandbox").remove();
                Backbone.history.stop();
            });

            it("Application calls methods successfully", function () {
                expect(spreadsheetApp).toEqual(jasmine.any(SpreadsheetApp));
                expect(spreadsheetApp.initialize).toHaveBeenCalled();
                expect(spreadsheetApp.projects.fetch).toHaveBeenCalled();
            });

            it("Initializes subviews successfully and calls all the methods", function () {
                spreadsheetApp.projects.trigger('reset');
                expect(spreadsheetApp.selectProjectLoadRegions).toHaveBeenCalled();
                expect(spreadsheetApp.loadRegions).toHaveBeenCalled();
                //expect(spreadsheetApp.toolbarView).toEqual(jasmine.any(ToolbarGlobal));
                //expect(spreadsheetApp.toolbarDataView).toEqual(jasmine.any(ToolbarDataView));
            });

            it("Responds to media list trigger", function () {
                //expect(spreadsheetApp.showSpreadsheet).not.toHaveBeenCalled();
                spreadsheetApp.vent.trigger('show-list', 'audio');
                expect(spreadsheetApp.showSpreadsheet).toHaveBeenCalledWith('audio');
            });

        });
    });
