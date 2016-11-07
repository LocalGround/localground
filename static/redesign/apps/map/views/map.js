define(["marionette",
        "jquery",
        "handlebars"
    ],
    function (Marionette, $, Handlebars) {
        'use strict';
        /**
         * A class that handles the basic Google Maps functionality,
         * including tiles, search, and setting the default location.
         * @class Basemap
         */

        var Basemap = Marionette.View.extend({
            map: null,
            activeMapTypeID: 1,
            tileManager: null,
            userProfile: null,
            //todo: populate this from user prefs:
            defaultLocation: {
                zoom: 15,
                center: { lat: -34, lng: 151 }
            },
            el: '#map',
            template: false,

            initialize: function (opts) {
                this.opts = opts;
                $.extend(this, opts);
                Marionette.View.prototype.initialize.call(this);
            },

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
                console.log(mapOptions);
                this.app.map = this.map = new google.maps.Map(document.getElementById(this.$el.attr("id")),
                    mapOptions);
            },

            addControls: function () {
                //add a search control, if requested:
                /*if (opts.includeSearchControl) {
                    this.searchControl = new SearchBox(this.map);
                }*/

                //add a browser-based location detector, if requested:
                /*if (opts.includeGeolocationControl) {
                    this.geolocationControl = new GeoLocation({
                        map: this.map,
                        userProfile: this.userProfile,
                        defaultLocation: this.defaultLocation
                    });
                }*/

                //set up the various map tiles in Google maps:
                /*if (this.tilesets) {
                    this.tileManager = new TileController(this.app, {
                        map: this.map,
                        tilesets: this.tilesets,
                        activeMapTypeID: this.activeMapTypeID
                    });
                }*/

                //add event handlers:
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
                google.maps.event.addListener(this.map, 'zoom_changed', function () {
                    that.saveState();
                });

                //todo: possibly move to a layout module?
                $(window).off('resize');
                $(window).on('resize', function () {
                    console.log('map resized');
                });
            },

            saveState: function () {
                var latLng = this.map.getCenter(),
                    state = {
                        center: [latLng.lng(), latLng.lat()],
                        zoom: this.map.getZoom()
                    };
                this.app.saveState("basemap", state);
                //console.log("saving state:", state);
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
                }
                return state;
            },
            onShow: function () {
                this.restoreState();
                this.renderMap();
                this.addControls();
                this.addEventHandlers();
            }

        });

        return Basemap;
    });
