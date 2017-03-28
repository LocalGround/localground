var rootDir = "../../";
define([
    "marionette",
    "jquery",
    rootDir + "apps/style/views/left/left-panel",
    rootDir + "apps/style/views/left/panel-styles-view"
],
    function (Marionette, $, LeftPanelView, PanelStylesView) {
        'use strict';
        var panelStyleView, fixture;

        function initView(scope) {
            console.log("layer list test working");
            // 1) add spies for all relevant objects:
            spyOn(PanelStylesView.prototype, 'initialize').and.callThrough();
            spyOn(PanelStylesView.prototype, 'updateType').and.callThrough();
            spyOn(PanelStylesView.prototype, 'updateFont').and.callThrough();
            fixture = setFixtures('<div></div>');

             // 2) initialize rightPanel object:
             scope.app.selectedMapModel = scope.testMap;
             panelStyleView = new PanelStylesView({
                app: scope.app,
                collection: scope.layers
            });
            panelStyleView.render();
            
            // 3) set fixture:
            fixture.append(panelStyleView.$el);
        };

        describe("When PanelStylesView is initialized", function () {
            beforeEach(function () {
                initView(this);
            });

            afterEach(function () {
                Backbone.history.stop();
            });

            it("should initialize", function () {
                expect(panelStyleView).toEqual(jasmine.any(PanelStylesView));
                expect(panelStyleView.initialize).toHaveBeenCalledTimes(1);
            });

            it("should have correct html", function () {
                expect(fixture).toContainElement('.bordered-section');    
            });

            it(": collection should be correct", function () {
                expect(panelStyleView.collection).toEqual(this.layers);
            });
            
        });
});