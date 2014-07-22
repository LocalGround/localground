define([], function() {
	var LngFormatter = {
		fromRaw: function (rawValue, model) {
			try {
				return rawValue.coordinates[0].toFixed(4);
			} catch(e) {
				return model.lng || "?";
			}
		},
		toRaw: function (formattedData, model) {
			geom = model.get("geometry");
			model.lng = parseFloat(formattedData) || null;
			if(model.lng == null) {
				return null;
			}
			
			if (geom && geom != null) {
				geom.coordinates[0] = model.lng;
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
	return LngFormatter;
});