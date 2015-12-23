define(["marionette",
        "jquery",
        "lib/maps/controls/searchBox",
        "lib/maps/controls/geolocation",
        "lib/maps/controls/tileController"
    ],
    function (Marionette, $, SearchBox, GeoLocation, TileController) {
        'use strict';
        /**
         * A class that handles the basic Google Maps functionality,
         * including tiles, search, and setting the default location.
         * @class Basemap
         */

        var PrintMap = Marionette.View.extend({

            /**
             * @lends localground.maps.views.Basemap#
             */
            id: "printmap",
            /** The google.maps.Map object */
            map: null,
            /** The default map type, if one is not specified */
            activeMapTypeID: 1,
            /** A boolean flag, indicating whether or not to
             *  include a search control */
            tileManager: null,
            /** A data structure containing user location preferences */
            userProfile: null,
            /** A data structure containing a default location */
            defaultLocation: null,
            /** An HTML Tag id where the map gets initialized */
            mapContainerID: null,

            /**
             * Initializes the google map and it's corresponding controls,
             * based on an "opts" configuration object. Valid options described
             * below:
             * @method
             * @param {String} opts.mapContainerID
             * @param {Object} opts.defaultLocation
             * @param {Boolean} opts.includeSearchControl
             * @param {Boolean} opts.includeGeolocationControl
             * @param {Integer} opts.activeMapTypeID
             * The user's preferred tileset for the given map.
             * @param {Array} opts.overlays
             * A list of available tilesets, based on user's profile.
             */
            initialize: function (opts) {
                $.extend(this, opts);
            },

            /**
             * Helper method that initializes the Google map (before
             * the corresponding controls are added).
             */
            renderMap: function (mapState) {
                this.initialCenter = new google.maps.LatLng(mapState.center[1], mapState.center[0]);
                var mapOptions = {
                    scrollwheel: false,
                    minZoom: this.minZoom,
                    streetViewControl: false,
                    scaleControl: true,
                    panControl: false,
                    mapTypeControl: false,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.SMALL
                    },
                    styles: [
                        {
                            featureType: "poi.school",
                            elementType: "geometry",
                            stylers: [
                                { saturation: -79 },
                                { lightness: 75 }
                            ]
                        }
                    ],
                    zoom: mapState.zoom,
                    center: this.initialCenter
                };
                this.map = new google.maps.Map(document.getElementById(this.mapContainerID),
                    mapOptions);
            },
            addEventHandlers: function () {
                this.listenTo(this.app.vent, 'change-zoom', this.changeZoom.bind(this));
                this.listenTo(this.app.vent, 'change-center', this.changeCenter.bind(this));
            },

            changeZoom: function (zoom) {
                this.map.setZoom(zoom);
            },

            changeCenter: function (center) {
                this.map.setCenter(center);
            },

            fetchMapState: function () {
                //Try pulling the basemap state from the cache
                var state = this.app.restoreState("basemap");
                console.log(state);
                return state;

            },

            onShow: function () {
                var mapState = this.fetchMapState();
                //render map:
                this.renderMap(mapState);

                //add a search control, if requested:
                if (this.includeSearchControl) {
                    this.searchControl = new SearchBox(this.map);
                }

                //add a browser-based location detector, if requested:
                if (this.includeGeolocationControl) {
                    this.geolocationControl = new GeoLocation({
                        map: this.map,
                        userProfile: this.userProfile,
                        defaultLocation: this.defaultLocation
                    });
                }

                //set up the various map tiles in Google maps:
                if (this.tilesets) {

                    if (mapState.basemapID) {
                        this.activeMapTypeID = mapState.basemapID;
                    }

                    this.tileManager = new TileController(this.app, {
                        map: this.map,
                        tilesets: this.tilesets,
                        activeMapTypeID: this.activeMapTypeID
                    });
                }


                //add event handlers:
                this.addEventHandlers();
            }

        });


        return PrintMap;
    });


