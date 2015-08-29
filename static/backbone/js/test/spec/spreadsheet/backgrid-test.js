define(["backgrid",
        "lib/tables/gridBody",
        "lib/tables/gridRow",
        "lib/tables/formatters/lat",
        "lib/tables/formatters/lng",
        "lib/tables/cells/delete",
        "lib/tables/cells/image-cell",
        "lib/tables/cells/image-cell-editor",
        "lib/tables/cells/audio-cell",
        "lib/tables/cells/audio-cell-editor",
        "../../../test/spec-helper"],
    function (Backgrid, GridBody, GridRow, LatFormatter, LngFormatter,
              DeleteCell, ImageCell, ImageCellEditor, AudioCell, AudioCellEditor) {
        'use strict';
        var grid,
            initGrid = function (scope) {
                grid = new Backgrid.Grid({
                    body: GridBody,
                    columns: scope.columns,
                    collection: scope.records,
                    row: GridRow
                });
                scope.columns.fetch({reset: true});
                scope.records.fetch({reset: true});
            };
        describe("Backgrid Test: Test initialization", function () {
            it("Has the correct number of rows and columns", function () {
                initGrid(this);
                expect(grid.collection.length).toBe(3);
                expect(grid.columns.length).toBe(8);
            });

            it("Initializes the cells correctly, given the attribute datatypes of the model", function () {
                initGrid(this);
                var row = grid.body.rows[0],
                    i = 0,
                    expectedValues = [
                        [DeleteCell, "delete-cell", false, Backgrid.CellFormatter, Backgrid.InputCellEditor],
                        [Backgrid.NumberCell, "number-cell", true, Object, Backgrid.InputCellEditor],
                        [Backgrid.NumberCell, "number-cell", true, LngFormatter, Backgrid.InputCellEditor],
                        [Backgrid.SelectCell, "project-cell", true, Backgrid.SelectFormatter, Backgrid.SelectCellEditor],
                        [Backgrid.StringCell, "string-cell", true, Backgrid.StringFormatter, Backgrid.InputCellEditor],
                        [ImageCell, "image-cell", true, Backgrid.CellFormatter, ImageCellEditor],
                        [AudioCell, "audio-cell", true, Backgrid.CellFormatter, AudioCellEditor],
                        [Backgrid.BooleanCell, "boolean-cell", true, Backgrid.CellFormatter, Backgrid.BooleanCellEditor]
                    ];
                expect(row.cells.length).toBe(expectedValues.length);
                for (i = 0; i < row.cells.length; i++) {
                    // Check View Mode
                    expect(row.cells[i] instanceof expectedValues[i][0]).toBeTruthy();
                    expect(row.cells[i].className).toBe(expectedValues[i][1]);
                    expect(row.cells[i].column.editable()).toBe(expectedValues[i][2]);
                    expect(row.cells[i].formatter instanceof expectedValues[i][3]).toBeTruthy();

                    // Check Edit Mode
                    row.cells[i].enterEditMode();
                    if (row.cells[i].column.editable()) {
                        expect(row.cells[i].currentEditor instanceof expectedValues[i][4]).toBeTruthy();
                    }
                }
            });

            it("Renders boolean cells correctly", function () {
                spyOn(Backgrid.BooleanCellEditor.prototype, "saveOrCancel").and.callThrough();
                spyOn(Backgrid.BooleanCellEditor.prototype, "render").and.callThrough();
                spyOn(Backgrid.BooleanCell.prototype, "enterEditMode").and.callThrough();
                initGrid(this);
                var booleanCell1 = grid.body.rows[0].cells[7],
                    column = booleanCell1.column,
                    model = booleanCell1.model;
                expect(booleanCell1.$el.find('input').attr('checked')).toBe('checked');
                expect(model.get(column.get("name"))).toBeTruthy();
                expect(this.records.at(0).get(column.get("name"))).toBeTruthy();

                // impersonate user clicking into the cell:
                spyOn(model, "trigger");
                booleanCell1.$el.trigger('click');

                // ensure that edit mode works:
                expect(Backgrid.BooleanCell.prototype.enterEditMode).toHaveBeenCalled();
                expect(Backgrid.BooleanCellEditor.prototype.render).toHaveBeenCalled();
                expect(model.trigger).toHaveBeenCalledWith("backgrid:edit", model, column, booleanCell1, booleanCell1.currentEditor);
                expect(booleanCell1.$el.find('input').attr('checked')).toBe('checked');

                // impersonate user unchecking the checkbox:
                booleanCell1.$el.find('input').trigger('click');
                expect(booleanCell1.$el.find('input').attr('checked')).not.toBe('checked');

                // impersonate user moving to next cell:
                booleanCell1.currentEditor.$el.trigger('change');
                expect(Backgrid.BooleanCellEditor.prototype.saveOrCancel).toHaveBeenCalled();

                //check that the model has been updated:
                expect(model.get(column.get("name"))).toBeFalsy();
                expect(this.records.at(0).get(column.get("name"))).toBeFalsy();
            });

            /*it("Renders point geometries correctly", function () {
                var row = grid.body.rows[0],
                    lat = row.cells[1],
                    lng = row.cells[2];
                expect(lat.$el.find('div').html()).toBe('37.8491');
                //expect(lng.$el.find('div').html()).toBe('-122.2581');
                spyOn(lat.model, "trigger").and.callThrough();
                lat.enterEditMode();
                expect(lat.model.trigger).toHaveBeenCalled();
                console.log(lat.$el.html());
                //expect(lat.$el.html()).toBe('37.8491');
                //expect(lng.$el.html()).toBe('-122.2581');
            });*/

            /*it("Yields the appropriate EditCell when the cell is clicked", function () {
                var row = grid.body.rows[0],
                    i = 0,
                    expectedValues = [DeleteCell, "delete-cell", false, Backgrid.CellFormatter],
                        [Backgrid.NumberCell, "number-cell", true, LatFormatter],
                        [Backgrid.NumberCell, "number-cell", true, LngFormatter],
                        [Backgrid.SelectCell, "project-cell", true, Backgrid.SelectFormatter],
                        [Backgrid.StringCell, "string-cell", true, Backgrid.StringFormatter],
                        [ImageCell, "image-cell", true, Backgrid.CellFormatter],
                        [AudioCell, "audio-cell", true, Backgrid.CellFormatter]
                    ];
                for (i = 0; i < row.cells.length; i++) {
                    expect(row.cells[i] instanceof expectedValues[i][0]).toBeTruthy();
                    expect(row.cells[i].className).toBe(expectedValues[i][1]);
                    expect(row.cells[i].column.editable()).toBe(expectedValues[i][2]);
                    expect(row.cells[i].formatter instanceof expectedValues[i][3]).toBeTruthy();
                }
            });*/
        });
    });