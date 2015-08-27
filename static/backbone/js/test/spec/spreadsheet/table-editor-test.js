define(["backgrid",
        "views/tables/tableEditor",
        "views/tables/datagrid",
        "collections/records",
        "views/tables/column-manager",
        "collections/columns",
        "../../../test/spec-helper"],
    function (Backgrid, TableEditor, DataGrid, Records, ColumnManager, Columns) {
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

            it("Loads correctly if an initial projectID is passed in", function () {
                var that = this;
                expect(function () {
                    tableEditor = new TableEditor({ projectID: that.projects.models[0].id });
                }).not.toThrow();
                expect(function () {
                    tableEditor = new TableEditor();
                }).toThrow();
            });

            it("Initializes all needed properties", function () {
                tableEditor = initTableEditor(this);
                expect(tableEditor.app).not.toBeNull();
                expect(tableEditor.router).not.toBeNull();
                expect(tableEditor.tableHeader).not.toBeNull();
                expect(tableEditor.globalEvents).not.toBeNull();
            });

            it("Routes correctly", function () {
                spyOn(TableEditor.prototype, 'loadGrid');
                tableEditor = initTableEditor(this);
                tableEditor.router.trigger('route:get-table-data', 2);
                expect(TableEditor.prototype.loadGrid).toHaveBeenCalledWith(2);
            });

            it("Calls loadGrid() correctly", function () {
                //catch so as not to query database:
                spyOn(Columns.prototype, 'fetch');
                spyOn(Records.prototype, 'fetch');
                spyOn(ColumnManager.prototype.dataTypes, 'fetch');
                spyOn(ColumnManager.prototype, 'render');

                tableEditor = initTableEditor(this);
                tableEditor.loadGrid(2);

                expect(tableEditor.app.activeTableID).toBe(2);
                expect(tableEditor.grid instanceof DataGrid).toBeTruthy();
                expect(tableEditor.paginator instanceof Backgrid.Extension.Paginator).toBeTruthy();
            });

        });

    });
