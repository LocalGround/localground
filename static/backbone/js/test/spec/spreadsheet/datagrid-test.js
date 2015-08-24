define(["backbone",
        "models/field",
        "collections/columns",
        "views/tables/column-manager",
        "../../../test/spec-helper"],
    function (Backbone, Field, Columns, ColumnManager) {
        'use strict';
        var globalEvents = Backbone.Events,
            cm,
            url = '/api/0/forms/2/fields/',
            columns = new Columns(null, {
                url: '/api/0/forms/2/fields/'
            });
        describe("ColumnManager: Test initialization", function () {
            beforeEach(function () {
                spyOn(ColumnManager.prototype.dataTypes, 'fetch');
                spyOn(ColumnManager.prototype, 'render');
            });

            it("Loads correctly if initialization params have been properly set.", function () {
                expect(function () {
                    grid = new DataGrid({
                        columns: this.columns,
                        records: this.records,
                        globalEvents: this.globalEvents,
                        app: this.app
                    });
                }).not.toThrow();

                expect(function () {
                    cm = new ColumnManager({ url: url });
                }).toThrow();

                expect(function () {
                    cm = new ColumnManager({ columns: columns });
                }).toThrow();

                expect(function () {
                    cm = new ColumnManager();
                }).toThrow();
            });
        });
    });