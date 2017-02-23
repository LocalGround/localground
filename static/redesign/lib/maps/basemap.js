define(["marionette",
        "jquery",
        "lib/maps/controls/searchBox",
        "lib/maps/controls/tileController"
    ],
    function (Marionette, $, SearchBox, TileController) {
        'use strict';
        /**
         * A class that handles the basic Google Maps functionality,
         * including tiles, search, and setting the default location.
         * @class Basemap
         */

        var Basemap = Marionette.View.extend({
            customMapTypeID: 'custom-style',
            map: null,
            showSearchControl: true,
            activeMapTypeID: 1,
            minZoom: 1,
            maxZoom: 22,
            highlightCircle: null,
            addMarkerClicked: false, // will need state to determine marker creation upon click
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
                this.listenTo(this.app.vent, 'highlight-marker', this.doHighlight);
            },
            doHighlight: function (overlay) {
                //draw a circle on the map using this code:
                //https://developers.google.com/maps/documentation/javascript/shapes#circle_add
                if (!this.highlightCircle){
                    this.highlightCircle = new google.maps.Marker({
                        position: overlay.position,
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillOpacity: 0.5,
                            fillColor: '#fff',
                            strokeOpacity: 1.0,
                            strokeColor: '#fff',
                            strokeWeight: 3.0,
                            scale: 20, //pixels
                        },
                        map: this.map
                    });
                } else {
                    // This is supposed to change the position of circle, but does not
                    this.highlightCircle.setPosition(overlay.position);
                }
                console.log(this.app);
                overlay.setMap(null);
                overlay.setMap(this.map);

                //console.log(overlay);
                //alert(overlay);
            },

            // If the add marker button is clicked, allow user to add marker on click
            // after the marker is placed, disable adding marker and hide the "add marker" div
            placeMarkerOnMap: function(){
                // This function is based on the following resource:
                // http://stackoverflow.com/questions/15792655/add-marker-to-google-map-on-click

            }
            renderMap: function () {
                var mapOptions = {
                    scrollwheel: false,
                    minZoom: this.minZoom,
                    streetViewControl: true,
                    //scaleControl: true,
                    panControl: false,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                        position: google.maps.ControlPosition.TOP_LEFT
                    },
                    zoomControlOptions: this.zoomControlOptions || {
                        style: google.maps.ZoomControlStyle.SMALL
                    },
                    rotateControlOptions: this.rotateControlOptions,
                    streetViewControlOptions: this.streetViewControlOptions,
                    zoom: this.defaultLocation.zoom,
                    center: this.defaultLocation.center

                };
                this.app.map = this.map = new google.maps.Map(document.getElementById(this.$el.attr("id")),
                    mapOptions);
                //this.map.mapTypes.set(this.customMapTypeID, this.getCustomStyle());
                //this.map.setMapTypeId(this.customMapTypeID);
            },

            addControls: function () {
                //add a search control, if requested:
                if (this.showSearchControl) {
                    this.searchControl = new SearchBox(this.map);
                }

                //add a browser-based location detector, if requested:
                /*if (opts.includeGeolocationControl) {
                    this.geolocationControl = new GeoLocation({
                        map: this.map,
                        userProfile: this.userProfile,
                        defaultLocation: this.defaultLocation
                    });
                }*/

                //set up the various map tiles in Google maps:
                this.tileManager = new TileController(this.app, {
                    map: this.map,
                    activeMapTypeID: this.activeMapTypeID
                });

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
            redraw: function (opts) {
                var that = this,
                    time = (opts && opts.time) ? opts.time : 50;
                setTimeout(function () {
                    google.maps.event.trigger(that.map, 'resize');
                }, time);
            },
            getZoom: function () {
                return this.map.getZoom();
            },
            getCenter: function () {
                return this.map.getCenter();
            },
            getMapTypeId: function () {
                return this.tileManager.getMapTypeId();
            },
            setZoom: function (zoom) {
                this.map.setZoom(zoom);
            },
            setCenter: function (center) {
                this.map.setCenter(center);
            },
            setMapTypeId: function (id) {
                this.app.basemapView.tileManager.setActiveMapType(id);
            },

            saveState: function () {
                var latLng = this.map.getCenter(),
                    state = {
                        center: [latLng.lng(), latLng.lat()],
                        zoom: this.map.getZoom(),
                        activeMapTypeID: this.tileManager.getMapTypeId()
                    };
                this.app.saveState("basemap", state);
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
                    if (state.activeMapTypeID) {
                        this.activeMapTypeID = state.activeMapTypeID;
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
