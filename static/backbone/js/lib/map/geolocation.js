define([], function() {
	GeoLocation = (function (opts) {
		var map;
		try { map = opts.map; }
		catch(ex) {}
		if (map == null) {
			alert("\"map\" option required for localground.map.GeoLocation object");
			return;
		}
		var userProfile = opts.userProfile;
		var defaultLocation = opts.defaultLocation;
		
		var initGeolocation = function() {
			if(userProfile) {
				//alert("Go to preferred location");
				map.setCenter(userProfile.center);
				map.setZoom(userProfile.zoom);
			}
			else if(navigator.geolocation) {
				//alert("Find current location");
				var browserSupportFlag = true;
				navigator.geolocation.getCurrentPosition(setPosition, handleNoGeolocation);
			}
			// Browser doesn't support Geolocation
			else {
				browserSupportFlag = false;
				map.setCenter(defaultLocation.center);
				map.setZoom(defaultLocation.zoom);
				that.handleNoGeolocation(browserSupportFlag);
			}
		};
		
		var setPosition = function(position) {
			var latLng = new google.maps.LatLng(
								position.coords.latitude,
								position.coords.longitude
							);
			map.setCenter(latLng);
			map.setZoom(14);
		};
		
		var handleNoGeolocation = function(browserSupportFlag) {
			//do nothing
		};
		
		//initialize the geolocation helper:
		initGeolocation();
	});
	return GeoLocation;
});