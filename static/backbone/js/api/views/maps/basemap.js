define(["marionette",
        "jquery",
        "lib/maps/controls/searchBox",
        "lib/maps/controls/geolocation",
        "lib/maps/controls/tileController"
    ],
    function (Marionette, $, SearchBox, GeoLocation, TileController) {
        //"use strict";
        /**
         * A class that handles the basic Google Maps functionality,
         * including tiles, search, and setting the default location.
         * @class Basemap
         */

        var Basemap = Marionette.View.extend({

            /**
             * @lends localground.maps.views.Basemap#
             */
            id: "basemap",
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
            initialize: function (app, opts) {
                this.app = app;
                $.extend(this, opts);
                this.restoreState(this.id);

                //render map:
                this.renderMap();

                //add a search control, if requested:
                if (opts.includeSearchControl) {
                    this.searchControl = new SearchBox(this.map);
                }

                //add a browser-based location detector, if requested:
                if (opts.includeGeolocationControl) {
                    this.geolocationControl = new GeoLocation({
                        map: this.map,
                        userProfile: this.userProfile,
                        defaultLocation: this.defaultLocation
                    });
                }

                //set up the various map tiles in Google maps:
                if (this.overlays) {
                    this.tileManager = new TileController(this.app, {
                        map: this.map,
                        overlays: this.overlays,
                        activeMapTypeID: this.activeMapTypeID
                    });
                }
                //add event handlers:
                this.addEventHandlers(this.app);
            },

            /**
             * Helper method that initializes the Google map (before
             * the corresponding controls are added).
             */
            renderMap: function () {
                var mapOptions = {
                    scrollwheel: false,
                    minZoom: this.minZoom,
                    streetViewControl: true,
                    scaleControl: true,
                    panControl: false,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                        position: google.maps.ControlPosition.TOP_LEFT
                    },
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
                    zoom: this.defaultLocation.zoom,
                    center: this.defaultLocation.center

                };
                this.map = new google.maps.Map(document.getElementById(this.mapContainerID),
                    mapOptions);

                this.overlayView = new google.maps.OverlayView();
                this.overlayView.draw = function () {
                };
                //this.overlayView.sb(this.map);
                //this.sb.setOverlayView(this.overlayView)


            },
            addEventHandlers: function (sb) {
                //add notifications:
                google.maps.event.addListener(this.map, "maptypeid_changed", function (evnt) {
                    //sb.notify({ type: "map-tiles-changed" });
                });
                google.maps.event.addListener(this.map, "idle", function (evnt) {
                    //sb.notify({ type: "map-extents-changed" });
                });

                //add listeners:
                /*sb.listen({
                    "map-tiles-changed": this.saveState,
                    "map-extents-changed": this.saveState,
                    "item-drop": this.handleItemDrop
                });*/

                //todo: possibly move to a layout module?
                $(window).off('resize');
                $(window).on('resize', function () {
                   // sb.notify({ type: "window-resized" });
                });
            },

            saveState: function () {
                var latLng = this.map.getCenter();
                this.app.saveState(this.id, {
                    center: [latLng.lng(), latLng.lat()],
                    zoom: this.map.getZoom(),
                    basemapID: this.tileManager.getMapTypeId()
                });
            },
            restoreState: function () {
                var state = this.app.restoreState(this.id);
                if (state) {
                    if (state.center) {
                        this.defaultLocation.center = new google.maps.LatLng(
                            state.center[1],
                            state.center[0]
                        );
                    }
                    if (state.zoom) {
                        this.defaultLocation.zoom = state.zoom;
                    }
                    if (state.basemapID) {
                        this.activeMapTypeID = state.basemapID;
                    }
                }
            }


        });


        return Basemap;
    });


