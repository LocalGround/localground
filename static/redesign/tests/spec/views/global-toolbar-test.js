var rootDir = "../../";
define([
    "jquery",
    rootDir + "views/toolbar-global",
    "tests/spec-helper"
],
    function ($, ToolbarGlobal) {
        'use strict';
        var toolbar;
        var fixture;

        function initApp(scope) {
            // 1) add dummy HTML elements:
            var $sandbox = $('<div id="sandbox"></div>'),
                $r1 = $('<div id="toolbar-main"></div>');

            $(document.body).append($sandbox);
            $sandbox.append($r1);
            fixture = $sandbox;

            // 2) add spies for all relevant objects:
            spyOn(ToolbarGlobal.prototype, 'initialize').and.callThrough();
            spyOn(ToolbarGlobal.prototype, 'setModel').and.callThrough();

            // 3) initialize toolbar:
            toolbar = new ToolbarGlobal({
                app: scope.app
            });
        }

        describe("ToolbarGlobal: Application-Level Tests", function () {
            beforeEach(function () {
                //called before each "it" test
                initApp(this);
            });

            afterEach(function () {
                //called after each "it" test
                $("#sandbox").remove();
            });

            it("Initialization methods called successfully", function () {
                expect(toolbar).toEqual(jasmine.any(ToolbarGlobal));
                expect(toolbar.initialize).toHaveBeenCalled();
            });

            describe("Toolbar Global: Map Mode Trigger Print Button", function(){

                it("Toolbar not in map mode, no print button", function(){
                    toolbar.app.screenType = "gallery";
                    toolbar.render();
                    expect(fixture).not.toContainElement(".print-button");
                });

                it("Toolbar in map mode, print button appears", function(){
                    toolbar.app.screenType = "map";
                    toolbar.render();
                    expect(fixture).toContainElement(".print-button");
                });
            });
        });
    });
