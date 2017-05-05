var rootDir = "../../";
define([
    rootDir + "views/toolbar-global",
    rootDir + "views/generate-print",
    rootDir + "lib/modals/modal",
    "tests/spec-helper"
],
    function (ToolbarGlobal, PrintLayoutView, Modal) {
        'use strict';
        var toolbar,
            fixture,
            initApp;
        initApp = function (scope) {
            spyOn(ToolbarGlobal.prototype, 'initialize').and.callThrough();
            spyOn(ToolbarGlobal.prototype, 'setModel').and.callThrough();
            spyOn(ToolbarGlobal.prototype, 'showModal').and.callThrough();
            spyOn(PrintLayoutView.prototype, 'initialize');
            spyOn(PrintLayoutView.prototype, 'onShow');
            spyOn(Modal.prototype, 'show');
            spyOn(Modal.prototype, 'update').and.callThrough();
            toolbar = new ToolbarGlobal({
                app: scope.app
            });
            fixture = setFixtures('<div id="toolbar-main"></div>').append(toolbar.$el);
        };

        describe("ToolbarGlobal: Application-Level Tests", function () {
            beforeEach(function () {
                initApp(this);
            });

            it("Initialization methods called successfully", function () {
                expect(toolbar).toEqual(jasmine.any(ToolbarGlobal));
                expect(toolbar.initialize).toHaveBeenCalled();
            });

            describe("Toolbar Global: Map Mode Trigger Print Button", function () {
                it("Toolbar not in map mode, no print button", function () {
                    toolbar.app.screenType = "gallery";
                    toolbar.render();
                    expect(fixture).not.toContainElement(".print-button");

                    toolbar.app.screenType = "spreadsheet";
                    toolbar.render();
                    expect(fixture).not.toContainElement(".print-button");

                    toolbar.app.screenType = "style";
                    toolbar.render();
                    expect(fixture).not.toContainElement(".print-button");
                });

                it("Toolbar in map mode, print button appears", function () {
                    toolbar.app.screenType = "map";
                    toolbar.render();
                    expect(fixture).toContainElement(".print-button");
                });

                it("When print button clicked, open modal function is called", function () {
                    toolbar.app.screenType = "map";
                    toolbar.render();
                    expect(Modal.prototype.show).toHaveBeenCalledTimes(0);
                    expect(PrintLayoutView.prototype.initialize).toHaveBeenCalledTimes(0);
                    expect(PrintLayoutView.prototype.onShow).toHaveBeenCalledTimes(0);
                    expect(ToolbarGlobal.prototype.showModal).toHaveBeenCalledTimes(0);

                    fixture.find(".print-button").trigger('click');

                    expect(Modal.prototype.show).toHaveBeenCalledTimes(1);
                    expect(PrintLayoutView.prototype.initialize).toHaveBeenCalledTimes(1);
                    expect(PrintLayoutView.prototype.onShow).toHaveBeenCalledTimes(1);
                    expect(ToolbarGlobal.prototype.showModal).toHaveBeenCalledTimes(1);
                });
            });
        });
    });
