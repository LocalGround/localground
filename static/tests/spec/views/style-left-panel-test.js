var rootDir = "../../";
define([
    "marionette",
    rootDir + "apps/style/views/left/left-panel",
    rootDir + "apps/style/views/left/select-map-view",
    rootDir + "apps/style/views/left/layer-list-view",
    rootDir + "apps/style/views/left/skin-view",
    rootDir + "apps/style/views/left/panel-styles-view",
    rootDir + "lib/maps/overlays/infobubbles/base"
],
    function (Marionette, LeftPanelView, SelectMapView, LayerListView, SkinView, PanelStylesView, InfoBubble) {
        'use strict';
        var leftPanel, fixture, initView;

        initView = function (scope) {
            // 1) add spies for all relevant objects:
            spyOn(Marionette.Region.prototype, 'show').and.callThrough();
            spyOn(scope.app.vent, 'trigger').and.callThrough();

            spyOn(SelectMapView.prototype, 'render').and.callThrough();
            spyOn(LayerListView.prototype, 'render').and.callThrough();
            spyOn(SkinView.prototype, 'render').and.callThrough();
            spyOn(PanelStylesView.prototype, 'render').and.callThrough();

            spyOn(LeftPanelView.prototype, 'initialize').and.callThrough();
            spyOn(LeftPanelView.prototype, 'handleNewMap').and.callThrough();
            spyOn(LeftPanelView.prototype, 'showPanel').and.callThrough();
            spyOn(LeftPanelView.prototype, 'hidePanel').and.callThrough();
            spyOn(InfoBubble.prototype, 'initialize'); //don't call through



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
                expect(Marionette.Region.prototype.show).toHaveBeenCalledWith(jasmine.any(SkinView));

                expect(SelectMapView.prototype.render).toHaveBeenCalledTimes(1);
                expect(SkinView.prototype.render).toHaveBeenCalledTimes(1);
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

                //has correct model
                expect(leftPanel.model).toEqual(this.testMap);

                //has correct child (region) templates
                expect(fixture).not.toContainElement('#map-select');
                expect(fixture).toContainText('Click the plus sign to create a new map');
                expect(fixture).toContainElement('.bordered-section');
            });

            it("should trigger show / hide click events", function () {
                //hide:
                expect(leftPanel.app.vent.trigger).not.toHaveBeenCalledWith('hide-list');
                expect(leftPanel.hidePanel).toHaveBeenCalledTimes(0);
                fixture.find('.hide').trigger('click');
                expect(leftPanel.hidePanel).toHaveBeenCalledTimes(1);
                expect(leftPanel.app.vent.trigger).toHaveBeenCalledWith('hide-list');

                //show:
                expect(leftPanel.app.vent.trigger).not.toHaveBeenCalledWith('unhide-list');
                expect(leftPanel.showPanel).toHaveBeenCalledTimes(0);
                fixture.find('.show').trigger('click');
                expect(leftPanel.showPanel).toHaveBeenCalledTimes(1);
                expect(leftPanel.app.vent.trigger).toHaveBeenCalledWith('unhide-list');
            });

        });

    });
