define(["marionette",
        "jquery",
        "lib/maps/controls/searchBox",
        "lib/maps/controls/tileController",
        "lib/maps/controls/drawingManager"
    ],
    function (Marionette, $, SearchBox, TileController, DrawingManager) {
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
            showDropdownControl: true,
            activeMapTypeID: 7,
            minZoom: 1,
            maxZoom: 22,
            mapID: 'map',
            disableStateMemory: false,
            activeModel: null, //revisit this
            addMarkerClicked: false,
            tileManager: null,
            userProfile: null,
            panorama: null,
            //todo: populate this from user prefs:
            defaultLocation: {
                zoom: 15,
                center: { lat: -34, lng: 151 }
            },
            //el: '#map',
            template: false,

            initialize: function (opts) {
                // set initial properties (init params override state params):
                this.app = opts.app;
                this.tilesets = this.app.dataManager.getTilesets();
                this.restoreState();
                $.extend(this, opts);

                //add event listeners:
                this.listenTo(this.tilesets, 'reset', this.onShow);
                this.listenTo(this.app.vent, 'highlight-marker', this.doHighlight);
                this.listenTo(this.app.vent, 'show-streetview', this.showStreetView);
                this.listenTo(this.app.vent, 'hide-streetview', this.hideStreetView);
                this.listenTo(this.app.vent, 'new-map-loaded', this.update);
            },

            doHighlight: function (model) {
                if (this.activeModel) {
                    this.activeModel.set("active", false);
                }
                this.activeModel = model;
            },

            getTileSetByKey: function (key, value) {
                return this.tilesets.find(function (model) {
                    if (key === 'name') {
                        return model.get(key).toLowerCase() === value.toLowerCase();
                    }
                    return model.get(key) === value;
                });
            },

            setActiveMapType: function (id) {
                //this.showCustomAttribution(id);
                var tileset = this.getTileSetByKey("id", id);
                if (tileset) {
                    this.map.setMapTypeId(tileset.getMapTypeID());
                    this.app.vent.trigger("map-tiles-changed");
                }
            },

            showMapTypesDropdown: function (opts) {
                // only show map dropdown once tilesets loaded:
                var key;
                for (key in opts.mapTypes) {
                    this.map.mapTypes.set(key, opts.mapTypes[key]);
                }
                if (this.showDropdownControl) {
                    this.map.setOptions({
                        mapTypeControlOptions: {
                            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                            position: google.maps.ControlPosition.TOP_LEFT,
                            mapTypeIds: opts.mapTypeIDs
                        },
                        mapTypeControl: true
                    });
                }
            },

            renderMap: function () {
                var mapOptions = {
                    scrollwheel: false,
                    minZoom: this.minZoom,
                    streetViewControl: true,
                    fullscreenControl: false,
                    //scaleControl: true,
                    panControl: false,
                    zoomControlOptions: this.zoomControlOptions || {
                        style: google.maps.ZoomControlStyle.SMALL
                    },
                    mapTypeControl: this.showDropdownControl,
                    //mapTypeId: this.activeMapTypeID,
                    rotateControlOptions: this.rotateControlOptions,
                    streetViewControlOptions: this.streetViewControlOptions,
                    zoom: this.zoom || this.defaultLocation.zoom,
                    center: this.center || this.defaultLocation.center,
                    gestureHandling: this.allowPanZoom ? 'auto' : 'none',
                    zoomControl: this.allowPanZoom,
                    streetViewControl: this.allowStreetView
                };

                if (!this.$el.find("#" + this.mapID).get(0)) {
                    this.$el.append($('<div id="' + this.mapID + '"></div>'));
                }

                this.app.map = this.map = new google.maps.Map(document.getElementById(this.mapID),
                    mapOptions);
                this.initTileManager();
                this.initDrawingManager();
            },
            showStreetView: function (model) {
                this.activeModel = model;
                var that = this,
                    extras = model.get("extras") || {},
                    pov = extras.pov || { heading: 180, pitch: -10 };
                this.panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('map'),
                    {
                        position: {
                            lat: model.get("geometry").coordinates[1],
                            lng: model.get("geometry").coordinates[0]
                        },
                        addressControlOptions: {
                            position: google.maps.ControlPosition.BOTTOM_CENTER
                        },
                        pov: pov,
                        linksControl: false,
                        panControl: true,
                        addressControl: false,
                        enableCloseButton: true
                    }
                );
                google.maps.event.addListener(this.panorama, 'visible_changed', function () {
                    if (!this.getVisible()) {
                        that.app.vent.trigger('streetview-hidden');
                    }
                });
                if (this.app.screenType === "map") {
                    google.maps.event.addListener(this.panorama, 'pov_changed', function () {
                        if (that.app.mode !== "edit" || that.activeModel.get("overlay_type") !== "marker") {
                            return;
                        }
                        if (that.povTimer) {
                            clearTimeout(that.povTimer);
                        }
                        that.povTimer = setTimeout(function () {
                            var pov = {
                                    heading: that.panorama.getPov().heading,
                                    pitch: that.panorama.getPov().pitch
                                },
                                extras = that.activeModel.get("extras") || {};
                            extras.pov = pov;
                            that.activeModel.save({extras: JSON.stringify(extras)}, {patch: true, parse: false});
                            that.activeModel.set("extras", extras);
                        }, 500);
                    });
                }
                this.map.setStreetView(this.panorama);
            },
            hideStreetView: function () {
                if (this.panorama) {
                    this.panorama.setVisible(false);
                }
            },
            initTileManager: function () {
                if (this.tilesets.length == 0 || !this.map) {
                    return;
                }
                this.tileManager = new TileController({
                    map: this.map,
                    app: this.app,
                    activeMapTypeID: this.activeMapTypeID
                });
                this.map.set('mapTypeControlOptions', {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                    position: google.maps.ControlPosition.TOP_LEFT,
                    mapTypeIds: this.tilesets.mapTypeIDs
                });
            },

            initDrawingManager: function () {
                this.drawingManager = new DrawingManager({
                    basemapView: this
                });
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
            },

            addEventHandlers: function () {
                //add notifications:
                console.log('adding event handlers....');
                var that = this;
                google.maps.event.addListener(this.map, "maptypeid_changed", function () {
                    that.app.vent.trigger('map-tiles-changed');
                    that.saveState();
                });
                google.maps.event.addListener(this.map, "idle", function () {
                    that.saveState();
                    that.app.vent.trigger('map-loaded');
                });
                google.maps.event.addListener(this.map, 'zoom_changed', function () {
                    that.saveState();
                });
                google.maps.event.addDomListener($('#map').get(0), 'resize', function() {
                    google.maps.event.trigger(that.map, 'resize');
                    const center = that.getCenterFromState();
                    if (center) {
                        that.map.setCenter(center);
                    }
                });
            },
            getCenterFromState: function () {
                try {
                    const state = that.app.restoreState("basemap");
                    console.log('recenter', state.center);
                    return new google.maps.LatLng(
                        state.center[1],
                        state.center[0]
                    );
                } catch (e) {
                    console.warn('No center found from state');
                    return null;
                }
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
                if (!this.tileManager || this.disableStateMemory) {
                    return;
                }
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
                if (this.tilesets.length == 0) {
                    return;
                }
                //this.restoreState();
                this.renderMap();
                this.addControls();
                this.addEventHandlers();
            },
            update: function (mapModel) {
                var location = mapModel.getDefaultLocation();
                this.setCenter(location.center);
                this.setZoom(location.zoom);
                this.setMapTypeId(mapModel.getDefaultSkin().basemap);
            }

        });

        return Basemap;
    });
