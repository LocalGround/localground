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

        var initSpies = function(scope){
            // Print options creation
            spyOn(PrintOptions.prototype, "initialize").and.callThrough();
            spyOn(PrintOptions.prototype, "render").and.callThrough();

            spyOn(PrintOptions.prototype, "detectLayout").and.callThrough();
            spyOn(PrintOptions.prototype, "makePrint").and.callThrough();


            spyOn(BaseMap.prototype, "getMapTypeId").and.returnValue(scope.map.getMapTypeId());

        };

        var initPrintOptions = function(scope){
            newBaseMap = new BaseMap({
                app: scope.app,
                showSearchControl: false, // added for rosa parks pilot
                minZoom: 13, // added for rosa parks pilot
                mapID: "print_map",
                map: scope.map
            });

            scope.app.basemapView = newBaseMap;

            newPrintOptions = new PrintOptions({
                app: scope.app
            });
        }

        describe("Print Options Initialization Test", function(){
            beforeEach(function(){
                initSpies(this);
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
                initSpies(this);
                initPrintOptions(this);
                fixture = setFixtures("<div></div>").append(newPrintOptions.$el);
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
                console.log(newPrintOptions.model);
                expect(newPrintOptions.model.get("map_title")).toBe("Hello World");
                expect(newPrintOptions.model.get("instructions")).toBe("All you need to do is print the map");
                expect(newPrintOptions.model.get("project_id")).toBe(this.app.getProjectID());
                expect(newPrintOptions.model.get("layout")).toBe(1);
                expect(newPrintOptions.model.get("center").lat()).toBe(newPrintOptions.basemapView.getCenter().lat());
                expect(newPrintOptions.model.get("center").lng()).toBe(newPrintOptions.basemapView.getCenter().lng());
                expect(newPrintOptions.model.get("zoom")).toBe(newPrintOptions.basemapView.getZoom());
                expect(newPrintOptions.model.get("map_provider")).toBe(newPrintOptions.basemapView.getMapTypeId());

            });

            describe("Layout and Data Settings", function(){
                //
                it("Defualt value - Portrait + Data Entry (Layout = 1)", function(){

                    fixture.find("#portrait").trigger('click');
                    fixture.find("#choose_yes").trigger('click');
                    expect(fixture.find("#portrait").prop("checked")).toBeTruthy();
                    expect(fixture.find("#choose_yes").prop("checked")).toBeTruthy();
                    newPrintOptions.makePrint();
                    expect(newPrintOptions.model.get("layout")).toBe(1);
                });

                it("Landscape + Data Entry (Layout = 2)", function(){

                    fixture.find("#landscape").trigger('click');
                    fixture.find("#choose_yes").trigger('click');
                    expect(fixture.find("#landscape").prop("checked")).toBeTruthy();
                    expect(fixture.find("#choose_yes").prop("checked")).toBeTruthy();
                    newPrintOptions.makePrint();
                    expect(newPrintOptions.model.get("layout")).toBe(2);
                });


                it("Portrait + No Data (Layout = 3)", function(){

                    fixture.find("#portrait").trigger('click');
                    fixture.find("#choose_no").trigger('click');
                    expect(fixture.find("#portrait").prop("checked")).toBeTruthy();
                    expect(fixture.find("#choose_no").prop("checked")).toBeTruthy();
                    newPrintOptions.makePrint();
                    expect(newPrintOptions.model.get("layout")).toBe(3);
                });

                it("Landscape + No Data (Layout = 4)", function(){

                    fixture.find("#landscape").trigger('click');
                    fixture.find("#choose_no").trigger('click');
                    expect(fixture.find("#landscape").prop("checked")).toBeTruthy();
                    expect(fixture.find("#choose_no").prop("checked")).toBeTruthy();
                    newPrintOptions.makePrint();
                    expect(newPrintOptions.model.get("layout")).toBe(4);
                });
            });

            describe("Links for Thumbnail and PDF", function(){
                beforeEach(function(){
                    //initSpies(this);
                    //initPrintOptions(this);
                    newPrintOptions.pdf = "http://localhost:7777/profile/prints/L3VzZXJkYXRhL3ByaW50cy81dDRocjRybi9QcmludF81dDRocjRybi5wZGYjMTQ5MzQxNDM2Mw==/";
                    newPrintOptions.thumb = "http://localhost:7777/profile/prints/L3VzZXJkYXRhL3ByaW50cy81dDRocjRybi90aHVtYm5haWwuanBnIzE0OTM0MTQzNjM=/";
                    newPrintOptions.render();

                    fixture = setFixtures("<div></div>").append(newPrintOptions.$el);
                });

                it("Finds the existing PDF", function(){
                    expect(fixture.find(".link-pdf").attr("href")).toEqual(newPrintOptions.pdf);
                });


                it("Finds the existing Thumbnail", function(){
                    expect(fixture.find(".link-thumb").attr("src")).toEqual(newPrintOptions.thumb);
                });

            });

        });




    }
);
