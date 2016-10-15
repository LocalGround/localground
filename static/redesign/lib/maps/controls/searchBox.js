define(['jquery'], function ($) {
    "use strict";
    /**
     * Class that adds a Search Box to the map.
     * @class SearchBox
     * @param {google.maps.Map} map A google.maps.Map object, to which the
     * SearchBox should be attached.
     */
    var SearchBox = function (map) {
        var searchBox = null,
            $input = $('<input class="controls address-input" ' +
                'type="text" placeholder="Search for Places">'),

        /**
         * Performs the search based on the location that the user
         * entered into the search box. If a valid location is found,
         * this function also zooms the map to the resulting location.
         */
            search = function () {
                var places = searchBox.getPlaces();
                if (places) {
                    if (places.length === 0) {
                        return;
                    }
                    if (places[0].geometry.viewport) {
                        map.fitBounds(places[0].geometry.viewport);
                    } else {
                        map.setCenter(places[0].geometry.location);
                        map.setZoom(17);
                    }
                }
            },
        /** Creates an HTML search control, and attaches
         * it to the upper right-hand side of the map.
         */
            render = function () {
                map.controls[google.maps.ControlPosition.RIGHT_TOP].push($input.get(0));
                searchBox = new google.maps.places.SearchBox($input.get(0));
                google.maps.event.addListener(searchBox, 'places_changed', function () {
                    search();
                });
                $input.keyup(function (event) {
                    if (event.keyCode === 13) {
                        search();
                    }
                });
            };



        //call render upon initialization
        render();
    };
    return SearchBox;
});