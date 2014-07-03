localground.map.GeoLocation = (function (opts) {
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
			alert("Go to preferred location");
			map.setCenter(userProfile.center);
			map.setZoom(userProfile.zoom);
		}
		else if(navigator.geolocation) {
			alert("Find current location");
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
		
		/* TODO: create a model for UserProfile
		$('#default_location').val("SRID=4326;POINT(" + latLng.lng().toFixed(6) + " " +
			latLng.lat().toFixed(6) + ")");

		$('#default_setter').submit(function(e) {
			var postData = $(this).serializeArray();
			var formURL = $(this).attr("action");
			$.ajax({
				url:formURL,
				type:"PATCH",
				data:postData,
				success:function(data, textStatus, jqXHR) {
					console.log("successfully submitted updated location")
				},
				error:function(data, textStatus, jqXHR) {
					console.log("error updating default location")
				}
			});
			e.preventDefault();
		});
		$('#default_setter').submit();
		*/
	};
	
	var handleNoGeolocation = function(browserSupportFlag) {
		//do nothing
	};
	
	//initialize the geolocation helper:
	initGeolocation();
});