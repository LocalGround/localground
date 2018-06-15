var rootDir = "../../";
define([
    rootDir + "models/layer",
    rootDir + "models/symbol",
    rootDir + "collections/symbols"
],
    function (Layer, Symbol, Symbols) {
        'use strict';
        const initSpies = function () {
            spyOn(Symbols.prototype, 'initialize').and.callThrough();
            spyOn(Symbols.prototype, 'getPalette').and.callThrough();
            spyOn(Symbols.prototype, 'getNextId').and.callThrough();
            spyOn(Symbols.prototype, 'getNextColor').and.callThrough();
            spyOn(Symbols.prototype, 'removeEmpty').and.callThrough();
            spyOn(Symbols.prototype, 'removeStaleMatches').and.callThrough();
            spyOn(Symbols.prototype, 'getNumMatches').and.callThrough();
            spyOn(Symbols.prototype, 'updateIfApplicable').and.callThrough();
            spyOn(Symbols.prototype, 'assignToExistingSymbol').and.callThrough();
            spyOn(Symbols.prototype, 'assignToNewSymbol').and.callThrough();
            spyOn(Symbols.prototype, 'getUncategorizedSymbol').and.callThrough();
            spyOn(Symbols.prototype, 'hasUncategorizedSymbol').and.callThrough();
            spyOn(Symbols.prototype, 'assignRecords').and.callThrough();
            spyOn(Symbols.prototype, 'assignRecord').and.callThrough();
            spyOn(Symbols.prototype, 'reassignRecord').and.callThrough();
            spyOn(Symbols.prototype, 'toSVGList').and.callThrough();
        };

        describe("SymbolCollection initialization:", function () {
            beforeEach(function () {
                initSpies();
            });

            it('initialize() works', function () {
                expect(1).toEqual(0);
            });

        });

        describe("SymbolCollection instance methods:", function () {
            beforeEach(function () {
                initSpies();
            });

            it('getPalette() works', function () {
                expect(1).toEqual(0);
            });
            it('getNextId() works', function () {
                expect(1).toEqual(0);
            });
            it('getNextColor() works', function () {
                expect(1).toEqual(0);
            });
            it('removeEmpty() works', function () {
                expect(1).toEqual(0);
            });
            it('removeStaleMatches() works', function () {
                expect(1).toEqual(0);
            });
            it('getNumMatches() works', function () {
                expect(1).toEqual(0);
            });
            it('updateIfApplicable() works', function () {
                expect(1).toEqual(0);
            });
            it('assignToExistingSymbol() works', function () {
                expect(1).toEqual(0);
            });
            it('assignToNewSymbol() works', function () {
                expect(1).toEqual(0);
            });
            it('getUncategorizedSymbol() works', function () {
                expect(1).toEqual(0);
            });
            it('hasUncategorizedSymbol() works', function () {
                expect(1).toEqual(0);
            });
            it('assignRecords() works', function () {
                expect(1).toEqual(0);
            });
            it('assignRecord() works', function () {
                expect(1).toEqual(0);
            });
            it('reassignRecord() works', function () {
                expect(1).toEqual(0);
            });
            it('toSVGList() works', function () {
                expect(1).toEqual(0);
            });
        });
    });
