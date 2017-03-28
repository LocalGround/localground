var rootDir = "../../";
define([
    "marionette",
    "jquery",
    rootDir + "apps/style/views/left/left-panel",
    rootDir + "apps/style/views/left/layer-list-child-view"
],
    function (Marionette, $, LeftPanelView, LayerListChildView) {
        'use strict';
        var layerListChildView, fixture;

        function initView(scope) {
            console.log("layer list test working");
            // 1) add spies for all relevant objects:
            spyOn(LayerListChildView.prototype, 'initialize').and.callThrough();
            spyOn(LayerListChildView.prototype, 'sendCollection').and.callThrough();
            fixture = setFixtures('<div id="layers"></div>');

             // 2) initialize rightPanel object:
             layerListChildView = new LayerListChildView({
                app: scope.app,
                model: scope.layer
            });
            layerListChildView.render();
            
            // 3) append fixture:
            fixture.append(layerListChildView.$el);
        };

        describe("When LayerListView is initialized", function () {
            beforeEach(function () {
                initView(this);
            });

            afterEach(function () {
                Backbone.history.stop();
            });

            it("should initialize", function () {
                expect(layerListChildView).toEqual(jasmine.any(LayerListChildView));
                expect(layerListChildView.initialize).toHaveBeenCalledTimes(1);
            });

            it("should have correct html", function () {
                expect(fixture).toContainElement('#layers');
                expect(fixture).toContainElement('.column'); 
                expect(fixture).toContainElement('.edit');   
            });

            it(": collection should be correct", function () {
                expect(layerListChildView.model).toEqual(this.layer);
            });
        });

        describe("When events are triggered", function () {
            beforeEach(function () {
                initView(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });
            it("functions should run", function() {
                expect(layerListChildView.sendCollection).toHaveBeenCalledTimes(0);
                fixture.find('.edit').trigger("click");
                expect(layerListChildView.sendCollection).toHaveBeenCalledTimes(1);
            });
        });
});