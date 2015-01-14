define(["views/maps/overlays/symbol", "../../../test/spec-helper"],
    function (Symbol) {
        'use strict';
        describe("Layer Model: Tests model attribute validation", function () {
            it("Initializes with isVisible flag = \"false\"", function () {
                var layer = this.layers.at(0);
                expect(layer.get("isVisible")).toBeFalsy();
            });
            it("Has a symbols attribute that is not null and", function () {
                var layer = this.layers.at(0);
                expect(layer.get("isVisible")).toBeFalsy();
            });

            it("Validates any updat to \"symbols\" to ensure that it is an array", function () {
                var that = this,
                    validate = function (val, expectError) {
                        var layer = that.layers.at(0),
                            errorCallback = jasmine.createSpy("-invalid event callback-"),
                            lastCall = null,
                            errorMessage = 'Layer.symbols must be a JSON array with at least one entry';
                        layer.on("invalid", errorCallback);
                        layer.set({symbols: val}, {validate: true}); //explicit call for validation

                        //check validation error messages:
                        lastCall = errorCallback.calls.mostRecent();
                        if (expectError) {
                            expect(lastCall).toBeDefined();
                            expect(lastCall.args).toBeDefined();
                            expect(lastCall.args[0]).toBe(layer);
                            expect(lastCall.args[1]).toBe(errorMessage);
                        } else {
                            expect(lastCall).not.toBeDefined();
                        }
                    };
                //invalid entries:
                validate({}, true);
                validate('abcde', true);
                validate([], true);
                validate(null, true);

                //valid entries:
                validate([{ color: "#F00", width: 20, rule: "tags contains frog", title: "Frogs" }], false);
            });
        });

        describe("Layer Model: Test symbol parsing", function () {
            it("Parses symbol array correctly", function () {
                var layer = this.layers.at(0),
                    symbol = new Symbol({ color: "#7075FF", width: 30, rule: "worms > 0", title: "At least 1 worm" });
                expect(_.isObject(layer.getSymbolMap())).toBeTruthy();
                expect(layer.getSymbols().length).toBe(2);
                expect(layer.getSymbol("worms > 0").rule).toBe(symbol.rule);
            });

            it("Can distinguish between basic and complex layer", function () {
                var layer1 = this.layers.at(0),     // more than one symbol
                    layer2 = this.layers.at(2);     // only one symbol
                expect(layer1.basic).toBeFalsy();
                expect(layer2.basic).toBeTruthy();
            });
        });
    });
