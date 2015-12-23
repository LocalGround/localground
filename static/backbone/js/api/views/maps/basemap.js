define(["marionette",
        "jquery",
        "lib/maps/controls/searchBox",
        "lib/maps/controls/geolocation",
        "lib/maps/controls/tileController",
        "views/maps/overlays/overlayManager",
        "lib/maps/controls/deleteMenu",
        "lib/maps/controls/audioPlayer",
        "lib/maps/controls/fullScreenCtrl",
        "views/maps/caption/caption"
    ],
    function (Marionette, $, SearchBox, GeoLocation, TileController, OverlayManager, DeleteMenu, AudioPlayer,
              FullScreenCtrl, CaptionController) {
        'use strict';
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
            initialize: function (opts) {
                this.opts = opts;
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
                if (this.tilesets) {
                    this.tileManager = new TileController(this.app, {
                        map: this.map,
                        tilesets: this.tilesets,
                        activeMapTypeID: this.activeMapTypeID
                    });
                }


                //add event handlers:
                this.addEventHandlers();
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

                }, that = this;
                this.map = new google.maps.Map(document.getElementById(this.mapContainerID),
                    mapOptions);

                //Controls overlaid over the map inside the map div
                //need to wait for the map to load or be clobbered
                google.maps.event.addListenerOnce(this.map, 'idle', function () {
                    if (that.opts.includeAudioControl) {
                        that.audioPlayer = new AudioPlayer({
                            el: that.mapContainerID,
                            app: that.app
                        });
                    }
                    if (that.opts.includeFullScreenCtrl) {
                        that.fullScreenCtrl = new FullScreenCtrl({
                            el: that.mapContainerID,
                            map: that.map
                        });
                    }
                    if (that.opts.includeCaption && that.snapshot) {
                        that.caption = new CaptionController({
                            container: that.mapContainerID,
                            app: that.app,
                            snapshot: that.snapshot
                        });
                    }
                });
                this.overlayView = new google.maps.OverlayView();
                this.overlayView.draw = function () {};
                this.overlayView.setMap(this.map);
                this.app.setOverlayView(this.overlayView);
            },
            addEventHandlers: function () {
                //add notifications:
                var that = this;
                google.maps.event.addListener(this.map, "maptypeid_changed", function () {
                    that.saveState();
                });
                google.maps.event.addListener(this.map, "idle", function () {
                    that.saveState();
                });

                //todo: possibly move to a layout module?
                $(window).off('resize');
                $(window).on('resize', function () {
                    //$('#map_canvas').height($('body').height() - 10);
                    //google.maps.event.trigger(that.map, "resize");
                    that.app.vent.trigger("adjust-layout");
                });

                this.listenTo(this.app.vent, 'change-zoom', this.changeZoom.bind(this));
                this.listenTo(this.app.vent, 'change-center', this.changeCenter.bind(this));
            },

            changeZoom: function (zoom) {
                this.map.setZoom(zoom);
            },

            changeCenter: function (center) {
                this.map.setCenter(center);
            },

            saveState: function () {
                var latLng = this.map.getCenter();
                this.app.saveState("basemap", {
                    center: [latLng.lng(), latLng.lat()],
                    zoom: this.map.getZoom(),
                    basemapID: this.tileManager.getMapTypeId()
                });
            },
            restoreState: function () {
                var state = this.app.restoreState("basemap");
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
                return state;
            },
            onShow: function () {
                this.overlayManager = new OverlayManager(this.opts);
                this.deleteMenu = new DeleteMenu(this.opts);
                this.app.vent.trigger('map-ready');
            }

        });


        return Basemap;
    });


