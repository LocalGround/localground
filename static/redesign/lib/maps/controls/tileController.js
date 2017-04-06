define(["lib/maps/tiles/mapbox", "lib/maps/tiles/stamen", "jquery"],
    function (MapBox, Stamen, $) {
        "use strict";
        /**
         * Class that controls the map's tile options.
         * @class TileController
         * @param {google.maps.Map} opts.map
         * A google.maps.Map object, to which the TileController
         * should be attached.
         *
         * @param {Array} opts.overlays
         * A list of available overlays, retrieved from the Local Ground Data API.
         *
         * @param {Integer} opts.activeMapTypeID
         * The tileset that should be initialized on startup.
         */
        var TileController = function (app, opts) {
            /**
             * Raw data array of map overlays, pulled from the Local Ground Data API.
             * @see <a href="//localground.org/api/0/tiles">Local Ground Data API</a>.
             */
            this.tilesets = null;
            this.app = app;
            var that = this,

                /**
                 * A google.maps.Map object
                 * @see <a href="https://developers.google.com/maps/documentation/javascript/reference#Map">Google Maps API</a>.
                 */
                map = null,

                /** @field {Array} A list of map Ids */
                mapTypeIDs = [],

                /** Lookup table of non-Google tile managers */
                typeLookup = {
                    stamen: Stamen,
                    mapbox: MapBox
                },
                getCustomStyle = function () {
                    var baseURL = "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=roadmap",
                        land = "style=feature:landscape.natural%7Celement:geometry.fill%7Cvisibility:on%7Ccolor:0xe0efef",
                        poi = "style=feature:poi%7Celement:geometry.fill%7Cvisibility:on%7Ccolor:0xc0e8e8",
                        road = "style=feature:road%7Celement:geometry%7Cvisibility:simplified%7Clightness:100",
                        all = "style=feature:all%7Celement:labels%7Cvisibility:off",
                        transit = "style=feature:transit.line%7Celement:geometry%7Clightness:700%7Cvisibility:on",
                        water = "style=feature:water%7Celement:all%7Ccolor:0x7dcdcd",
                        staticURL = [baseURL, land, poi, road, all, transit, water].join("&");
                        //extras = "&size=512x512&zoom=12&center=Berkeley";
                        //staticURLTest = staticURL + extras;
                    //console.log(staticURLTest);
                    return {
                        sourceName: "google-custom",
                        min: 1,
                        max: 20,
                        is_printable: true,
                        providerID: "roadmap",
                        id: 5,
                        typeID: 1,
                        name: "Default",
                        url: staticURL,
                        sourceID: 5,
                        type: "Base Tileset",
                        clientStyles: [
                            {
                                "featureType": "landscape.natural",
                                "elementType": "geometry.fill",
                                "stylers": [{ "visibility": "on" }, { "color": "#e0efef" }]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "geometry.fill",
                                "stylers": [{ "visibility": "on" }, { "color": "#c0e8e8" }]
                            },
                            {
                                "featureType": "road",
                                "elementType": "geometry",
                                "stylers": [{ "lightness": 100 }, { "visibility": "simplified" }]
                            },
                            {
                                "featureType": "all",
                                "elementType": "labels",
                                "stylers": [{ "visibility": "off" }]
                            },
                            {
                                "featureType": "transit.line",
                                "elementType": "geometry",
                                "stylers": [{ "lightness": 700 }, { "visibility": "on" }]
                            },
                            {
                                "featureType": "water",
                                "elementType": "all",
                                "stylers": [{ "color": "#7dcdcd" }]
                            }
                        ]
                    };
                },
                /**
                 * Initializes the tilesets for the map and adds each
                 * tileset option to the maptype control on the map.
                 * @method
                 *
                 */
                initTiles = function () {
                    //iterate through each of the user's basemap tilesets and add it to the map:
                    $.each(this.tilesets, function () {
                        var sourceName = this.sourceName.toLowerCase(),
                            MapType;
                        if (sourceName === "stamen" || sourceName === "mapbox") {
                            MapType = typeLookup[sourceName];
                            mapTypeIDs.push(this.name);
                            map.mapTypes.set(
                                this.name,
                                new MapType({
                                    styleID: this.providerID,
                                    name: this.name,
                                    max: this.max,
                                    clientStyle: this.clientStyle
                                })
                            );
                        } else if (sourceName === "google") {
                            mapTypeIDs.unshift(this.providerID);
                        } else if (sourceName === "google-custom") {
                            map.mapTypes.set(this.name,
                                new google.maps.StyledMapType(this.clientStyles, { name: this.name }));
                            mapTypeIDs.push(this.name);
                        } else {
                            alert("Error in localground.maps.TileManager: unknown map type: " + sourceName);
                        }
                    });

                    if (map.mapTypeControlOptions) {
                        //map controls may or may not be activated (but tiles still need to be initialized)
                        map.mapTypeControlOptions.mapTypeIds = mapTypeIDs;
                    }
                }.bind(this), /**
                 * @method
                 * Gets the tile information according to the key/value identifier.
                 */
                getTileInfo = function (key, value) {
                    var i = 0;
                    for (i; i < this.tilesets.length; i++) {
                        if (value.toString().toLowerCase() === this.tilesets[i][key].toString().toLowerCase()) {
                            return this.tilesets[i];
                        }
                    }
                    return null;
                }.bind(this),

                /**
                 * Initializes the TileController
                 * @method initialize
                 *
                 * @param {google.maps.Map} opts.map
                 * A google.maps.Map object, to which the TileController
                 * should be attached.
                 *
                 * @param {Array} opts.tilesets
                 * A list of available tilesets, retrieved from the Local Ground API.
                 *
                 * @param {Integer} opts.activeMapTypeID
                 * The tileset that should be initialized on startup.
                 */
                initialize = function (opts) {
                    //initialize properties:
                    this.tilesets = [
                        {"sourceName": "mapbox", "max": 19, "is_printable": true, "providerID": "streets-v10", "id": 1, "typeID": 1, "name": "Streets", "min": 1, "url": "", "sourceID": 1, "type": "Base Tileset"},
                        {"sourceName": "google", "max": 22, "is_printable": true, "providerID": "roadmap", "id": 2, "typeID": 1, "name": "Roadmap", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=roadmap&style=feature:poi.school|element:geometry|saturation:-79|lightness:75", "sourceID": 5, "type": "Base Tileset"},
                        {"sourceName": "google", "max": 22, "is_printable": true, "providerID": "hybrid", "id": 3, "typeID": 1, "name": "Hybrid", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=hybrid", "sourceID": 5, "type": "Base Tileset"},
                        {"sourceName": "google", "max": 22, "is_printable": true, "providerID": "terrain", "id": 4, "typeID": 1, "name": "Terrain", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=terrain", "sourceID": 5, "type": "Base Tileset"},
                        {"sourceName": "google", "max": 22, "is_printable": true, "providerID": "satellite", "id": 9, "typeID": 1, "name": "Satellite", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=satellite", "sourceID": 5, "type": "Base Tileset"},
                        {"sourceName": "mapbox", "max": 19, "is_printable": true, "providerID": "light-v9", "id": 12, "typeID": 1, "name": "Light", "min": 1, "url": "", "sourceID": 1, "type": "Base Tileset"},
                        {"sourceName": "mapbox", "max": 19, "is_printable": true, "providerID": "dark-v9", "id": 13, "typeID": 1, "name": "Dark", "min": 1, "url": "", "sourceID": 1, "type": "Base Tileset"},
                        {"sourceName": "stamen", "max": 20, "is_printable": false, "providerID": "watercolor", "id": 20, "typeID": 1, "name": "Watercolor", "min": 1, "url": "", "sourceID": 6, "type": "Base Tileset"}
                    ];
                    this.tilesets.push(getCustomStyle());
                    map = opts.map;

                    //initialize tiles and set the active map type
                    initTiles();
                    that.setActiveMapType(opts.activeMapTypeID);
                    this.app.vent.on('set-map-type', this.setActiveMapType.bind(this));

                }.bind(this);


            /**
             * Gets the name of the tileset by the ID.
             * @method getMapTypeNamebyId
             *
             * @param {Integer} id
             * The id of the tileset.
             * @returns {String}
             */
            this.getMapTypeNamebyId = function (id) {
                var tileInfo = getTileInfo("id", id);
                return tileInfo.name;
            };

            /**
             * Gets the tile information by the id.
             * @method getMapTypeId
             * @returns {Integer}
             */
            this.getMapTypeId = function () {
                var tileInfo = getTileInfo("name", map.getMapTypeId().toLowerCase());
                return tileInfo.id;
      
            };

            /**
             * Sets the active basemap tileset on the map. Called
             * from the HTML control.
             * @method setActiveMapType
             *
             * @param {Integer} id
             * The id of the corresponding tileset.
             */
            this.setActiveMapType = function (id) {
                if (!id) {
                    return;
                }
                var mapType = getTileInfo("id", id),
                    sourceName = null,
                    mapTypeID = null;
                if (mapType) {
                    sourceName = mapType.sourceName.toLowerCase();
                    mapTypeID = mapType.name;
                    if (sourceName === "google") {
                        mapTypeID = mapType.providerID;
                    }
                    map.setMapTypeId(mapTypeID);
                    this.app.vent.trigger("map-tiles-changed");
                }
            };


            // call on initialization:
            initialize(opts);
        };


        return TileController;
    });
