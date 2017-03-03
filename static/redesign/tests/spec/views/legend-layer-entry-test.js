var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/presentation/views/legend-layer-entry",
    rootDir + 'collections/symbols',
    "tests/spec-helper"
],
    function ($, LegendLayerEntry, Symbols) {
        'use strict';
        var lle;

        function initApp(scope) {
            // 1) add dummy HTML elements:
            var $sandbox = $('<div id="sandbox"></div>'),
                $r1 = $('<div id="layer-entry-container"></div>');

            $(document.body).append($sandbox);
            $sandbox.append($r1);
            console.log(scope.app);
            lle = new LegendLayerEntry({
                app: scope.app,
                model: scope.layer
            });
        }

        describe("LegendLayerEntry: Application-Level Tests", function () {
            beforeEach(function () {
                //called before each "it" test
                initApp(this);
            });

            afterEach(function () {
                //called after each "it" test
                $("#sandbox").remove();
            });

            it("Initialization methods called successfully", function () {
                expect(lle).toEqual(jasmine.any(LegendLayerEntry));
            });
            it("Initializes symbols collection successfully", function () {
                expect(lle.collection).toEqual(jasmine.any(Symbols));
                expect(lle.collection.length).toEqual(3);
                lle.render();
                console.log(lle.$el);
            });
        });
    });
