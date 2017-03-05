var rootDir = "../../";
define([
    rootDir + "apps/presentation/views/legend-layer-entry",
    rootDir + "apps/presentation/views/legend-symbol-entry",
    rootDir + 'collections/symbols',
    "tests/spec-helper"
],
    function (LegendLayerEntry, LegendSymbolEntry, Symbols) {
        'use strict';
        var lle, fixture;

        function initApp(scope) {
            //http://www.itsmycodeblog.com/jasmine-jquery-testing-css/
            lle = new LegendLayerEntry({
                app: scope.app,
                model: scope.layer
            });
            lle.render();
        }

        describe("LegendLayerEntry: Application-Level Tests", function () {
            beforeEach(function () {
                //called before each "it" test (so we don't have to keep repeating code):
                initApp(this);
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
                spyOn(LegendSymbolEntry.prototype, 'initialize').and.callThrough();
                initApp(this);
            });

            it("Initialization methods called successfully", function () {
                lle.children.each(function (childview) {
                    expect(childview.initialize).toHaveBeenCalled();
                });
            });
        });

        describe("LegendLayerEntry: DOM Tests", function () {
            beforeEach(function (done) {
                //called before each "it" test (so we don't have to keep repeating code):
                initApp(this);

                /*
                 * NOTE: this setTimeout + done function is needed to give the 
                 * CSS a little extra time to load, since it's asynchronous
                 */
                loadStyleFixtures('../../../../css/style.css');
                loadStyleFixtures('../../../../css/map-presentation.css');
                setTimeout(function () { done(); }, 10);
            });

            it("Renders HTML successfully", function () {
                fixture = setFixtures('<div id="legend"></div>').append(lle.$el);
                //Documentation: https://github.com/velesin/jasmine-jquery
                expect(fixture).toContainElement("ul");
                expect(fixture.find('li')).toHaveLength(4);
                expect(fixture.find('input')).toHaveLength(3);
                expect(fixture.find('svg')).toHaveLength(3);
                expect(fixture.find('p')).toHaveLength(3);
                expect(fixture.find('p').eq(0)).toHaveText('1 - 5');
                expect(fixture.find('p').eq(1)).toHaveText('6 - 10');
                expect(fixture.find('p').eq(2)).toHaveText('11 or more');
            });

            it("Gets styled as expected", function () {
                fixture = setFixtures('<div id="legend"></div>').append(lle.$el);
                expect(fixture.find('#legend').width()).toBe(180);
                expect(fixture.find('#legend').css('border-radius')).toBe('4px');
                expect(fixture.find('#legend').css('position')).toBe('absolute');
            });

        });
    });
