define([], function() {
	var LatLngFormatter = {
		update: function (formattedData, model, key, index) {
			//delete geometry:
			if (formattedData == "") {
				model.lat = null;
				model.lng = null;
				model.set("geometry", null);
				return null;
			}
	
			//set model attributes:
			model[key] = parseFloat(formattedData) || null;
			
			//if it's null, it's an invalid floating point number:
			if(model[key] == null) {
				return undefined;
			}
			
			// update exisiting geometry (if exists):
			geom = model.get("geometry");
			if (geom && geom != null) {
				geom.coordinates[index] = model[key];
				model.set("geometry", geom);
				model.trigger('change', model);
				return geom;
			}
			
			// otherwise create a new geometry object
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
	return LatLngFormatter;
});