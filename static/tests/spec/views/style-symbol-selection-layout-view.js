var rootDir = "../../";
define([
    'jquery',
    rootDir + "apps/style/views/symbols/symbol-selection-layout-view",
    rootDir + "apps/style/views/symbols/custom-symbols-view",
    rootDir + "apps/style/views/symbols/native-symbols-view"
],
    function ($, SymbolLayoutView, CustomSymbols, NativeSymbols) {
        'use strict';
        var symbolLayout,
            fixture,
            initSpies = function (that) {
                spyOn(that.app.vent, 'trigger').and.callThrough();
                spyOn(SymbolLayoutView.prototype, 'initialize').and.callThrough();
                spyOn(SymbolLayoutView.prototype, 'render').and.callThrough();
            },

            initView = function (that) {
                symbolLayout = new SymbolLayoutView({
                    app: that.app
                });
                symbolLayout.render();
                fixture = setFixtures('<div></div>');
                fixture.append(symbolLayout.$el);
            };
        

        describe("When Symbol Selection Layout is initialized", function () {
            beforeEach(function () {
                initSpies(this);
                initView(this);
            });

            it("should initialize", function () {
                expect(symbolLayout).toEqual(jasmine.any(SymbolLayoutView));
                expect(symbolLayout.initialize).toHaveBeenCalledTimes(1);
            });

            it("should have correct html", function () {
                //has correct layout template
                expect(fixture).toContainElement('#native-tab');
                expect(fixture).toContainElement('#custom-tab');
            });

            it("should instantiate the child views", function() {
              //  symbolLayout.onRender();
                expect(symbolLayout.csv).toEqual(jasmine.any(CustomSymbols));
                expect(symbolLayout.nsv).toEqual(jasmine.any(NativeSymbols));
            });
        });
        
        describe("Interaction test:", function () {
            beforeEach(function () {
                initSpies(this);
                initView(this);
            });

            it("should show the native symbols view when clicked", function () {
                fixture.find('#custom-tab').click();
                fixture.find('#native-tab').click();
                expect(fixture.find('#native-symbols-region').css('display')).toEqual('block');
                expect(fixture.find('#custom-symbols-region').css('display')).toEqual('none');
            });

            it("should show the custom symbols view when clicked", function () {
                fixture.find('#native-tab').click();
                fixture.find('#custom-tab').click();
                expect(fixture.find('#custom-symbols-region').css('display')).toEqual('block');
                expect(fixture.find('#native-symbols-region').css('display')).toEqual('none');
             });
        });
    });
