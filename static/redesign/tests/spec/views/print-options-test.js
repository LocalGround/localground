var rootDir = "../../";
define([
    "handlebars",
    rootDir + "views/print-options",
    rootDir + "models/print",
    "tests/spec-helper"
],
    function (Handlebars, PrintOptions, Print) {
        'use strict';
        var fixture;
        var newPrintOptions;

        var initSpies = function(){
            // Print options creation
            spyOn(PrintOptions.prototype, "initialize").and.callThrough();
            spyOn(PrintOptions.prototype, "render").and.callThrough();

            spyOn(PrintOptions.prototype, "detectLayout").and.callThrough();
            spyOn(PrintOptions.prototype, "makePrint").and.callThrough();

        };

        var initPrintOptions = function(scope){
            newPrintOptions = new PrintOptions({
                app: scope.app
            });
        }

        describe("Print Options Initialization Test", function(){
            beforeEach(function(){
                initPrintOptions(this);
                initSpies();
            });
            it ("Initialization Passes", function(){
                expect(newPrintOptions).toEqual(jasmine.any(PrintOptions));
            });


            it ("Successfully passes all initalization steps", function(){
                expect(newPrintOptions.app).toEqual(this.app);
                expect(newPrintOptions.model).toEqual(jasmine.any(Print));
                expect(PrintOptions.prototype.render).toHaveBeenCalledTimes(1);
                //expect(newPrintOptions.basemapView).toEqual(this.basemapView);
                expect(PrintOptions.prototype.initalize).toHaveBeenCalledTimes(1);
            });
        });

        describe("User Print Option Parameters", function(){

            beforeEach(function(){
                initPrintOptions();
                initSpies();
                fixture = setFixtures("<div></div>").append(newPrintOptions.$el);
            });

            it("Contains all the necessary attributes", function(){
                //
                expect(fixture).toContainElement(".loading");
                expect(fixture).toContainElement("#print-title");
                expect(fixture).toContainElement("#print-instructions");
                expect(fixture).toContainElement(".option-layout");
                expect(fixture).toContainElement(".option-data");
                expect(fixture).toContainElement(".print-links");
                expect(fixture).toContainElement(".link-pdf");
                expect(fixture).toContainElement(".link-thumb");
            });

            it ("Detects and saves the filled Title", function(){
                expect(1).toEqual(1);
            });

            it ("Saves the instructions if filled", function(){
                expect(1).toEqual(1);
            });

            // For the following parameters below,
            // Change the radio buttons to make the other value checked

            describe("Layout Settings", function(){
                //
                it("Defualt value - Portrait", function(){
                    expect(1).toEqual(1);
                });

                it("Alternate value - Landscape", function(){
                    expect(1).toEqual(1);
                });
            });

            describe("Collect Data Settings", function(){
                //
                it("Defualt value - Yes", function(){
                    expect(1).toEqual(1);
                });

                it("Alternate value - No", function(){
                    expect(1).toEqual(1);
                });
            });
        });




    }
);
