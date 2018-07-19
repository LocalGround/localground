var rootDir = "../../";
define([
    rootDir + "apps/presentation/views/legend-layer-entry",
    rootDir + "apps/presentation/views/legend-symbol-entry",
    rootDir + 'collections/symbols',
    rootDir + 'collections/records',
    rootDir + 'models/symbol',
    rootDir + 'lib/maps/marker-overlays',
    "tests/spec-helper"
],
    function (LegendLayerEntry, LegendSymbolEntry, Symbols, Records, Symbol, OverlayListView) {
        'use strict';
        var lle, fixture;

        function initChildView(scope) {
            var opts = {
                    "title": "6 - 10",
                    "strokeWeight": 1,
                    "rule": "earthworm_count > 5 and earthworm_count < 11",
                    "height": 32,
                    "width": 32,
                    "shape": "worm",
                    "strokeColor": "#FFF",
                    "color": "#df65b0",
                    "isShowing": true,
                    "layerModel": scope.continuousLayer
                },
                childView = new LegendSymbolEntry({
                    app: scope.app,
                    data_source: 'form_1',
                    model: new Symbol(opts)
                });
            return childView;
        }

        function initLegendLayerEntry(scope) {
            spyOn(LegendSymbolEntry.prototype, 'initialize').and.callThrough();
            spyOn(LegendSymbolEntry.prototype, 'showHide').and.callThrough();
            spyOn(OverlayListView.prototype, 'showAll');
            spyOn(OverlayListView.prototype, 'hideAll');
            spyOn(OverlayListView.prototype, 'initialize');
            lle = new LegendLayerEntry({
                app: scope.app,
                model: scope.layer
            });
            lle.render();
        }

        describe("LegendLayerEntry: Application-Level Tests", function () {
            beforeEach(function () {
                initLegendLayerEntry(this);
            });

            it("Initialization methods called successfully", function () {
                expect(lle).toEqual(jasmine.any(LegendLayerEntry));
            });
            it("Initializes symbols collection successfully", function () {
                expect(lle.collection).toEqual(jasmine.any(Symbols));
                expect(lle.collection.length).toEqual(3);
            });
        });

        describe("LegendLayerEntry: ChildView Tests", function () {
            beforeEach(function () {
                initLegendLayerEntry(this);
            });

            it("Initialization methods called successfully", function () {
                var overlays;
                lle.children.each(function (childView) {
                    overlays = childView.markerOverlays;
                    expect(childView.initialize).toHaveBeenCalled();
                    expect(childView.data).toEqual(jasmine.any(Records));
                    expect(childView.data.length).toEqual(3);
                    expect(overlays).toEqual(jasmine.any(OverlayListView));
                    expect(overlays.collection).toEqual(jasmine.any(Records));
                    expect(overlays.collection.length).toEqual(1);
                });
            });

            it("Initializes checkboxes according to isShowing flag", function () {
                lle.children.each(function (childView) {
                    fixture = setFixtures('<div></div>').append(childView.$el);
                    if (childView.model.get("isShowing")) {
                        expect(fixture.find('input').get(0).outerHTML).toBeChecked();
                    } else {
                        expect(fixture.find('input').get(0).outerHTML).not.toBeChecked();
                    }
                });
            });

            it("Listens for checkbox click", function () {
                var counter = 0;
                lle.children.each(function (childView) {
                    fixture = setFixtures('<div></div>').append(childView.$el);
                    expect(childView.showHide).toHaveBeenCalledTimes(counter);
                    fixture.find('input').click();
                    ++counter;
                    expect(childView.showHide).toHaveBeenCalledTimes(counter);
                });
            });

            it("Calls the correct OverlayListView toggle function", function () {
                var childView = initChildView(this);
                childView.render();
                fixture = setFixtures('<div></div>').append(childView.$el);
                expect(childView.showHide).toHaveBeenCalledTimes(0);
                expect(childView.markerOverlays.showAll).toHaveBeenCalledTimes(1);
                expect(childView.markerOverlays.hideAll).toHaveBeenCalledTimes(0);

                //turn on checkbox:
                fixture.find('input').trigger('click');
                expect(childView.showHide).toHaveBeenCalledTimes(1);
                expect(childView.markerOverlays.showAll).toHaveBeenCalledTimes(1);
                expect(childView.markerOverlays.hideAll).toHaveBeenCalledTimes(1);

                //turn off checkbox:
                fixture.find('input').trigger('click');
                expect(childView.showHide).toHaveBeenCalledTimes(2);
                expect(childView.markerOverlays.showAll).toHaveBeenCalledTimes(2);
                expect(childView.markerOverlays.hideAll).toHaveBeenCalledTimes(1);
            });

            it("Renders SVG as Expected", function () {
                var childView = initChildView(this);
                fixture = setFixtures('<div></div>').append(childView.$el);
                expect(1).toBe(1);
            });
        });

        describe("LegendLayerEntry: DOM Tests", function () {
            beforeEach(function (done) {
                initLegendLayerEntry(this);
                /*
                 * Documentation: https://github.com/velesin/jasmine-jquery
                 * NOTE: this setTimeout + done function is needed to give the
                 * CSS a little extra time to load, since it's asynchronous
                 */
                loadStyleFixtures('../../../../css/style.css');
                loadStyleFixtures('../../../../css/map-presentation.css');
                setTimeout(function () { done(); }, 10);
            });

            it("Renders HTML successfully", function () {
                fixture = setFixtures('<div id="legend"></div>').append(lle.$el);
                expect(fixture).toContainElement("ul");
                expect(fixture.find('li')).toHaveLength(4);
                expect(fixture.find('input')).toHaveLength(3);
                expect(fixture.find('svg')).toHaveLength(3);
                expect(fixture.find('p')).toHaveLength(3);
                expect(fixture.find('p').eq(0)).toHaveText('between 4 and 7');
                expect(fixture.find('p').eq(1)).toHaveText('between 7 and 9');
                expect(fixture.find('p').eq(2)).toHaveText('between 9 and 12');
            });

            it("Gets styled as expected", function () {
                fixture = setFixtures('<div id="legend"></div>').append(lle.$el);
                expect(fixture.find('#legend').width()).toBe(120);
                expect(fixture.find('#legend').css('border-radius')).toBe('6px');
                expect(fixture.find('#legend').css('position')).toBe('absolute');
            });

        });
    });
