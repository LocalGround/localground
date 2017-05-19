var rootDir = "../../";
define([
    rootDir + "views/generate-print",
    rootDir + "views/print-options",
    rootDir + "views/toolbar-global",
    rootDir + "models/print",
    rootDir + "lib/maps/basemap",
    rootDir + "lib/maps/controls/tileController",
    "tests/spec-helper"
],
    function (PrintLayoutView, PrintOptions, ToolbarGlobal, Print, Basemap, TileController) {
        'use strict';

        var newPrintLayoutView,
            fixture,
            createPrintLayoutView = function (scope) {
                newPrintLayoutView = new PrintLayoutView({
                    app: scope.app
                });
                fixture = setFixtures("<div>\
                        <div class='print-layout-left'></div>\
                        <div class='print-layout-right'><div id='map'></div></div>\
                    </div>").append(newPrintLayoutView.$el);
            },
            initSpies = function () {
                spyOn(TileController.prototype, "initialize");
                spyOn(PrintLayoutView.prototype, "render").and.callThrough();
                spyOn(PrintLayoutView.prototype, "showPrintOptions").and.callThrough();
                spyOn(PrintLayoutView.prototype, "showBasemap").and.callThrough();
                spyOn(PrintLayoutView.prototype, "callMakePrint").and.callThrough();
                spyOn(PrintLayoutView.prototype, "onShow").and.callThrough();
                spyOn(PrintLayoutView.prototype, "displayConfirmation").and.callThrough();
                spyOn(PrintOptions.prototype, "makePrint");
            };

        describe("PrintLayoutView: Initialization Test", function () {

            beforeEach(function () {
                initSpies();
                createPrintLayoutView(this);
            });

            it("Successfully initialized", function () {
                expect(newPrintLayoutView.app).toEqual(this.app);
                expect(PrintLayoutView.prototype.render).toHaveBeenCalledTimes(1);
            });
        });

        describe("Generate Print Functions:", function () {

            beforeEach(function () {
                initSpies();
                createPrintLayoutView(this);
            });

            it("Succesfuly goes through showPrintOptions", function () {
                expect(PrintLayoutView.prototype.showPrintOptions).toHaveBeenCalledTimes(0);
                newPrintLayoutView.showPrintOptions();
                expect(newPrintLayoutView.printOptions).toEqual(jasmine.any(PrintOptions));
                expect(newPrintLayoutView.regionLeft.currentView).toEqual(jasmine.any(PrintOptions));
                expect(PrintLayoutView.prototype.showPrintOptions).toHaveBeenCalledTimes(1);
            });

            it("Succesfuly goes through showBasemap", function (done) {
                expect(PrintLayoutView.prototype.showBasemap).toHaveBeenCalledTimes(0);
                newPrintLayoutView.showBasemap();
                setTimeout(function () {
                    expect(newPrintLayoutView.basemapView).toEqual(jasmine.any(Basemap));
                    expect(newPrintLayoutView.regionRight.currentView).toEqual(jasmine.any(Basemap));
                    expect(PrintLayoutView.prototype.showBasemap).toHaveBeenCalledTimes(1);
                    done();
                }, 200);
            });

            it("Succesfuly goes through makePrint", function () {
                expect(PrintOptions.prototype.makePrint).toHaveBeenCalledTimes(0);
                newPrintLayoutView.showPrintOptions();
                newPrintLayoutView.callMakePrint();
                expect(PrintOptions.prototype.makePrint).toHaveBeenCalledTimes(1);
            });

            it("Finds the existing PDF", function () {
                expect(PrintLayoutView.prototype.displayConfirmation).toHaveBeenCalledTimes(0);
                var response = { pdf: "pdf_link", thumb: "thumb_ref" };
                this.app.vent.trigger("show-print-generated-message", response);
                expect(PrintLayoutView.prototype.displayConfirmation).toHaveBeenCalledTimes(1);
                expect(fixture.find(".link-pdf").attr("href")).toEqual(response.pdf);
                expect(fixture.find(".link-pdf").attr("href")).toEqual("pdf_link");
                expect(fixture.find(".thumb").attr("src")).toEqual(response.thumb);
                expect(fixture.find(".thumb").attr("src")).toEqual("thumb_ref");
            });
        });
    });
