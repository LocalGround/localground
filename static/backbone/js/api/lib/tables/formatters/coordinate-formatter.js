define(["lib/tables/formatters/latlng"], function (LatLngFormatter) {
    "use strict";
    /**
     * Note: this breaks encapsulation b/c the lat and lng column need to
     * know about each other.
     */
    var CoordinateFormatter = {
        columnName: null,
        fromRaw: function (rawValue, model) {
            // Note: if the coordinate is set to zero,
            // it's a dummy value, so display a blank:
            var idx = (this.columnName == "latitude") ? 1 : 0,
                coord,
                returnVal;
            if (model.get("geometry")) {
                try {
                    coord = model.get("geometry").coordinates[idx].toFixed(4);
                    if (Math.abs(coord) < 0.0001) {
                        returnVal = "";
                    } else {
                        returnVal = coord;
                    }
                } catch (e1) { returnVal = ""; }
            }
            return returnVal;
        },
        toRaw: function (formattedData, model) {
            if (formattedData === "") { return 0; }
            var parsedVal = parseFloat(formattedData) || 0;
            return parsedVal;
        }
    };
    return CoordinateFormatter;
});