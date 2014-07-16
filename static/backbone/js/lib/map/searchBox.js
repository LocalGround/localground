define([], function() {
	SearchBox = (function (opts) {	
		var searchBox = null;
		var $input = $('<input class="controls address-input" \
						   type="text" placeholder="Search for Places">');
		this.render = function() {
			map.controls[google.maps.ControlPosition.RIGHT_TOP].push($input.get(0));
			searchBox = new google.maps.places.SearchBox($input.get(0));
			google.maps.event.addListener(searchBox, 'places_changed', function () {
				search();
			});
			$input.keyup(function (event) {
				if (event.keyCode == 13) {
					search();
				}
			});
		};
		
		var search = function(){
			var places = searchBox.getPlaces();
			if (places) {
				if (places.length == 0) return;
				if (places[0].geometry.viewport) {
					map.fitBounds(places[0].geometry.viewport);
				}
				else {
					map.setCenter(places[0].geometry.location);
					map.setZoom(17);
				}
			}
		};
		
		//call render upon initialization
		this.render();
	});
	return SearchBox;
});