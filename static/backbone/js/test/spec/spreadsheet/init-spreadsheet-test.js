define(["jquery",
        "backbone",
        "views/tables/tableEditor",
        "collections/records",
        "../../../test/spec-helper"],
    function ($, Backbone, TableEditor, Records) {
        'use strict';
        // http://blog.ricca509.me/jasmine-mock-ajax-for-backbone-requests
        var tableEditor;

        describe("TableEditor: Test that initializes correctly", function () {
            it("Loads correctly if an initial projectID is passed in", function () {
                var that = this;
                expect(function () {
                    tableEditor = new TableEditor({
                        projectID: that.projects.models[0].id
                    });
                }).not.toThrow();
            });

            it("Initializes all needed properties", function () {
                tableEditor = new TableEditor({
                    projectID: this.projects.models[0].id
                });
                expect(tableEditor.forms).not.toBeNull();
                expect(tableEditor.app).not.toBeNull();
                expect(tableEditor.router).not.toBeNull();
                expect(tableEditor.tableHeader).not.toBeNull();
                expect(tableEditor.globalEvents).not.toBeNull();
            });

        });

        describe("TableEditor: Test fetching", function () {
            it("Fetches Records", function () {
                tableEditor = new TableEditor({
                    projectID: this.projects.models[0].id
                });
                tableEditor.records = new Records([], {url: '/api/0/forms/2/data/'});
                tableEditor.records.fetch();
                expect(tableEditor.records).not.toBeNull();
                expect(tableEditor.records.models.length).toBe(3);
            });
        });
    });
