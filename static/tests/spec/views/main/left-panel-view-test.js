var rootDir = "../../../";
define([
    "jquery",
    "backbone",
    "marionette",
    rootDir + "lib/maps/overlays/base",
    rootDir + "lib/maps/overlays/marker",
    rootDir + "lib/data/dataManager",
    rootDir + "apps/main/views/left/left-panel",
    rootDir + "apps/main/views/left/map-title-view",
    rootDir + "apps/main/views/left/layer-list-view",
    rootDir + "apps/main/router",
    rootDir + "models/layer",
    "tests/spec-helper1"
],
    function ($, Backbone, Marionette, Base, MarkerOverlay, DataManager,
            LeftPanelView, MapTitleView, LayerListView, Router, Layer) {
        'use strict';
        var lpv, fixture;

        const initApp = (scope) => {


            // 1) add spies for all relevant objects:
            spyOn(Marionette.Region.prototype, 'show').and.callThrough();
            spyOn(scope.app.vent, 'trigger').and.callThrough();
            spyOn(LeftPanelView.prototype, 'initialize').and.callThrough();
            spyOn(LeftPanelView.prototype, 'onRender').and.callThrough();
            spyOn(LeftPanelView.prototype, 'deleteMap').and.callThrough();
            spyOn(LeftPanelView.prototype, 'scrollToLayer').and.callThrough();

            spyOn(MapTitleView.prototype, 'render').and.callThrough();
            spyOn(LayerListView.prototype, 'render').and.callThrough();

            spyOn(Layer.prototype, 'destroy').and.callThrough();
            spyOn(DataManager.prototype, 'destroyMap');

            //Interrupt propogation to Google Marker Overlays:
            spyOn(MarkerOverlay.prototype, "initialize");
            spyOn(MarkerOverlay.prototype, "redraw");
            spyOn(MarkerOverlay.prototype, "show");
            spyOn(MarkerOverlay.prototype, "hide");

            spyOn(scope.app.router, 'navigate');


            // 3) add dummy HTML elements:
            fixture = setFixtures('<div></div>');
            // 2) initialize ProfileApp object:
            lpv = new LeftPanelView({
                app: scope.app,
                model: scope.map
            });
            fixture.append(lpv.$el);
        };

        describe("LeftPanelView initialization: ", function () {
            beforeEach(function () {
                initApp(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });

            it("initializes correctly", function () {
                expect(lpv.initialize).toHaveBeenCalledTimes(1);
                expect(lpv).toEqual(jasmine.any(LeftPanelView));
            });
            it("has correct regions", function() {
                expect(lpv.regions.menu).toEqual("#map_title");
                expect(lpv.regions.layers).toEqual("#layers_region");
            });
            it("uses onRender() to display regions", function() {
                lpv.render();
                expect(lpv.onRender).toHaveBeenCalledTimes(1);

                expect(Marionette.Region.prototype.show).toHaveBeenCalledWith(jasmine.any(MapTitleView));
                expect(Marionette.Region.prototype.show).toHaveBeenCalledWith(jasmine.any(LayerListView));

                expect(MapTitleView.prototype.render).toHaveBeenCalledTimes(1);
                expect(LayerListView.prototype.render).toHaveBeenCalledTimes(1);
            });
            it('listens for new layer add (and scrolls)', function () {
                expect(LeftPanelView.prototype.scrollToLayer).toHaveBeenCalledTimes(0);
                this.app.vent.trigger('new-layer-added', this.categoricalLayer);
                expect(LeftPanelView.prototype.scrollToLayer).toHaveBeenCalledTimes(1);
                expect(LeftPanelView.prototype.scrollToLayer).toHaveBeenCalledWith(this.categoricalLayer);
            });
        });
        describe("LeftPanelView function tests: ", function() {
            beforeEach(function () {
                initApp(this);
            });
            afterEach(function () {
                Backbone.history.stop();
            });

            it("clicking '#map-delete' deletes map when confirmed deleteMap()", function () {
                lpv.render();
                expect(lpv.$el).toContainElement('#map-delete');
                expect(lpv.deleteMap).toHaveBeenCalledTimes(0);
                expect(DataManager.prototype.destroyMap).toHaveBeenCalledTimes(0);
                expect(this.app.router.navigate).toHaveBeenCalledTimes(0);

                spyOn(window, 'confirm').and.returnValue(true);
                lpv.$el.find('#map-delete').trigger('click');

                expect(lpv.deleteMap).toHaveBeenCalledTimes(1);
                expect(DataManager.prototype.destroyMap).toHaveBeenCalledTimes(1);
                expect(this.app.router.navigate).toHaveBeenCalledTimes(1);

            });

            it("clicking '#map-delete' does not delete map when cancelled", function () {
                lpv.render();
                expect(lpv.$el).toContainElement('#map-delete');
                expect(lpv.deleteMap).toHaveBeenCalledTimes(0);
                expect(DataManager.prototype.destroyMap).toHaveBeenCalledTimes(0);
                expect(this.app.router.navigate).toHaveBeenCalledTimes(0);

                spyOn(window, 'confirm').and.returnValue(false);
                lpv.$el.find('#map-delete').trigger('click');

                expect(lpv.deleteMap).toHaveBeenCalledTimes(1);
                expect(DataManager.prototype.destroyMap).toHaveBeenCalledTimes(0);
                expect(this.app.router.navigate).toHaveBeenCalledTimes(0);

            });

            it('scrollToLayer(layer) works', function () {
                lpv.render();
                spyOn(lpv.layers.$el, 'animate').and.callThrough();
                lpv.scrollToLayer(this.categoricalLayer);
                const $domElement = $('#' + 'layer' + this.categoricalLayer.id);
                const $panelElement = lpv.layers.$el.find('.layers');
                const layerHeight = $domElement.parent().parent().height();
                const panelHeight = $panelElement.height();
                expect($panelElement.scrollTop()).toEqual(0);
                expect(layerHeight).toBeGreaterThan(500);
                expect(panelHeight).toBeGreaterThan(layerHeight);
                expect(lpv.layers.$el.animate).toHaveBeenCalledWith({
                    scrollTop: panelHeight - layerHeight
                });
            });

        });


    });
