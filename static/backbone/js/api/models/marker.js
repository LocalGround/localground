define(["models/base",
		"models/association",
		"lib/maps/geometry/point",
		"lib/maps/geometry/polyline",
		"lib/maps/geometry/polygon"
	   ], function() {
	/**
	 * A Backbone Model class for the Marker datatype.
	 * @class Marker
	 * @see <a href="http://localground.org/api/0/markers/">http://localground.org/api/0/markers/</a>
	 */
	localground.models.Marker = localground.models.Base.extend({
		urlRoot: '/api/0/markers/',
		getCenter: function(){
			var geoJSON = this.get("geometry");
			if (geoJSON == null) { return null; }
			if (geoJSON.type == 'Point') {
				var point = new localground.maps.geometry.Point();
				return point.getGoogleLatLng(geoJSON);
			}
			else if (geoJSON.type == 'LineString') {
				var polyline = new localground.maps.geometry.Polyline();
				return polyline.getCenterPointFromGeoJSON(geoJSON);
			}
			else if (geoJSON.type == 'Polygon') {
				var polygon = new localground.maps.geometry.Polygon();
				return polygon.getCenterPointFromGeoJSON(geoJSON);
			}
			return null;
		},
		
		getDescriptiveText: function(){
			 var messages = [];
			if(this.get("photo_count") > 0)
				messages.push(this.get("photo_count") + ' photo(s)');
			if(this.get("audio_count") > 0)
				messages.push(this.get("audio_count") + ' audio clip(s)');
			if(this.get("record_count") > 0)
				messages.push(this.get("record_count") + ' data record(s)');
			return messages.join(', ');		
		},
		
		toTemplateJSON: function(){
			var json = localground.models.Base.prototype.toTemplateJSON.apply(this, arguments);
			json.descriptiveText = this.getDescriptiveText();
			return json;
		},
		
		defaults: {
			name: "Untitled"
		},
		
		attach: function(model){
			alert("marker is attaching!");
			association = new localground.models.Association({
				model_id: model.id,
				model_type: model.getKey(),
				marker_id: this.id
			});
			association.save();
		}
	});
	return localground.models.Marker;
});
