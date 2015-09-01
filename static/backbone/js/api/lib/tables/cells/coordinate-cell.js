define([
    "backgrid",
    "lib/tables/cells/coordinate-cell-editor"
], function (Backgrid, CoordinateCellEditor) {
    "use strict";
    /**
     * Extends Backgrid.Cell. Used for splitting JSON point geometries into
     * a lat and lng column
     * @class CoordinateCell
     */
    var CoordinateCell = Backgrid.Cell.extend({
        className: "coordinate-cell",
        editor: CoordinateCellEditor
    });
    return CoordinateCell;
});