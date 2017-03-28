var rootDir = "../../";
define([
    'lib/maps/marker-overlays',
    rootDir + "apps/style/views/left/layer-list-child-view"
],
    function (OverlayListView, LayerListChildView) {
        'use strict';
        var layerListChildView, fixture, initView;

        initView = function (scope) {
            //ensures that OverlayListView functions don't get called:
            spyOn(OverlayListView.prototype, 'initialize');
            spyOn(OverlayListView.prototype, 'hideAll');

            // 1) add spies for all relevant objects:
            spyOn(scope.app.vent, 'trigger').and.callThrough();
            spyOn(LayerListChildView.prototype, 'initialize').and.callThrough();
            spyOn(LayerListChildView.prototype, 'sendCollection').and.callThrough();
            spyOn(LayerListChildView.prototype, 'updateTitle').and.callThrough();
            spyOn(LayerListChildView.prototype, 'hideOverlays').and.callThrough();
            fixture = setFixtures('<div id="layers"></div>');

            // 2) initialize rightPanel object:
            //   scope.app.selectedMapModel = scope.testMap;
            layerListChildView = new LayerListChildView({
                app: scope.app,
                model: scope.layer
            });
            layerListChildView.render();

            // 3) set fixture:
            fixture.append(layerListChildView.$el);
            console.log(fixture);
        };

        describe("When LayerListChildView is initialized", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize", function () {
                expect(layerListChildView).toEqual(jasmine.any(LayerListChildView));
                expect(layerListChildView.initialize).toHaveBeenCalledTimes(1);
            });

            it("hides overlays when map changes", function () {
                expect(layerListChildView.hideOverlays).toHaveBeenCalledTimes(0);
                expect(OverlayListView.prototype.hideAll).toHaveBeenCalledTimes(0);
                layerListChildView.app.vent.trigger('change-map');
                expect(layerListChildView.hideOverlays).toHaveBeenCalledTimes(1);
                expect(OverlayListView.prototype.hideAll).toHaveBeenCalledTimes(this.layer.getSymbols().length);
            });

            it("should have correct html", function () {
                console.log(fixture);
                expect(fixture).toContainElement('p.layer-name');
                expect(fixture).toContainElement('input');
                expect(fixture).toContainElement('a.edit');
            });

            it("should set model correctly", function () {
                expect(layerListChildView.model).toEqual(this.layer);
            });

        });
    });