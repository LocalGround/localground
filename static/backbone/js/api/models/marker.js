define(["underscore",
    "models/base",
    "lib/maps/geometry/point",
    "lib/maps/geometry/polyline",
    "lib/maps/geometry/polygon"
    ], function (_, Base, Point, Polyline, Polygon) {
    "use strict";
    /**
     * A Backbone Model class for the Marker datatype.
     * @class Marker
     * @see <a href="http://localground.org/api/0/markers/">http://localground.org/api/0/markers/</a>
     */
    var Marker = Base.extend({
        urlRoot: '/api/0/markers/',

        toTemplateJSON: function () {
            var json = Base.prototype.toTemplateJSON.apply(this, arguments);
            json.descriptiveText = this.getDescriptiveText();
            return json;
        },

        getCenter: function () {
            var geoJSON = this.get("geometry");
            if (!geoJSON) {
                return null;
            }
            if (geoJSON.type === 'Point') {
                var point = new Point();
                return point.getGoogleLatLng(geoJSON);
            }
            if (geoJSON.type === 'LineString') {
                var polyline = new Polyline();
                return polyline.getCenterPointFromGeoJSON(geoJSON);
            }
            if (geoJSON.type === 'Polygon') {
                var polygon = new Polygon();
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
        }
    });
    return Marker;
});
