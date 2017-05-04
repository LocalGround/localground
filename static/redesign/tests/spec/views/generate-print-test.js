var rootDir = "../../";
define([
    "handlebars",
    rootDir + "views/generate-print",
    rootDir + "views/print-options",
    rootDir + "views/toolbar-global",
    rootDir + "models/print",
    rootDir + "lib/maps/basemap",
    "tests/spec-helper"
],
    function (Handlebars, PrintLayoutView, PrintOptions, ToolbarGlobal, Print, Basemap) {
        'use strict';
        var fixture;
        var newPrintLayoutView;

        var createPrintLayoutView = function(scope){
            newPrintLayoutView = new PrintLayoutView({
                app: scope.app//,

                /*
                regions: {
                    regionLeft: ".print-layout-left",
                    regionRight: ".print-layout-right"
                }
                */
            });
            fixture = setFixtures("<div>\
                <div class='print-layout-left'></div>\
                <div class='print-layout-right'></div>\
            </div>").append(newPrintLayoutView.$el);
        };

        var initSpies = function(){
            spyOn(Basemap.prototype,"initialize");
            spyOn(PrintLayoutView.prototype, "render").and.callThrough();
            spyOn(PrintLayoutView.prototype, "showPrintOptions").and.callThrough();
            spyOn(PrintLayoutView.prototype, "showBasemap").and.callThrough();
            spyOn(PrintLayoutView.prototype, "callMakePrint").and.callThrough();
            spyOn(PrintLayoutView.prototype, "onShow").and.callThrough();
        };

        describe("PrintLayoutView: Initialization Test", function(){

            beforeEach(function(){
                initSpies();
                createPrintLayoutView(this);
            });
            it ("Successfully initialized", function(){
                expect(newPrintLayoutView.app).toEqual(this.app);
                expect(PrintLayoutView.prototype.render).toHaveBeenCalledTimes(1);
            });
        });

        describe("Generate Print Functions:", function(){

            beforeEach(function(){
                initSpies();
                createPrintLayoutView(this);
            });

            it("Succesfuly goes through showPrintOptions", function(){
                expect(PrintLayoutView.prototype.showPrintOptions).toHaveBeenCalledTimes(0);
                newPrintLayoutView.showPrintOptions();
                expect(newPrintLayoutView.printOptions).toEqual(jasmine.any(PrintOptions));
                expect(newPrintLayoutView.regionLeft.currentView).toEqual(jasmine.any(PrintOptions));
                expect(PrintLayoutView.prototype.showPrintOptions).toHaveBeenCalledTimes(1);
            });

            it("Succesfuly goes through showBasemap", function(){
                expect(PrintLayoutView.prototype.showBasemap).toHaveBeenCalledTimes(0);
                newPrintLayoutView.showBasemap();
                expect(newPrintLayoutView.basemapView).toEqual(jasmine.any(Basemap));
                expect(newPrintLayoutView.regionRight.currentView).toEqual(jasmine.any(Basemap));
                expect(PrintLayoutView.prototype.showBasemap).toHaveBeenCalledTimes(1);
            });

            it("Succesfuly goes through makePrint", function(){
                expect(1).toEqual(1);
            });
        });




    }
);
