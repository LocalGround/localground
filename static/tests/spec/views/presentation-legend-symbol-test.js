var rootDir = "../../";
define([
    rootDir + "apps/presentation/views/legend-symbol-entry",
    rootDir + 'models/symbol',
    rootDir + "lib/maps/overlays/infobubbles/base",
    rootDir + 'lib/maps/marker-overlays',
    "tests/spec-helper"
],
    function (LegendSymbolEntry, Symbol, InfoBubble, OverlayListView) {
        'use strict';
        var symbolView,
            fixture,
            symbolModel,
            initChildView = function (scope) {
                fixture = setFixtures('<ul class="symbol-container list-indent-simple"><li></li></ul>');
                symbolModel = scope.layer.getSymbols().at(0);
                symbolView = new LegendSymbolEntry({
                    app: scope.app,
                    dataset: scope.layer.get("dataset"),
                    isShowing: scope.layer.get("metadata").isShowing,
                    symbolCount: scope.layer.collection.length,
                    model: symbolModel
                });
                symbolView.render();
                fixture.append(symbolView.$el);
            },
            initSpies = function (scope) {
                spyOn(LegendSymbolEntry.prototype, "initialize").and.callThrough();
                spyOn(InfoBubble.prototype, 'initialize');
                spyOn(scope.app.vent, 'trigger').and.callThrough();
                spyOn(OverlayListView.prototype, "showAll").and.callThrough();
            };

        describe("LegendSymbolEntry: Initialization Tests", function () {
            beforeEach(function () {
                initSpies(this);
                initChildView(this);
            });
            it("Initializes symbols collection successfully", function () {
                expect(LegendSymbolEntry.prototype.initialize).toHaveBeenCalledTimes(1);
            });

        });

        describe("LegendSymbolEntry: Render Tests", function(){
            beforeEach(function () {
                initSpies(this);
                initChildView(this);
            });
            it("Checkbox Settings for Layer (Layer should override Symbol settings)", function () {
                this.layer.get("metadata").isShowing = true;
                initChildView(this);
                expect(fixture.find(".cb-symbol").prop("checked")).toBeTruthy();
                this.layer.get("metadata").isShowing = false;
                initChildView(this);
                expect(fixture.find(".cb-symbol").prop("checked")).toBeFalsy();

            });


            it("Checkbox Settings for Symbol", function () {
                symbolModel.set("isShowing", true);
                initChildView(this);
                expect(fixture.find(".cb-symbol").prop("checked")).toBeTruthy();
                symbolModel.set("isShowing", false);
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
                expect(fixture.find("path")[0].getAttribute("stroke-width")).toEqual(templateHelpers.strokeWeight.toString());
                expect(fixture.find("path")[0].getAttribute("fill")).toEqual(symbolModel.get("icon").fillColor);
                expect(fixture.find("path")[0].getAttribute("stroke")).toEqual(symbolModel.get("icon").strokeColor);
                expect(fixture.find("path")[0].getAttribute("d")).toEqual(symbolModel.get("icon").path);
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

        describe("LegendSymbolEntry: Global events", function(){

            beforeEach(function () {
                initSpies(this);
                initChildView(this);
            });
            //
            it("Shows all markers has been triggered", function(){
                expect(OverlayListView.prototype.showAll).toHaveBeenCalledTimes(0);
                symbolView.app.vent.trigger("show-all-markers");
                expect(OverlayListView.prototype.showAll).toHaveBeenCalledTimes(1);
                //expect(1).toEqual(-1);

                //this.listenTo(this.app.vent, "show-all-markers", this.markerOverlays.showAll.bind(this.markerOverlays));
            });
        });

        describe("LegendSymbolEntry: HTML triggers", function(){

            beforeEach(function () {
                initSpies(this);
            });
            //
            it("Shows symbols being toggled between show and hide when clicked on the checkboxes", function(){
                initChildView(this);
                expect(fixture.find(".cb-symbol").prop("checked")).toBeFalsy();
                fixture.find(".cb-symbol").trigger("click")
                //initChildView(this);
                expect(fixture.find(".cb-symbol").prop("checked")).toBeTruthy();
                fixture.find(".cb-symbol").trigger("click")
                //initChildView(this);
                expect(fixture.find(".cb-symbol").prop("checked")).toBeFalsy();
            });
        });

    });
