define([
    "jquery",
    "views/maps/sidepanel/layerPanel",
    "../../../../../test/spec-helper"
],
    function ($, LayerPanel) {
        'use strict';

        describe("LayerPanel: Initializes and renders child views when data added and removed", function () {

            it("Can initialize the LayerPanel with correct initialization params", function () {
                var layerPanel,
                    that = this;
                expect(function () {
                    layerPanel = new LayerPanel({ app: that.app });
                }).not.toThrow();
                expect(function () {
                    layerPanel = new LayerPanel({});
                }).toThrow();
            });

            it("Renders the appropriate HTML regions", function () {
                var layerPanel = new LayerPanel({ app: this.app });
                layerPanel.render();
                expect(layerPanel.$el).toContainElement('#layer-manager');
                expect(layerPanel.$el).toContainElement('#data-filter');
                expect(layerPanel.$el).toContainElement('#layers-menu');
            });

            it("Doesn't throw an exception on show event", function () {
                var layerPanel = new LayerPanel({ app: this.app });
                layerPanel.render();
                expect(function () {
                    layerPanel.onShow();
                }).not.toThrow();
            });

            it("Resizes panel on show event", function () {
                spyOn(LayerPanel.prototype, "resize");
                var layerPanel = new LayerPanel({ app: this.app });
                layerPanel.render();
                layerPanel.onShow();
                expect(layerPanel.resize).toHaveBeenCalled();
            });
        });
    });
