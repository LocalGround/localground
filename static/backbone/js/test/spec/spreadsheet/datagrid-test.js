define(["backbone",
        "backgrid",
        "views/tables/datagrid",
        "collections/columns",
        "collections/records",
        "views/tables/column-manager",
        "views/tables/table-layout-manager",
        "../../../test/spec-helper"],
    function (Backbone, Backgrid, DataGrid, Columns, Records, ColumnManager, LayoutManager) {
        'use strict';
        var globalEvents = _.extend({}, Backbone.Events),
            app = { activeTableID: 2, projectID: 2 },
            datagrid;
        describe("Datagrid: Test initialization", function () {
            beforeEach(function () {
                // intercepts fetching of child objects
                spyOn(Columns.prototype, 'fetch');
                spyOn(Records.prototype, 'fetch');
                spyOn(ColumnManager.prototype.dataTypes, 'fetch');
                spyOn(ColumnManager.prototype, 'render');
            });

            it("Loads correctly if initialization params have been properly set.", function () {
                expect(function () {
                    datagrid = new DataGrid({ globalEvents: globalEvents, app: app });
                }).not.toThrow();

                expect(function () {
                    datagrid = new DataGrid({ globalEvents: globalEvents });
                }).toThrow();

                expect(function () {
                    datagrid = new DataGrid({ app: app });
                }).toThrow();

                expect(function () {
                    datagrid = new DataGrid();
                }).toThrow();
            });

            it("Initializes all properties", function () {
                datagrid = new DataGrid({ globalEvents: globalEvents, app: app });
                expect(datagrid.columns instanceof Columns).toBeTruthy();
                expect(datagrid.records instanceof Records).toBeTruthy();
                expect(datagrid.columnManager instanceof ColumnManager).toBeTruthy();
                expect(datagrid.grid instanceof Backgrid.Grid).toBeTruthy();
            });

            it("Added event listeners", function () {
                //add spies
                spyOn(DataGrid.prototype, 'initGrid');
                spyOn(DataGrid.prototype, 'render');
                spyOn(DataGrid.prototype, 'insertRowTop');
                spyOn(DataGrid.prototype, 'insertRowBottom');
                spyOn(DataGrid.prototype, 'getRecords');

                datagrid = new DataGrid({ globalEvents: globalEvents, app: app });

                //trigger events
                datagrid.columns.trigger('reset');
                datagrid.records.trigger('init-grid');
                datagrid.globalEvents.trigger('requery');
                datagrid.globalEvents.trigger('insertColumn');
                datagrid.globalEvents.trigger('insertRowTop');
                datagrid.globalEvents.trigger('insertRowBottom');

                //check if methods were called:
                expect(DataGrid.prototype.initGrid).toHaveBeenCalled();
                expect(DataGrid.prototype.render).toHaveBeenCalled();
                expect(DataGrid.prototype.getRecords).toHaveBeenCalled();
                expect(ColumnManager.prototype.render).toHaveBeenCalled();
                expect(DataGrid.prototype.insertRowTop).toHaveBeenCalled();
                expect(DataGrid.prototype.insertRowBottom).toHaveBeenCalled();
            });

        });

        describe("Datagrid: Method tests", function () {
            beforeEach(function () {
                // intercepts fetching of child objects
                spyOn(Columns.prototype, 'fetch');
                spyOn(Records.prototype, 'fetch');
                spyOn(ColumnManager.prototype.dataTypes, 'fetch');
                spyOn(ColumnManager.prototype, 'render');
            });

            it("Calls getColumns() successfully", function () {
                datagrid = new DataGrid({ globalEvents: globalEvents, app: app });
                datagrid.getColumns();
                expect(Columns.prototype.fetch).toHaveBeenCalled();
            });

            it("Calls getRecords() successfully", function () {
                spyOn(DataGrid.prototype, 'render');
                datagrid = new DataGrid({ globalEvents: globalEvents, app: app });
                datagrid.getRecords();
                expect(Records.prototype.fetch).toHaveBeenCalled();
                expect(DataGrid.prototype.render).toHaveBeenCalled();
            });

            it("Calls initGrid() successfully", function () {
                spyOn(DataGrid.prototype, 'getRecords');
                datagrid = new DataGrid({ globalEvents: globalEvents, app: app });
                datagrid.initGrid();
                expect(DataGrid.prototype.getRecords).toHaveBeenCalled();
            });

            it("Calls render() successfully", function () {
                datagrid = new DataGrid({ globalEvents: globalEvents, app: app });
                spyOn(datagrid.grid, 'render');
                datagrid.render();
                expect(datagrid.grid.render).toHaveBeenCalled();
            });

            it("Calls insertRowTop() successfully", function () {
                spyOn(Backgrid.Grid.prototype, 'insertRow');
                spyOn(LayoutManager.prototype, 'initLayout');
                datagrid = new DataGrid({ globalEvents: globalEvents, app: app });
                datagrid.insertRowTop();
                expect(Backgrid.Grid.prototype.insertRow).toHaveBeenCalled();
                expect(LayoutManager.prototype.initLayout).toHaveBeenCalled();
            });
        });
    });