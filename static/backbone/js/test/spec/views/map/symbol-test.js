define([
    "views/maps/overlays/symbol",
    "../../../../test/spec-helper"
],
    function (Symbol) {
        'use strict';

        describe("Symbol: checks for correct initialization params", function () {

            it("Can initialize if initialization params are correct", function () {
                var symbol,
                    that = this;
                expect(function () {
                    symbol = new Symbol({
                        app: that.app,
                        color: "#0F0",
                        width: 20,
                        title: "Dogs",
                        rule: "tags contains dog"
                    });
                }).not.toThrow();
            });

            it("Throws error if missing rule specification", function () {
                var symbol,
                    that = this;
                expect(function () {
                    symbol = new Symbol({
                        app: that.app,
                        color: "#0F0",
                        width: 20,
                        title: "Dogs"
                    });
                }).toThrow();
            });

            it("Throws error if missing title", function () {
                var symbol,
                    that = this;
                expect(function () {
                    symbol = new Symbol({
                        app: that.app,
                        color: "#0F0",
                        width: 20,
                        rule: "tags contains dog"
                    });
                }).toThrow();
            });

        });

    });
