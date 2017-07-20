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
            showDropdownControl: true,
            activeMapTypeID: 1,
            minZoom: 1,
            maxZoom: 22,
            disableStateMemory: false,
            activeModel: null,
            addMarkerClicked: false,
            targetedModel: null,
            tileManager: null,
            userProfile: null,
            //todo: populate this from user prefs:
            defaultLocation: {
                zoom: 15,
                center: { lat: -34, lng: 151 }
            },
            //el: '#map',
            template: false,

            initialize: function (opts) {
                this.opts = opts;
                $.extend(this, opts);
                this.mapID = this.mapID || 'map';
                this.restoreState();
                this.tilesets = this.app.dataManager.tilesets;
                this.listenTo(this.tilesets, 'reset', this.onShow);
                Marionette.View.prototype.initialize.call(this);
                this.render();
                this.listenTo(this.app.vent, 'highlight-marker', this.doHighlight);
                this.listenTo(this.app.vent, 'add-new-marker', this.activateMarker);
                this.listenTo(this.app.vent, 'delete-marker', this.deleteMarker);
                //this.listenTo(this.app.vent, 'tiles-loaded', this.showMapTypesDropdown);
                this.listenTo(this.app.vent, 'place-marker', this.placeMarkerOnMapXY);
                this.listenTo(this.app.vent, 'add-rectangle', this.initDrawingManager);
            },

            point2LatLng: function (point) {
                var topRight, bottomLeft, scale, worldPoint, offset;
                offset = this.$el.offset();
                point.x -= offset.left;
                point.y -= offset.top;
                topRight = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getNorthEast());
                bottomLeft = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getSouthWest());
                scale = Math.pow(2, this.map.getZoom());
                worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
                return this.map.getProjection().fromPointToLatLng(worldPoint);
            },
            initDrawingManager: function () {
                var that = this;
                this.drawingManager = new google.maps.drawing.DrawingManager({
                    drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
                    drawingControl: false,
                    markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
                    rectangleOptions: {
                        strokeColor: '#ed867d',
                        fillColor: '#ed867d',
                        fillOpacity: 0,
                        strokeWeight: 4,
                        clickable: false,
                        editable: true,
                        zIndex: 1
                    }
                });
                google.maps.event.addListener(this.drawingManager, 'rectanglecomplete', function (rect) {
                    rect.setOptions({ editable: false });
                    that.drawingManager.setDrawingMode(null);
                    var getGeoJSONFromBounds = function (r) {
                            var bounds = r.getBounds().toJSON(),
                                north = bounds.north,
                                south = bounds.south,
                                east = bounds.east,
                                west = bounds.west;
                            return {
                                "type": "Polygon",
                                "coordinates": [[
                                    [east, north], [east, south], [west, south], [west, north], [east, north]
                                ]]
                            };
                        },
                        r = getGeoJSONFromBounds(rect);
                    rect.setMap(null);
                    that.targetedModel.set("geometry", r);
                    that.targetedModel.trigger('show-marker');
                    that.addMarkerClicked = false;
                    that.targetedModel = null;
                    that.drawingManager.setMap(null);
                    $('body').css({ cursor: 'auto' });
                });
                this.drawingManager.setMap(this.map);
            },

            doHighlight: function (model) {
                if (this.activeModel) {
                    this.activeModel.set("active", false);
                }
                this.activeModel = model;
            },

            placeMarkerOnMapXY: function (point) {
                var location = this.point2LatLng(point);
                this.placeMarkerOnMap(location);
            },

            // If the add marker button is clicked, allow user to add marker on click
            // after the marker is placed, disable adding marker and hide the "add marker" div
            placeMarkerOnMap: function (location) {
                if (!this.addMarkerClicked) {
                    console.log('returning!');
                    return;
                }
                console.log(this.targetedModel);
                if (!this.targetedModel.get("id")) {
                    this.app.vent.trigger('save-model');
                    this.targetedModel.collection.add(this.targetedModel);
                }
                this.targetedModel.setPointFromLatLng(location.lat(), location.lng());
                this.targetedModel.trigger('show-marker');
                this.targetedModel.save();
                this.addMarkerClicked = false;
                this.targetedModel = null;
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

            activateMarker: function (model) {
                this.addMarkerClicked = true;
                this.targetedModel = model;
            },

            deleteMarker: function (model) {
                //model.trigger('hide-marker');
                model.set("geometry", null);
                model.save();
            },

            renderMap: function () {
                var mapOptions = {
                    scrollwheel: false,
                    minZoom: this.minZoom,
                    streetViewControl: true,
                    //scaleControl: true,
                    panControl: false,
                    zoomControlOptions: this.zoomControlOptions || {
                        style: google.maps.ZoomControlStyle.SMALL
                    },
                    mapTypeControl: this.showDropdownControl,
                    //mapTypeId: this.activeMapTypeID,
                    rotateControlOptions: this.rotateControlOptions,
                    streetViewControlOptions: this.streetViewControlOptions,
                    zoom: this.defaultLocation.zoom,
                    center: this.defaultLocation.center
                };

                if (!this.$el.find("#" + this.mapID).get(0)) {
                    this.$el.append($('<div id="' + this.mapID + '"></div>'));
                }

                this.app.map = this.map = new google.maps.Map(document.getElementById(this.mapID),
                    mapOptions);
                this.initTileManager();
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
                var that = this;
                google.maps.event.addListener(this.map, "maptypeid_changed", function () {
                    that.app.vent.trigger('map-tiles-changed');
                    that.saveState();
                });
                google.maps.event.addListener(this.map, "idle", function () {
                    that.saveState();
                });
                google.maps.event.addListener(this.map, 'zoom_changed', function () {
                    that.saveState();
                });

                google.maps.event.addListener(this.map, 'click', function (event) {
                    that.placeMarkerOnMap(event.latLng);
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
                this.restoreState();
                this.renderMap();
                this.addControls();
                this.addEventHandlers();
            }

        });

        return Basemap;
    });
