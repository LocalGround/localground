var rootDir = "../../";
define([
    "marionette",
    "jquery",
    rootDir + "apps/style/views/left/left-panel",
    rootDir + "apps/style/views/left/select-map-view",
    rootDir + "apps/style/views/left/layer-list-view",
    rootDir + "apps/style/views/left/skin-view",
    rootDir + "apps/style/views/left/panel-styles-view"
],
    function (Marionette, $, LeftPanelView, SelectMapView, LayerListView, SkinView, PanelStylesView) {
        'use strict';
        var leftPanel, fixture;

        function initView(scope) {
            // 1) add spies for all relevant objects:
            spyOn(Marionette.Region.prototype, 'show').and.callThrough();

            spyOn(SelectMapView.prototype, 'render').and.callThrough();
            spyOn(LayerListView.prototype, 'render').and.callThrough();
            spyOn(SkinView.prototype, 'render').and.callThrough();
            spyOn(PanelStylesView.prototype, 'render').and.callThrough();

            spyOn(LeftPanelView.prototype, 'initialize').and.callThrough();
            spyOn(LeftPanelView.prototype, 'handleNewMap').and.callThrough();
            spyOn(LeftPanelView.prototype, 'moveLeftPanel').and.callThrough();
            spyOn(LeftPanelView.prototype, 'showRightPanel').and.callThrough();
            spyOn(LeftPanelView.prototype, 'createNewLayer').and.callThrough();


            // 2) initialize rightPanel object:
            leftPanel = new LeftPanelView({
                app: scope.app,
                model: scope.testMap
            });

            // 3) set fixture:
            fixture = setFixtures('<div></div>').append(leftPanel.$el);
        };

        describe("When Left Panel of Style App is initialized", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize", function () {
                expect(leftPanel).toEqual(jasmine.any(LeftPanelView));
                expect(leftPanel.initialize).toHaveBeenCalledTimes(1);
            });

            it("should have correct html", function () {
                //has correct layout template
                expect(fixture).toContainElement('.left-wrapper');    
            });

            it("should initialize and render child views and regions", function () {
                expect(Marionette.Region.prototype.show).toHaveBeenCalledWith(jasmine.any(SelectMapView));
                expect(Marionette.Region.prototype.show).toHaveBeenCalledWith(jasmine.any(LayerListView));
                expect(Marionette.Region.prototype.show).toHaveBeenCalledWith(jasmine.any(SkinView));
                expect(Marionette.Region.prototype.show).toHaveBeenCalledWith(jasmine.any(PanelStylesView));

                expect(SelectMapView.prototype.render).toHaveBeenCalledTimes(1);
                expect(LayerListView.prototype.render).toHaveBeenCalledTimes(1);
                expect(SkinView.prototype.render).toHaveBeenCalledTimes(1);
                expect(PanelStylesView.prototype.render).toHaveBeenCalledTimes(1);
            });
        });

        describe("Events should trigger correctly", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should call handleNewMap()", function () {
                expect(leftPanel.handleNewMap).toHaveBeenCalledTimes(0);
                leftPanel.app.vent.trigger('change-map', this.testMap);
                expect(leftPanel.handleNewMap).toHaveBeenCalledTimes(1);

                expect(leftPanel.showRightPanel).toHaveBeenCalledTimes(0);
                leftPanel.app.vent.trigger('edit-layer', this.layer);
                expect(leftPanel.showRightPanel).toHaveBeenCalledTimes(1);

                //has correct model
                expect(leftPanel.model).toEqual(this.testMap);

                //has correct child (region) templates
                expect(fixture).toContainElement('#map-select');
                expect(fixture).toContainElement('.bordered-section');
            });

            it("should trigger click events", function () {
                expect(leftPanel.moveLeftPanel).toHaveBeenCalledTimes(0);
                fixture.find('.hide-button').trigger("click");
                expect(leftPanel.moveLeftPanel).toHaveBeenCalledTimes(1);

                expect(leftPanel.showRightPanel).toHaveBeenCalledTimes(0);
                fixture.find('.edit').trigger("click");
                expect(leftPanel.showRightPanel).toHaveBeenCalledTimes(1);

                //these two aren't working
                expect(leftPanel.createNewLayer).toHaveBeenCalledTimes(0);
                fixture.find('#new-layer-options a').trigger("click");
                expect(leftPanel.createNewLayer).toHaveBeenCalledTimes(1);

                
            });
            
        });

        
    });
