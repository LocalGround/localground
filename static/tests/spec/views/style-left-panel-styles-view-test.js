var rootDir = "../../";
define([
    "marionette",
    "jquery",
    rootDir + "apps/style/views/left/left-panel",
    rootDir + "apps/style/views/left/panel-styles-view",
    rootDir + "tests/spec/views/style-app-show-hide-panel"
],
    function (Marionette, $, LeftPanelView, PanelStylesView, Helper) {
        'use strict';
        var panelStyleView, fixture;

        function initView(scope) {
            //console.log("layer list test working");
            // 1) add spies for all relevant objects:
            spyOn(PanelStylesView.prototype, 'initialize').and.callThrough();
            spyOn(PanelStylesView.prototype, 'updateType').and.callThrough();
            spyOn(PanelStylesView.prototype, 'updateFont').and.callThrough();
            spyOn(PanelStylesView.prototype, 'updateFontWeight').and.callThrough();
            spyOn(PanelStylesView.prototype, 'updateFontSize').and.callThrough();
            fixture = setFixtures('<div></div>');

             // 2) initialize rightPanel object:
             scope.app.selectedMapModel = scope.testMap;
             panelStyleView = new PanelStylesView({
                app: scope.app,
               // collection: scope.layers//,
                model: scope.testMap
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

            it(": model should be correct", function () {
                expect(panelStyleView.model).toEqual(this.testMap);
            });
        });

        describe("PanelStylesView - events", function () {
            beforeEach(function () {
                initView(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });
            it(": updateType event", function () {
                expect(panelStyleView.updateType).toHaveBeenCalledTimes(0);
                $(fixture.find("#text-type").val('subtitle')).change();
                expect(panelStyleView.updateType).toHaveBeenCalledTimes(1);
            });

            /*it(": updateFont event", function () {
                expect(panelStyleView.updateFont).toHaveBeenCalledTimes(0);
                $(fixture.find("#font").val('bebas')).change();
                console.log($(fixture.find("#font").val()));
                expect(panelStyleView.updateFont).toHaveBeenCalledTimes(1);
            });*/

            it(": updateFontWeight event", function () {
                expect(panelStyleView.updateFontWeight).toHaveBeenCalledTimes(0);
                $(fixture.find("#fw").val("bold")).change();
                expect(panelStyleView.updateFontWeight).toHaveBeenCalledTimes(1);
            });

        });

        describe("Panel Show / Hide Tests", function () {
            Helper.genericChecks({ ClassType: PanelStylesView });
        });
});
