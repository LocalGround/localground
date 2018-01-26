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
            activeMapTypeID: 7,
            minZoom: 1,
            maxZoom: 22,
            mapID: 'map',
            disableStateMemory: false,
            activeModel: null,
            addMarkerClicked: false,
            targetedModel: null,
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
                this.tilesets = this.app.dataManager.tilesets;
                this.restoreState();
                $.extend(this, opts);

                //add event listeners:
                this.listenTo(this.tilesets, 'reset', this.onShow);
                this.listenTo(this.app.vent, 'highlight-marker', this.doHighlight);
                this.listenTo(this.app.vent, 'add-new-marker', this.activateMarker);
                this.listenTo(this.app.vent, 'show-streetview', this.showStreetView);
                this.listenTo(this.app.vent, 'hide-streetview', this.hideStreetView);
                
                // for adding points, lines, polygons, and rectangles to the map:
                this.listenTo(this.app.vent, 'place-marker', this.placeMarkerOnMapXY);
                this.listenTo(this.app.vent, 'add-rectangle', this.initRectangleMode);
                this.listenTo(this.app.vent, 'add-polyline', this.initPolylineMode);
                this.listenTo(this.app.vent, 'add-polygon', this.initPolygonMode);

                // call parent:
                Marionette.View.prototype.initialize.call(this);
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

            initRectangleMode: function() {
                this.initDrawingManager(google.maps.drawing.OverlayType.RECTANGLE);
            },
            initPolylineMode: function() {
                this.initDrawingManager(google.maps.drawing.OverlayType.POLYLINE);
            },
            initPolygonMode: function() {
                this.initDrawingManager(google.maps.drawing.OverlayType.POLYGON);
            },
            initDrawingManager: function (drawingMode) {
                var that = this;
                if (this.drawingManager) {
                    this.drawingManager.setMap(this.map);
                    this.drawingManager.setDrawingMode(drawingMode);
                    return;
                }
                this.drawingManager = new google.maps.drawing.DrawingManager({
                    drawingMode: drawingMode,
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
                google.maps.event.addListener(this.drawingManager, 'polygoncomplete', function (polygon) {
                    // see line 161 ish
                    // 1. look for helper functions to convert to geojson
                    // 2. set geometry on model 
                    // 3. then save() it.
                    console.log('polygon complete', polygon.getPath());
                    const polygonToGeoJSON = (polygon) => {
                        var pathCoords = polygon.getPath().getArray(),
                            coords = [],
                            i = 0;
                        for (i; i < pathCoords.length; i++) {
                            coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
                        }
                        //add last coordinate again:
                        coords.push([pathCoords[0].lng(), pathCoords[0].lat()]);
                        return { type: 'Polygon', coordinates: [coords] };
                    };
                    const polygonGeoJSON = polygonToGeoJSON(polygon);
                    that.targetedModel.set('geometry', polygonGeoJSON);
                    //that.targetedModel.trigger('show-marker');
                    that.targetedModel.save();
                    that.addMarkerClicked = false;
                    that.targetedModel = null;
                    console.log(polygonGeoJSON);
                });
                google.maps.event.addListener(this.drawingManager, 'polylinecomplete', function (polyline) {
                    console.log('polyline complete');
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
                    return;
                }
                this.targetedModel.trigger('commit-data-no-save');
                if (!this.targetedModel.get("id")) {
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
                    center: this.center || this.defaultLocation.center
                };

                if (!this.$el.find("#" + this.mapID).get(0)) {
                    this.$el.append($('<div id="' + this.mapID + '"></div>'));
                }

                this.app.map = this.map = new google.maps.Map(document.getElementById(this.mapID),
                    mapOptions);
                //setTimeout(function () {
                //    $("#map").css({"position": "fixed"});
                //s}, 500);                
                this.initTileManager();
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
                //this.restoreState();
                this.renderMap();
                this.addControls();
                this.addEventHandlers();
            }

        });

        return Basemap;
    });
