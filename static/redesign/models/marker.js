define(["models/base",
	"models/association",
    "lib/maps/geometry/point",
    "lib/maps/geometry/polyline",
    "lib/maps/geometry/polygon"
    ], function (Base, Association, Point, Polyline, Polygon) {
    "use strict";
    /**
     * A Backbone Model class for the Marker datatype.
     * @class Marker
     * @see <a href="//localground.org/api/0/markers/">//localground.org/api/0/markers/</a>
     */
    var Marker = Base.extend({
        urlRoot: '/api/0/markers/',
		defaults: _.extend({}, Base.prototype.defaults, {
			color: "CCCCCC" // rough draft color
		}),
        getNamePlural: function () {
            return "markers";
        },
		excludeList: [
            "overlay_type",
            "url",
            "manually_reviewed",
            "geometry",
            "num",
            "display_name",
            "id",
            "project_id",
			"team_photo",
			"site_photo",
			"soil_sketch_1",
			"soil_sketch_2"
        ],
        toTemplateJSON: function () {
            var json = Base.prototype.toTemplateJSON.apply(this, arguments),
				key,
				recs,
				i = 0,
				key1,
				list;
            json.descriptiveText = this.getDescriptiveText();
			if (this.get("children")) {
				for (key in this.get("children")) {
					if (key.indexOf("form_") != -1) {
						recs = this.get("children")[key].data;
						for (i = 0; i < recs.length; i++) {
							list = [];
							for (key1 in recs[i]) {
								if (this.excludeList.indexOf(key1) === -1 &&
										!/(^\w*_detail$)/.test(key1)) {
									list.push({
										key: key1.split("_").join(" "),
										value: recs[i][key1]
									});
								}
							}
							recs[i].list = list;
						}
					}
				}
			}
            return json;
        },

        getCenter: function () {
            var geoJSON = this.get("geometry"),
				point = null,
				polyline = null,
				polygon = null;

            if (!geoJSON) {
                return null;
            }
            if (geoJSON.type === 'Point') {
                point = new Point();
                return point.getGoogleLatLng(geoJSON);
            }
            if (geoJSON.type === 'LineString') {
                polyline = new Polyline();
                return polyline.getCenterPointFromGeoJSON(geoJSON);
            }
            if (geoJSON.type === 'Polygon') {
                polygon = new Polygon();
                return polygon.getCenterPointFromGeoJSON(geoJSON);
            }
            return null;
        },

        getDescriptiveText: function () {
            var messages = [];
            if (this.get("photo_count") > 0) {
                messages.push(this.get("photo_count") + ' photo(s)');
            }
            if (this.get("audio_count") > 0) {
                messages.push(this.get("audio_count") + ' audio clip(s)');
            }
            if (this.get("record_count") > 0) {
                messages.push(this.get("record_count") + ' data record(s)');
            }
            return messages.join(', ');
        },

        attach: function (model, order, callbackSuccess, callbackError) {
            var association = new Association({
                model: this,
                attachmentType: model.getKey()
            });
			association.save({ object_id: model.id, ordering: order }, {
				success: callbackSuccess,
				error: callbackError
			});
		},

		detach: function (attachmentType, attachmentID, callback) {
            var association = new Association({
                model: this,
                attachmentType: attachmentType,
                attachmentID: attachmentID
            });
            association.destroy({success: callback});
		},
        getFormSchema: function () {
            var schema = Base.prototype.getFormSchema.call(this);
            schema.children = { type: 'MediaEditor', title: 'children' };
            return schema;
        }
    });
    return Marker;
});
