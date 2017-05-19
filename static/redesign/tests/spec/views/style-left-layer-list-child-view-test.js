var rootDir = "../../";
define([
    'lib/maps/marker-overlays',
    'models/symbol',
    rootDir + "apps/style/views/left/layer-list-child-view"
],
    function (OverlayListView, Symbol, LayerListChildView) {
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
            spyOn(LayerListChildView.prototype, 'showHideOverlays').and.callThrough();
            spyOn(LayerListChildView.prototype, 'showOverlays').and.callThrough();
            spyOn(LayerListChildView.prototype, 'hideOverlays').and.callThrough();
            spyOn(LayerListChildView.prototype, 'render').and.callThrough();
            spyOn(LayerListChildView.prototype, 'updateMapOverlays').and.callThrough();
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
        };

        describe("LayerListChildView: Initialization", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should initialize", function () {
                expect(layerListChildView).toEqual(jasmine.any(LayerListChildView));
                expect(layerListChildView.initialize).toHaveBeenCalledTimes(1);
            });

            it("hides overlays when map changes", function () {
                expect(LayerListChildView.prototype.hideOverlays).toHaveBeenCalledTimes(0);
                expect(OverlayListView.prototype.hideAll).toHaveBeenCalledTimes(0);
                layerListChildView.app.vent.trigger('change-map');
                expect(LayerListChildView.prototype.hideOverlays).toHaveBeenCalledTimes(1);
                expect(OverlayListView.prototype.hideAll).toHaveBeenCalledTimes(this.layer.getSymbols().length);
            });

            it("re-renders view when title changes", function () {
                expect(LayerListChildView.prototype.render).toHaveBeenCalledTimes(1);
                this.layer.set("title", "hello world");
                expect(LayerListChildView.prototype.render).toHaveBeenCalledTimes(2);
                expect(fixture.find('p.layer-name').html()).toBe("hello world");
            });

            it("should have correct html", function () {  
                expect(fixture).toContainElement('p.layer-name');
                expect(fixture).toContainElement('input');
                expect(fixture).toContainElement('a.edit');
            });

            it("should set model correctly", function () {
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
            it("initialized 3 OverlayListView objects", function () {
                expect(layerListChildView.markerOverlayList.length).toBe(3);
            });

        });

        describe("LayerListChildView: Events", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should re-render overlays when style model updated", function () {
                expect(LayerListChildView.prototype.updateMapOverlays).toHaveBeenCalledTimes(0);
                var s = new Symbol({
                    "id": 1,
                    "title": "1 - 5",
                    "strokeWeight": 1,
                    "rule": "worm_count > 0 and worm_count < 6",
                    "height": 12,
                    "width": 12,
                    "shape": "circle",
                    "strokeColor": "#FFF",
                    "color": "#d7b5d8"
                });
                this.layer.setSymbol(s);
                expect(LayerListChildView.prototype.updateMapOverlays).toHaveBeenCalledTimes(1);
            });

            it("should show/hide overlays when checkbox checked and persist flag", function () {
                expect(LayerListChildView.prototype.showHideOverlays).toHaveBeenCalledTimes(0);
                expect(LayerListChildView.prototype.showOverlays).toHaveBeenCalledTimes(0);
                expect(LayerListChildView.prototype.hideOverlays).toHaveBeenCalledTimes(0);

                //toggle overlay checkbox to "checked":
                expect(layerListChildView.isChecked).toBeFalsy();
                console.log(fixture);
                fixture.find('input').trigger('click');
                expect(layerListChildView.isChecked).toBeTruthy();
                expect(LayerListChildView.prototype.showHideOverlays).toHaveBeenCalledTimes(1);
                expect(LayerListChildView.prototype.showOverlays).toHaveBeenCalledTimes(1);

                //toggle overlay checkbox to "un-checked":
                fixture.find('input').trigger('click');
                expect(layerListChildView.isChecked).toBeFalsy();
                expect(LayerListChildView.prototype.showHideOverlays).toHaveBeenCalledTimes(2);
                expect(LayerListChildView.prototype.hideOverlays).toHaveBeenCalledTimes(1);
            });
        });
    });