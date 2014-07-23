define(["lib/table/formatters/latlng"], function(LatLngFormatter) {
	var LatFormatter = {
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
	return LatFormatter;
});