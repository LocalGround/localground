var rootDir = "../../";
define([
    rootDir + "apps/presentation/views/legend-symbol-entry",
    rootDir + 'models/symbol',
    rootDir + "lib/maps/overlays/infobubbles/base",
    rootDir + 'lib/maps/marker-overlays',
    rootDir + 'lib/maps/overlays/marker',
    "tests/spec-helper"
],
    function (LegendSymbolEntry, Symbol, InfoBubble) {
        'use strict';
        var symbolView,
            fixture,
            symbolModel,
            initChildView = function (scope) {
                fixture = setFixtures('<ul class="symbol-container list-indent-simple"><li></li></ul>');
                symbolModel = scope.layer.getSymbols().at(0);
                symbolView = new LegendSymbolEntry({
                    app: scope.app,
                    data_source: scope.layer.get("data_source"),
                    is_showing: scope.layer.get("metadata").is_showing,
                    symbolCount: scope.layer.collection.length,
                    model: symbolModel
                });
                symbolView.render();
                fixture.append(symbolView.$el);
            },
            initSpies = function () {
                spyOn(LegendSymbolEntry.prototype, "initialize").and.callThrough();
                spyOn(InfoBubble.prototype, 'initialize');
            };

        describe("LegendSymbolEntry: Initialization Tests", function () {
            beforeEach(function () {
                initSpies();
                initChildView(this);
            });
            it("Initializes symbols collection successfully", function () {
                expect(LegendSymbolEntry.prototype.initialize).toHaveBeenCalledTimes(1);
            });

        });

        describe("LegendSymbolEntry: Render Tests", function(){
            beforeEach(function () {
                initSpies();
                initChildView(this);
            });
            it("Checkbox Settings for Layer (Layer should override Symbol settings)", function () {
                this.layer.get("metadata").is_showing = true;
                initChildView(this);
                expect(fixture.find(".cb-symbol").prop("checked")).toBeTruthy();
                this.layer.get("metadata").is_showing = false;
                initChildView(this);
                expect(fixture.find(".cb-symbol").prop("checked")).toBeFalsy();

            });


            it("Checkbox Settings for Symbol", function () {
                symbolModel.set("is_showing", true);
                initChildView(this);
                expect(fixture.find(".cb-symbol").prop("checked")).toBeTruthy();
                symbolModel.set("is_showing", false);
                initChildView(this);
                expect(fixture.find(".cb-symbol").prop("checked")).toBeFalsy();

            });

            it("Shape draws correctly", function() {
                /*
                <svg viewBox="{{ icon.viewBox }}" width="{{ width }}" height="{{ height }}">
                    <path fill="{{ icon.fillColor }}" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke"
                          stroke-width="{{ strokeWeight }}" stroke="{{ icon.strokeColor }}" d="{{ icon.path }}"></path>
                </svg>
                */
                var templateHelpers = symbolView.templateHelpers();
                expect(fixture.find("svg")[0].getAttribute("viewBox")).toEqual(symbolModel.get("icon").viewBox);
                expect(fixture.find("svg")[0].getAttribute("height")).toEqual(templateHelpers.height.toString());
                expect(fixture.find("svg")[0].getAttribute("width")).toEqual(templateHelpers.width.toString());
                //TODO: finish the SVG tests (check other attributes)
            });

            it("Make sure that text doesn't show if only 1 symbol specified.", function() {
                //don't show title if only 1 symbol:
                symbolView.symbolCount = 1;
                symbolView.render();
                expect(fixture).not.toContainElement("p");

                //show title if more than one symbole
                symbolView.symbolCount = 2;
                symbolView.render();
                expect(fixture).toContainElement("p");
                expect(fixture.find("p").html()).toEqual(symbolModel.get("title"));
            });

        });

    });
