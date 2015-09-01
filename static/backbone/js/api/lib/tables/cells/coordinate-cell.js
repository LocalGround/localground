define([
    "backgrid",
    "lib/tables/cells/coordinate-cell-editor"
], function (Backgrid, CoordinateCellEditor) {
    "use strict";
    /**
     * Extends Backgrid.Cell. When cell clicked, the underlying model is deleted.
     * @class DeleteCell
     */
    var CoordinateCell = Backgrid.Cell.extend({
        className: "coordinate-cell",
        editor: CoordinateCellEditor /*,
        initialize: function (options) {
            CoordinateCell.__super__.initialize.apply(this, arguments);
            if (this.columnName != "lat" && this.columnName != "lng") {
                throw new Error("CoordinateCell Error: this.columnName property must be defined as \"lat\" or \"lng.\"");
            }
            this.editor = CoordinateCellEditor.extend({ columnName: this.columnName });
        }*/
    });
    return CoordinateCell;
});