define([], function () {
    "use strict";
    /**
     * Class that adds a Search Box to the map.
     * @class GeoLocation
     * @param opts Initialization options for the Geolocation class.
     * @param {google.maps.Map} opts.map A google.maps.Map object, to which the
     * GeoLocation control should reference.
     * @param {UserProfile} opts.userProfile A user's profile, which includes
     * his/her default location.
     * @param {DefaultLocation} opts.defaultLocation A default location,
     * which includes a zoom level (1 to 20) and a center point, which is a
     * google.maps.LatLng object.
     */
    var GeoLocation = function (opts) {
        var map;
        try {
            map = opts.map;
        } catch (ex) {
            //TODO: should we catch this exception?
        }
        if (!map) {
            alert("\"map\" option required for localground.maps.GeoLocation object");
            return;
        }
        var userProfile = opts.userProfile,
            defaultLocation = opts.defaultLocation;

        /** Initializes the geolocation object. If the userProfile's
         * location is defined, the map uses it. Otherwise, it tries to
         * use the browser's geolocation capabilities. And if this is
         * disallowed or unsupported, it uses the application's default
         * location setting.
         */
        var initGeolocation = function () {
            if (userProfile) {
                //alert("Go to preferred location");
                map.setCenter(userProfile.center);
                map.setZoom(userProfile.zoom);
            } else if (navigator.geolocation) {
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

        /**
         * Used as a callback function from the Browser's geolocation API.
         */
        var setPosition = function (position) {
            var latLng = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
            );
            map.setCenter(latLng);
            map.setZoom(14);
        };

        var handleNoGeolocation = function (browserSupportFlag) {
            //do nothing
        };

        //initialize the geolocation helper:
        initGeolocation();
    };
    return GeoLocation;
});