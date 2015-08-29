define(["lib/tables/formatters/latlng"], function (LatLngFormatter) {
    "use strict";
    /**
     * Custom formatter for handling latitudes (in light of a corresponding
     * longitude value)
     * @class LatFormatter
     */
    var LatFormatter = {
        fromRaw: function (rawValue, model) {
            try {
                //console.log(rawValue.coordinates[1].toFixed(4));
                return rawValue.coordinates[1].toFixed(4);
            } catch (e) {
                if (model.get("geometry")) {
                    //console.log(model.get("geometry").coordinates[1].toFixed(4));
                    return model.get("geometry").coordinates[1].toFixed(4);
                }
                return "";
            }
        },
        toRaw: function (formattedData, model) {
            return LatLngFormatter.update(formattedData, model, "lat", 1);
        }
    };
    return LatFormatter;
});