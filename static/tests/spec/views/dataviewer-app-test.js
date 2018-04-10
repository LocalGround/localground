
var rootdir = "../../";
define([
    "handlebars",
    rootdir + "apps/dataviewer/app",
    rootDir + "lib/maps/overlays/base",
    rootDir + "lib/maps/overlays/infobubbles/base",
    "tests/spec-helper"
],
    function(Handlebars, DataViewerApp, Overlay, InfoBubble){
        'use strict';

        var fixture, newDataViewerApp, setupDataViewerApp;

        var html_template = '\
            <div id="toolbar-main" class="data-toolbar-main">\
            </div>\
            <div id="toolbar-dataview" class="filter data">\
            </div>\
            <main>\
            </main>\
            <aside id="tab-panel" class="tab-panel"></aside>\
            <div id="carouselModal" class="carousel-modal spreadsheet">\
                <span class="close big" >\
                    &times;\
                </span>\
            </div>';

        setupDataViewerApp = function(scope){
            fixture = setFixtures(html_template);
            newDataViewerApp = new DataViewerApp({
                dataManager: scope.dataManager
            });
            newDataViewerApp.start();
        };

        var initSpies = function(scope){
            // Functions from the file
            spyOn(scope.app.vent, "trigger").and.callThrough();
            spyOn(DataViewerApp.prototype, "start").and.callThrough();
            spyOn(DataViewerApp.prototype, "initialize").and.callThrough();
            spyOn(DataViewerApp.prototype, "loadFastRegions").and.callThrough();
            spyOn(DataViewerApp.prototype, "loadMainRegion").and.callThrough();
            spyOn(DataViewerApp.prototype, "initMainView"); // don't call through
            spyOn(DataViewerApp.prototype, "adjustLayout").and.callThrough();
            spyOn(DataViewerApp.prototype, "saveAppState").and.callThrough();
            spyOn(DataViewerApp.prototype, "restoreAppState").and.callThrough();

            // Other spies inside DataViewerApp
            spyOn(DataViewerApp.prototype, "addMessageListeners").and.callThrough();

            // Other spies
            spyOn(InfoBubble.prototype, "initialize");
            spyOn(Overlay.prototype, "initialize");
        };

        describe("Data Viewer App: Setting Up App", function(){

            beforeEach(function(){
                initSpies(this);
                setupDataViewerApp(this);
            });

            it("Successfully calls start", function(){
                expect(DataViewerApp.prototype.addMessageListeners).toHaveBeenCalledTimes(1);
            });
        });

    });
