define(["lib/table/formatters/latlng"], function(LatLngFormatter) {
	/** 
     * Custom formatter for handling latitudes (in light of a corresponding
     * longitude value)
     * @class LatFormatter
     */
	localground.table.LatFormatter = {
		fromRaw: function (rawValue, model) {
			try {
				return rawValue.coordinates[1].toFixed(4);
			} catch(e) {
				return model.lat || "";
			}
		},
		toRaw: function (formattedData, model) {
			return LatLngFormatter.update(formattedData, model, "lat", 1);
		}
	};
	return localground.table.LatFormatter;
});