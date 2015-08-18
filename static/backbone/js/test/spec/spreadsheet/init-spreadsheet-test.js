define(["views/tables/tableEditor",
        "../../../test/spec-helper"],
    function (TableEditor) {
        'use strict';
        var tableEditor, that;

        describe("TableEditor: Test that initializes correctly", function () {

            it("Loads correctly if an initial projectID is passed in", function () {
                that = this;
                expect(function () {
                    tableEditor = new TableEditor({
                        projectID: that.projects.models[0].id
                    });
                }).not.toThrow();
            });

            it("Initializes all needed properties", function () {
                expect(tableEditor.forms).not.toBe(null);
                expect(tableEditor.app).not.toBe(null);
                expect(tableEditor.router).not.toBe(null);
                expect(tableEditor.tableHeader).not.toBe(null);
                expect(tableEditor.globalEvents).not.toBe(null);
            });

        });
    });
