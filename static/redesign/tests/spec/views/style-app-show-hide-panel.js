var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/style/views/left/panel-styles-view",
    "tests/spec-helper"
],
    function ($, PanelStylesView) {
        'use strict';
        var fixture, panelStylesView, initSpies;

        initSpies = function (scope) {
            spyOn(PanelStylesView.prototype, 'render').and.callThrough();
            spyOn(PanelStylesView.prototype, 'showSection').and.callThrough();
            spyOn(PanelStylesView.prototype, 'hideSection').and.callThrough();
            spyOn(PanelStylesView.prototype, 'templateHelpers').and.callThrough();
            spyOn(PanelStylesView.prototype, 'saveState').and.callThrough();
            spyOn(PanelStylesView.prototype, 'restoreState').and.callThrough();

            panelStylesView = new PanelStylesView({
                app: scope.app,
                model: scope.testMap
            });
        };

        describe("Style App: Show / Hide Panels", function () {
            beforeEach(function () {
                initSpies(this);
            });
            it("Methods defined: showSection, hideSection, templateHelpers, restoreState, saveState", function () {
                expect(panelStylesView.showSection).toBeDefined();
                expect(panelStylesView.hideSection).toBeDefined();
                expect(panelStylesView.templateHelpers).toBeDefined();
                expect(panelStylesView.saveState).toBeDefined();
                expect(panelStylesView.restoreState).toBeDefined();
            });

            it("Restore state called on initialization", function () {
                expect(panelStylesView.restoreState).toHaveBeenCalledTimes(1);
            });

            it("Initializes as closed when it should, and opens when clicked", function () {
                panelStylesView.isShowing = false;
                panelStylesView.render();
                fixture = setFixtures('<div></div>').append(panelStylesView.$el);
                expect(fixture).toContainElement('.show-panel');
                expect(fixture).not.toContainElement('.hide-panel');
                fixture.find('.show-panel').trigger('click');
                expect(panelStylesView.isShowing).toBeTruthy();
                expect(fixture).not.toContainElement('.show-panel');
                expect(fixture).toContainElement('.hide-panel');
            });

        });

    });
