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
            spyOn(LayerListView.prototype, 'showDropDown').and.callThrough();
            spyOn(LayerListView.prototype, 'createNewLayer').and.callThrough();
            fixture = setFixtures('<div></div>');

             // 2) initialize rightPanel object:
             scope.app.selectedMapModel = scope.testMap;
             layerListView = new LayerListView({
                app: scope.app,
                collection: scope.layers
            });
            layerListView.render();
            
            // 3) set fixture:
            fixture.append(layerListView.$el);
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
                expect(layerListView.showDropDown).toHaveBeenCalledTimes(0);
                fixture.find('.add-layer').trigger("click");
                expect(layerListView.showDropDown).toHaveBeenCalledTimes(1);
            }); 

            it(": events should trigger correct functions", function () {
                expect(layerListView.createNewLayer).toHaveBeenCalledTimes(0);
                $(fixture.find('#new-layer-options a').get(0)).trigger("click");
                expect(layerListView.createNewLayer).toHaveBeenCalledTimes(1);
            }); 

        });

});