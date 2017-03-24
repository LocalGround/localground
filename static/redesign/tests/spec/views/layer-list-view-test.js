var rootDir = "../../";
define([
    "marionette",
    "jquery",
    rootDir + "apps/style/views/left/left-panel",
    rootDir + "apps/style/views/left/layer-list-view"
],
    function (Marionette, $, LeftPanelView, LayerListView) {
        'use strict';
        var layerListView, fixture;

        function initView(scope) {
            console.log("layer list test working");
            // 1) add spies for all relevant objects:
          

            spyOn(LayerListView.prototype, 'initialize').and.callThrough();
           // spyOn(LayerListView.prototype, 'sendCollection').and.callThrough();
            fixture = setFixtures('<div></div>');

             // 2) initialize rightPanel object:
            layerListView = new LayerListView({
                app: scope.app,
                collection: scope.layers
            });
            layerListView.render();
            
            // 3) set fixture:
            fixture.append(layerListView.$el);
            console.log(fixture);
        };

        describe("When LayerListView is initialized", function () {
            beforeEach(function () {
                initView(this);
            });

            afterEach(function () {
                Backbone.history.stop();
            });

            it("should initialize", function () {
                expect(layerListView).toEqual(jasmine.any(LayerListView));
                expect(layerListView.initialize).toHaveBeenCalledTimes(1);
            });

            it("should have correct html", function () {
                expect(fixture).toContainElement('#layers');    
            });

            it(": collection should be correct", function () {
                expect(layerListView.collection).toEqual(this.layers);
            });
            
        });
        describe("Events tests", function () {
            beforeEach(function () {
                initView(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });
            it(": events should trigger correct functions", function () {
                expect(layerListView.sendCollection).toHaveBeenCalledTimes(0);
                fixture.find('.edit').trigger("click");
                expect(layerListView.sendCollection).toHaveBeenCalledTimes(1);
            });

        });

});