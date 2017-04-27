var rootDir = "../../";
define([
    "tests/spec-helper"
], function () {
    'use strict';
    /*
     * Overriding the initialization function so that this test doesn't
     * have to rely on the Google Maps API
     */
    return {
        initSpies:  function (scope, ClassType) {
            spyOn(ClassType.prototype, 'render').and.callThrough();
            spyOn(ClassType.prototype, 'showSection').and.callThrough();
            spyOn(ClassType.prototype, 'hideSection').and.callThrough();
            spyOn(ClassType.prototype, 'templateHelpers').and.callThrough();
            spyOn(ClassType.prototype, 'saveState').and.callThrough();
            spyOn(ClassType.prototype, 'restoreState').and.callThrough();

            var panelView = new ClassType({
                app: scope.app,
                model: scope.testMap
            });
            return panelView;
        },
        genericChecks: function (opts) {
            var that = this,
                panelView,
                ClassType = opts.ClassType,
                fixture;
            describe("Style App: Show / Hide Panels", function () {
                beforeEach(function () {
                    panelView = that.initSpies(this, ClassType);
                    fixture = setFixtures('<div></div>').append(panelView.$el);
                });
                it("Methods defined: showSection, hideSection, templateHelpers, restoreState, saveState", function () {
                    expect(panelView.showSection).toBeDefined();
                    expect(panelView.hideSection).toBeDefined();
                    expect(panelView.templateHelpers).toBeDefined();
                    expect(panelView.saveState).toBeDefined();
                    expect(panelView.restoreState).toBeDefined();
                });

                it("Restore state called on initialization", function () {
                    expect(panelView.restoreState).toHaveBeenCalledTimes(1);
                });

                it("Initializes as closed when it should, and opens when clicked", function () {
                    panelView.isShowing = false;
                    panelView.render();
                    expect(panelView.saveState).toHaveBeenCalledTimes(0);
                    expect(fixture).toContainElement('.show-panel');
                    expect(fixture).not.toContainElement('.hide-panel');
                    fixture.find('.show-panel').trigger('click');
                    expect(panelView.isShowing).toBeTruthy();
                    expect(panelView.saveState).toHaveBeenCalledTimes(1);
                    expect(fixture).not.toContainElement('.show-panel');
                    expect(fixture).toContainElement('.hide-panel');
                });

                it("Initializes as opened when it should, and closes when clicked", function () {
                    panelView.isShowing = true;
                    panelView.render();
                    expect(panelView.saveState).toHaveBeenCalledTimes(0);
                    expect(fixture).not.toContainElement('.show-panel');
                    expect(fixture).toContainElement('.hide-panel');
                    fixture.find('.hide-panel').trigger('click');
                    expect(panelView.isShowing).toBeFalsy();
                    expect(panelView.saveState).toHaveBeenCalledTimes(1);
                    expect(fixture).toContainElement('.show-panel');
                    expect(fixture).not.toContainElement('.hide-panel');
                });

                it("Persists closed state", function () {
                    panelView.isShowing = false;
                    panelView.saveState();
                    panelView = new ClassType({
                        app: this.app,
                        model: this.testMap
                    });
                    expect(panelView.isShowing).toBeFalsy();
                });

                it("Persists open state", function () {
                    panelView.isShowing = true;
                    panelView.saveState();
                    panelView = new ClassType({
                        app: this.app,
                        model: this.testMap
                    });
                    expect(panelView.isShowing).toBeTruthy();
                });
            });
        }
    };
});
