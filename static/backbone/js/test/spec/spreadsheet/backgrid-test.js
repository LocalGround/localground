define(["backgrid",
        "lib/tables/gridBody",
        "lib/tables/gridRow",
        "lib/tables/cells/delete",
        "lib/tables/cells/image-cell",
        "lib/tables/cells/image-cell-editor",
        "lib/tables/cells/audio-cell",
        "lib/tables/cells/audio-cell-editor",
        "lib/tables/cells/coordinate-cell",
        "lib/tables/cells/coordinate-cell-editor",
        "../../../test/spec-helper"],
    function (Backgrid, GridBody, GridRow, DeleteCell, ImageCell, ImageCellEditor, AudioCell, AudioCellEditor, CoordinateCell, CoordinateCellEditor) {
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
                        [CoordinateCell, "coordinate-cell", true, Object, Backgrid.InputCellEditor],
                        [CoordinateCell, "coordinate-cell", true, Object, Backgrid.InputCellEditor],
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

            it("Renders point geometry cells correctly", function () {
                spyOn(CoordinateCellEditor.prototype, "saveOrCancel").and.callThrough();
                spyOn(CoordinateCellEditor.prototype, "render").and.callThrough();
                spyOn(CoordinateCell.prototype, "enterEditMode").and.callThrough();
                initGrid(this);
                var lat = grid.body.rows[0].cells[1],
                    column = lat.column,
                    model = lat.model,
                    latVal = model.get("geometry").coordinates[1];
                expect(lat.$el.find('div').html()).toBe(latVal.toString());

                // impersonate user clicking into the cell:
                spyOn(model, "trigger");
                lat.$el.trigger('click');

                // ensure that edit mode works:
                expect(CoordinateCell.prototype.enterEditMode).toHaveBeenCalled();
                expect(CoordinateCellEditor.prototype.render).toHaveBeenCalled();
                expect(model.trigger).toHaveBeenCalledWith("backgrid:edit", model, column, lat, lat.currentEditor);
                expect(lat.$el.find('input').val()).toBe(latVal.toString());

                // impersonate user editing lat:
                lat.$el.find('input').val('40.8491');

                // impersonate user moving to next cell:
                lat.currentEditor.$el.trigger('blur');
                expect(model.trigger).toHaveBeenCalledWith("backgrid:edited", model, column, jasmine.any(Backgrid.Command));
                expect(CoordinateCellEditor.prototype.saveOrCancel).toHaveBeenCalled();

                //check that the model has been updated:
                expect(model.get("geometry").coordinates[1]).toBe(40.8491);
            });
        });

        describe("Backgrid Test: Handles null lat values appropriately", function () {
            it("Handles null longitude values", function () {
                initGrid(this);
                var lat = grid.body.rows[0].cells[1],
                    model = lat.model,
                    expectedValue = { "type": "Point", "coordinates": [0, 40.8491] };
                //clear out the model:
                model.set("geometry", null);

                // impersonate user clicking into the cell:
                spyOn(model, "trigger");
                lat.$el.trigger('click');
                expect(lat.$el.find('input').val()).toBe("");

                // impersonate user editing lat:
                lat.$el.find('input').val('40.8491');

                // impersonate user moving to next cell:
                lat.currentEditor.$el.trigger('blur');
                expect(model.get("geometry").type).toBe(expectedValue.type);
                expect(model.get("geometry").coordinates[0]).toBe(expectedValue.coordinates[0]);
                expect(model.get("geometry").coordinates[1]).toBe(expectedValue.coordinates[1]);

                // impersonate user clearing out the cell:
                lat.$el.trigger('click');
                lat.$el.find('input').val('');
                lat.currentEditor.$el.trigger('blur');
                expect(model.trigger).toHaveBeenCalledWith("backgrid:edited", model, lat.column, jasmine.any(Backgrid.Command));
                expect(model.get("geometry")).toBeNull();
            });

            it("Handles null latitude values", function () {
                initGrid(this);
                var lng = grid.body.rows[0].cells[2],
                    model = lng.model,
                    expectedValue = { "type": "Point", "coordinates": [-122.123, 0] };
                //clear out the model:
                model.set("geometry", null);

                // impersonate user clicking into the cell:
                spyOn(model, "trigger");
                lng.$el.trigger('click');
                expect(lng.$el.find('input').val()).toBe("");

                // impersonate user editing lat:
                lng.$el.find('input').val('-122.123');

                // impersonate user moving to next cell:
                lng.currentEditor.$el.trigger('blur');
                expect(model.get("geometry").type).toBe(expectedValue.type);
                expect(model.get("geometry").coordinates[0]).toBe(expectedValue.coordinates[0]);
                expect(model.get("geometry").coordinates[1]).toBe(expectedValue.coordinates[1]);

                // impersonate user clearing out the cell:
                lng.$el.trigger('click');
                lng.$el.find('input').val('');
                lng.currentEditor.$el.trigger('blur');
                expect(model.trigger).toHaveBeenCalledWith("backgrid:edited", model, lng.column, jasmine.any(Backgrid.Command));
                expect(model.get("geometry")).toBeNull();
            });
        });
    });