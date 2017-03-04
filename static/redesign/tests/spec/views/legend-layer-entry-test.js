var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/presentation/views/legend-layer-entry",
    rootDir + 'collections/symbols',
    "tests/spec-helper"
],
    function ($, LegendLayerEntry, Symbols) {
        'use strict';
        var lle, fixture;

        function initApp(scope, done) {
            //http://www.itsmycodeblog.com/jasmine-jquery-testing-css/
            lle = new LegendLayerEntry({
                app: scope.app,
                model: scope.layer
            });
            lle.render();

            // NOTE: this setTimeout + done function is needed to give the 
            // CSS time to load, since it's asynchronous
            loadStyleFixtures('../../../../css/style.css');
            loadStyleFixtures('../../../../css/map-presentation.css');
            setTimeout(function () {
                fixture = setFixtures('<div id="legend"></div>');
                done();
            }, 50);
        }

        describe("LegendLayerEntry: Application-Level Tests", function () {
            beforeEach(function (done) {
                //called before each "it" test (so we don't have to keep repeating code):
                initApp(this, done);
            });

            it("Initialization methods called successfully", function () {
                expect(lle).toEqual(jasmine.any(LegendLayerEntry));
            });
            it("Initializes symbols collection successfully", function () {
                expect(lle.collection).toEqual(jasmine.any(Symbols));
                expect(lle.collection.length).toEqual(3);
            });

            it("Renders HTML successfully", function () {
                fixture.append(lle.$el);
                expect(fixture.find('#legend').width()).toBe(180);
                expect(lle.$el).toContainElement("ul");
                expect(lle.$el.find('li').length).toBe(4);
                expect(lle.$el.find('input').length).toBe(3);
                expect(lle.$el.find('svg').length).toBe(3);
                expect(lle.$el.find('p').length).toBe(3);
                expect($(lle.$el.find('p').get(0)).html()).toBe('1 - 5');
                expect($(lle.$el.find('p').get(1)).html()).toBe('6 - 10');

            });

        });
    });
