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
                return rawValue.coordinates[1].toFixed(4);
            } catch (e) {
                return model.lat || "";
            }
        },
        toRaw: function (formattedData, model) {
            return LatLngFormatter.update(formattedData, model, "lat", 1);
        }
    };
    return LatFormatter;
});