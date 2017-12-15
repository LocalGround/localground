define([], function () {
    "use strict";
    /**
     * Handles the updating of the geoJSON Point attribute of the
     * model, based on the lat/lng values. Basically, it coordinates
     * the updates across the two cells. A little hacky, but works
     * for now.
     * @class LatLngFormatter
     */
    var LatLngFormatter = {
        update: function (formattedData, model, key, index) {
            //delete geometry:
            if (formattedData === "") {
                model.lat = null;
                model.lng = null;
                model.set("geometry", null);
                return null;
            }

            //set model attributes:
            model[key] = parseFloat(formattedData) || null;

            //if it's null, it's an invalid floating point number:
            if (!model[key]) {
                return undefined;
            }

            // update exisiting geometry (if exists):
            var geom = model.get("geometry");
            if (geom) {
                geom.coordinates[index] = model[key];
                model.set("geometry", geom);
                model.trigger('change', model);
                return geom;
            }

            // otherwise create a new geometry object
            if (model.lng != null && model.lat != null) {
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