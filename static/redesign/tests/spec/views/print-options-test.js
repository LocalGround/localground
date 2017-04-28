var rootDir = "../../";
define([
    "handlebars",
    rootDir + "views/print-options",
    rootDir + "models/print",
    rootDir + "lib/maps/basemap",
    "tests/spec-helper"
],
    function (Handlebars, PrintOptions, Print, BaseMap) {
        'use strict';
        var fixture;
        var newPrintOptions;
        var newBaseMap;

        var initSpies = function(){
            // Print options creation
            spyOn(PrintOptions.prototype, "initialize").and.callThrough();
            spyOn(PrintOptions.prototype, "render").and.callThrough();

            spyOn(PrintOptions.prototype, "detectLayout").and.callThrough();
            spyOn(PrintOptions.prototype, "makePrint").and.callThrough();

        };

        var initPrintOptions = function(scope){
            newBaseMap = new BaseMap({
                app: scope.app,
                showSearchControl: false, // added for rosa parks pilot
                minZoom: 13, // added for rosa parks pilot
                mapID: "print_map"
            });

            scope.app.basemapView = newBaseMap;

            newPrintOptions = new PrintOptions({
                app: scope.app
            });
        }

        describe("Print Options Initialization Test", function(){
            beforeEach(function(){
                initSpies();
                initPrintOptions(this);
            });
            it ("Initialization Passes", function(){
                expect(newPrintOptions).toEqual(jasmine.any(PrintOptions));
            });


            it ("Successfully passes all initalization steps", function(){
                expect(newPrintOptions.app).toEqual(this.app);
                expect(newPrintOptions.model).toEqual(jasmine.any(Print));
                expect(PrintOptions.prototype.render).toHaveBeenCalledTimes(1);
                //expect(newPrintOptions.basemapView).toEqual(this.basemapView);
                expect(PrintOptions.prototype.initialize).toHaveBeenCalledTimes(1);
            });
        });

        describe("User Print Option Parameters", function(){

            beforeEach(function(){
                initSpies();
                initPrintOptions(this);
                fixture = setFixtures("<div></div>").append(newPrintOptions.$el);
                // spyOn(this.app.vent, 'trigger');
            });

            it("Contains all the necessary HTML attributes", function(){
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

            it ("Fill in the text contents and save the print", function(){
                expect(1).toEqual(1);
                fixture.find("#print-title").val("Hello World");
                fixture.find("#print-instructions").val("All you need to do is print the map");
                newPrintOptions.makePrint();
                expect(newPrintOptions.model.get("map_title")).toBe("Hello World");
                expect(newPrintOptions.model.get("instructions")).toBe("All you need to do is print the map");
                expect(newPrintOptions.model.get("project_id")).toBe(this.app.getProjectID());
                expect(newPrintOptions.model.get("layout")).toBe(1);
                expect(newPrintOptions.model.get("center")).toBe(this.basemapView.getCenter());
                expect(newPrintOptions.model.get("zoom")).toBe(this.basemapView.getZoom());
                expect(newPrintOptions.model.get("map_provider")).toBe(this.basemapView.getMapTypeId());

            });

            // For the following parameters below,
            // Change the radio buttons to make the other value checked

            describe("Layout Settings", function(){
                //
                it("Defualt value - Portrait", function(){
                    expect(fixture.find("#portrait").prop("checked")).toBeTruthy();
                    fixture.find("#landscape").trigger('click');
                    expect(fixture.find("#portrait").prop("checked")).toBeFalsy();
                });

                it("Alternate value - Landscape", function(){
                    expect(fixture.find("#landscape").prop("checked")).toBeFalsy();
                    fixture.find("#landscape").trigger('click');
                    expect(fixture.find("#landscape").prop("checked")).toBeTruthy();
                });
            });

            describe("Collect Data Settings", function(){
                //
                it("Defualt value - Yes", function(){
                    expect(fixture.find("#choose_yes").prop("checked")).toBeTruthy();
                    fixture.find("#choose_no").trigger('click');
                    expect(fixture.find("#choose_yes").prop("checked")).toBeFalsy();
                });

                it("Alternate value - No", function(){
                    expect(fixture.find("#choose_no").prop("checked")).toBeFalsy();
                    fixture.find("#choose_no").trigger('click');
                    expect(fixture.find("#choose_no").prop("checked")).toBeTruthy();
                });
            });
        });




    }
);
