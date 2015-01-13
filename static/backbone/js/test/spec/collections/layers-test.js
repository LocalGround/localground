define(["collections/layers"],
    function (Layers) {
        'use strict';
        describe("Layers Collection: Tests that Layers collection can be created, manipulated", function () {
            it("Can add model instances as objects and arrays", function () {
                var layers = new Layers();
                expect(layers.length).toBe(0);

                layers.add({ name: 'my first layer', symbols: [] });
                expect(layers.length).toBe(1);

                layers.add([
                    { name: 'my second layer', symbols: [] },
                    { name: 'my third layer', symbols: [] }
                ]);
                expect(layers.length).toBe(3);
            });

            it("Points to the correct data API URL", function () {
                var layers = new Layers();
                expect(layers.url).toBe('/api/0/layers/');
            });
        });
    });
