define(["models/layer"],
    function (Layer) {
        'use strict';
        describe("Layer Model: Tests model attribute validation", function () {
            it("Initializes with isVisible flag = \"false\"", function () {
                var layer = new Layer();
                expect(layer.get("isVisible")).toBeFalsy();
            });

            it("Layer's \"symbols\" attribute must be an array (if it exists)", function () {
                var validate = function (val, expectError) {
                    var layer = new Layer(),
                        errorCallback = jasmine.createSpy("-invalid event callback-"),
                        lastCall = null;
                    layer.on("invalid", errorCallback);
                    layer.set({symbols: val}, {validate: true}); //explicit call for validation

                    //check validation error messages:
                    lastCall = errorCallback.calls.mostRecent();
                    if (expectError) {
                        expect(lastCall).toBeDefined();
                        expect(lastCall.args).toBeDefined();
                        expect(lastCall.args[0]).toBe(layer);
                        expect(lastCall.args[1]).toBe('Layer.symbols must be a JSON array');
                    } else {
                        expect(lastCall).not.toBeDefined();
                    }
                };
                //invalid entries:
                validate({}, true);
                validate('abcde', true);

                //valid entries:
                validate([], false);
                validate(null, false);
            });
        });
    });
