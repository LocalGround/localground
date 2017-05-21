var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/style/views/right/marker-style-view"
],
    function ($, MarkerStyleView) {
        'use strict';
        var markerStyleView,
            fixture,
            initView = function (that) {
                // 1) add spies for all relevant objects:
                spyOn(that.app.vent, 'trigger').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'initialize').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'buildPalettes').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'buildColumnList').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'hideColorRamp').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'selectDataType').and.callThrough();

                // 2) initialize MarkerStyleView object:
                markerStyleView = new MarkerStyleView({
                    app: that.app,
                    model: that.layer
                });
                markerStyleView.render();

                // 3) set fixture:
                fixture = setFixtures('<div></div>');
                fixture.append(markerStyleView.$el);
            };

        describe("When MarkerStyleView is initialized", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should set properties and call initialization methods", function () {
                //calls methods:
                expect(markerStyleView).toEqual(jasmine.any(MarkerStyleView));
                expect(MarkerStyleView.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(MarkerStyleView.prototype.buildPalettes).toHaveBeenCalledTimes(1);
                expect(MarkerStyleView.prototype.buildColumnList).toHaveBeenCalledTimes(1);

                //sets properties:
                expect(markerStyleView.model).toEqual(this.layer);
                expect(markerStyleView.dataType).toEqual(this.layer.get("layer_type"));
                expect(markerStyleView.data_source).toEqual(this.layer.get("data_source"));
            });

            it("should listen for events", function () {
                expect(MarkerStyleView.prototype.selectDataType).toHaveBeenCalledTimes(0);
                expect(MarkerStyleView.prototype.hideColorRamp).toHaveBeenCalledTimes(0);
                expect(MarkerStyleView.prototype.buildColumnList).toHaveBeenCalledTimes(1);

                markerStyleView.app.vent.trigger("update-data-source");
                expect(MarkerStyleView.prototype.buildColumnList).toHaveBeenCalledTimes(2);
                $('body').trigger("click");
                expect(MarkerStyleView.prototype.hideColorRamp).toHaveBeenCalledTimes(1);
                markerStyleView.app.vent.trigger("find-datatype");
                expect(MarkerStyleView.prototype.selectDataType).toHaveBeenCalledTimes(1);
                expect(MarkerStyleView.prototype.buildColumnList).toHaveBeenCalledTimes(3);

            });
        });
    });
