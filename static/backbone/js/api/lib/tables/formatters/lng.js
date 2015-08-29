define(["backgrid", "lib/tables/formatters/latlng"], function (Backgrid, LatLngFormatter) {
    "use strict";
    /**
     * Custom formatter for handling latitudes (in light of a corresponding
     * latitude value)
     * @class LngFormatter
     */
    var LngFormatter = function () {};
    _.extend(LngFormatter.prototype, Backgrid.CellFormatter.prototype, {
        fromRaw: function (rawValue, model) {
            try {
                return rawValue.coordinates[0].toFixed(4);
            } catch (e) {
                return model.lng || "";
            }
        },
        toRaw: function (formattedData, model) {
            return LatLngFormatter.update(formattedData, model, "lng", 0);
        }
    });
    return LngFormatter;
});