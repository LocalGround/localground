define(["views/tables/tableEditor",
        "collections/records",
        "views/tables/column-manager",
        "views/tables/columns",
        "../../../test/spec-helper"],
    function (TableEditor, Records, ColumnManager, Columns) {
        'use strict';
        var initTableEditor = function (scope) {
                //console.log("initializing table...");
                return new TableEditor({
                    projectID: scope.projects.models[0].id,
                    url: '/api/0/forms/2/data/'
                });
            };

        describe("TableEditor: Test that initializes correctly", function () {
            var tableEditor;
            beforeEach(function () {
                tableEditor = initTableEditor(this);
            });

            it("Loads correctly if an initial projectID is passed in", function () {
                var that = this;
                expect(function () {
                    tableEditor = new TableEditor({
                        projectID: that.projects.models[0].id
                    });
                }).not.toThrow();
            });

            it("Initializes all needed properties", function () {
                expect(tableEditor.forms).not.toBeNull();
                expect(tableEditor.app).not.toBeNull();
                expect(tableEditor.router).not.toBeNull();
                expect(tableEditor.tableHeader).not.toBeNull();
                expect(tableEditor.globalEvents).not.toBeNull();
            });

        });

        describe("TableEditor: Test fetching columns and records", function () {
            var tableEditor;
            beforeEach(function () {
                tableEditor = initTableEditor(this);
            });

            it("Fetches Columns", function () {
                // Dynamically fetch and populate datagrid columns:
                tableEditor.fetchColumns();
                expect(tableEditor.columns.models.length).toBe(10);
            });

            it("Fetches Records", function () {
                // Fetch datagrid records:
                tableEditor.records = new Records([], {url: '/api/0/forms/2/data/'});
                tableEditor.records.fetch();
                expect(tableEditor.records.models.length).toBe(3);
            });

            it("Ensure that router triggers fetchColumns()", function () {
                spyOn(tableEditor, 'fetchColumns');
                tableEditor.router.trigger("route:get-table-data", 2);
                expect(tableEditor.fetchColumns).toHaveBeenCalled();
            });

            it("Ensure that fetchColumns triggers render()", function () {
                spyOn(tableEditor, 'render');
                tableEditor.fetchColumns();
                expect(tableEditor.render).toHaveBeenCalled();
            });

            it("Ensure that render triggers getRecords()", function () {
                spyOn(tableEditor, 'getRecords');
                tableEditor.render();
                expect(tableEditor.getRecords).toHaveBeenCalled();
                expect(tableEditor.grid).not.toBeNull();
                expect(tableEditor.paginator).not.toBeNull();
            });
        });

        describe("TableEditor: Test add column functionality.", function () {
            var tableEditor;
            beforeEach(function () {
                tableEditor = initTableEditor(this);
            });

            it("Ensure that triggering the globalEvents.insertColumn fires.", function () {
                tableEditor.fetchColumns();
                expect(tableEditor.columns instanceof Columns).toBeTruthy();
                tableEditor.globalEvents.trigger('insertColumn', tableEditor);
                expect(tableEditor.columnManager instanceof ColumnManager).toBeTruthy();
            });
        });
    });
