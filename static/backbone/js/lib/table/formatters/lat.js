define([], function() {
	var LatFormatter = {
		fromRaw: function (rawValue, model) {
			try {
				return rawValue.coordinates[1].toFixed(4);
			} catch(e) {
				return model.lat || "?";
			}
		},
		toRaw: function (formattedData, model) {
			geom = model.get("geometry");
			model.lat = parseFloat(formattedData) || null;
			if(model.lat == null) {
				return undefined;
			}
			
			if (geom && geom != null) {
				geom.coordinates[1] = model.lat;
				model.set("geometry", geom);
				model.trigger('change', model);
				return geom;
			}
			else if (model.lng != null && model.lat != null) {
				geom = {
					type: "Point",
					coordinates: [
						parseFloat(model.lng),
						parseFloat(model.lat)
					]
				};
				model.set("geometry", geom);
				model.trigger('change', model);
				return geom;
			}
			return null;
		}
	};
	return LatFormatter;
});