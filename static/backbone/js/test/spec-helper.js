define(
    [
        "backbone",
        "jquery",
        "lib/appUtilities",
        "lib/maps/data/dataManager",
        "lib/maps/data/snapshotLoader",
        "collections/projects",
        "collections/photos",
        "collections/audio",
        "collections/mapimages",
        "collections/markers",
        "collections/records",
        "collections/layers",
        "models/project",
        "models/photo",
        "models/marker",
        "models/audio",
        "models/record",
        "models/mapimage",
        "models/layer"
    ],
    function (Backbone, $, appUtilities, DataManager, SnapshotLoader,
              Projects, Photos, AudioFiles, MapImages, Markers, Records, Layers,
              Project, Photo, Marker, Audio, Record, MapImage, Layer) {
        'use strict';
        beforeEach(function () {
            var $map_container = $('<div id="map_canvas"></div>');
            $(document.body).append($map_container);

            /**
             * Adds some dummy data for testing convenience.
             * Availabe to all of the tests.
             */
            // SAFETY MEASURE: makes sure that nothing interacts w/database.
            spyOn($, 'ajax').and.callFake(function () {
                console.log("AJAX call intercepted.");
            });

            this.getModelByOverlayType = function (overlay_type) {
                var model;
                if (overlay_type == "map-image") {
                    model = this.map_images.at(0);
                } else if (overlay_type == "photo") {
                    model = this.photos.at(0);
                } else if (overlay_type == "audio") {
                    model = this.audio.at(0);
                } else if (overlay_type == "marker") {
                    model = this.markers.at(0);
                } else if (overlay_type == "record") {
                    model = this.records.at(0);
                } else if (overlay_type == "layer") {
                    model = this.layers.at(0);
                }
                return model;
            };

            /**
             * Adds some dummy data for testing convenience.
             * Availabe to all of the tests.
             */
            this.photos = new Photos([
                new Photo({ id: 1, name: "Cat", tags: 'animal, cat, cute, tag1', project_id: 1, overlay_type: "photo", caption: "Caption1", owner: "Owner1", attribution: "Owner1",
                    geometry: {"type": "Point", "coordinates": [-122.294, 37.864]},
                    path_small: '//:0', path_medium: "//:0", path_large: "//:0", path_medium_sm: '//:0', path_marker_sm: '//:0' }),
                new Photo({id: 2, name: "Dog", tags: 'animal, dog', project_id: 1, overlay_type: "photo", caption: "Caption1", owner: "Owner1", attribution: "Owner1", geometry: { type: "Point", coordinates: [-122.2943, 37.8645] }, path_medium_sm: '//:0', path_marker_sm: '//:0' }),
                new Photo({id: 3, name: "Frog", tags: 'animal, amphibian, cute, frog', project_id: 1, overlay_type: "photo", caption: "Caption1", owner: "Owner1", attribution: "Owner1", geometry: { type: "Point", coordinates: [-122.2943, 37.8645] }, path_medium_sm: '//:0', path_marker_sm: '//:0' })
            ]);
            this.audio = new AudioFiles([
                new Audio({ id: 1, name: "Nirvana", tags: '90s, grunge', project_id: 1, overlay_type: "audio", caption: "Caption1", geometry: {"type": "Point", "coordinates": [-122.294, 37.864]} }),
                new Audio({id: 2, name: "Duran Duran", tags: '80s, amazing, tag1', project_id: 1, overlay_type: "audio" }),
                new Audio({id: 3, name: "Flo Rida", tags: 'florida, hip hop', project_id: 1, overlay_type: "audio" })
            ]);
            this.map_images = new MapImages([
                new MapImage({ id: 1, name: "Map 1", tags: 'parks, oakland', project_id: 3, caption: "Caption1", overlay_type: "map-image", geometry: { type: "Polygon", coordinates: [[[ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ], [ -82.54, 35.62 ]]]} }),
                new MapImage({id: 2, name: "Map 2", tags: 'parks, berkeley, tag1', project_id: 3, overlay_type: "map-image" }),
                new MapImage({id: 3, name: "Map 3", tags: 'emeryville', project_id: 3, overlay_type: "map-image" })
            ]);
            this.markers = new Markers([
                new Marker({ id: 1, name: "POI 1", tags: 'my house', project_id: 2, overlay_type: "marker", caption: "Caption1", color: "FF0000", geometry: {"type": "Point", "coordinates": [-122.294, 37.864]} }),
                new Marker({id: 2, name: "POI 2", tags: 'friend\'s house, tag1', project_id: 2, overlay_type: "marker" }),
                new Marker({id: 3, name: "POI 3", tags: 'coffee shop, tag1', project_id: 2, overlay_type: "marker" })
            ]);
            this.records = new Records([
                new Record({ id: 1, team_name: "Blue team", display_name: "Blue team", tags: 'my house', worm_count: 4, project_id: 2, overlay_type: "record", geometry: {"type": "Point", "coordinates": [-122.294, 37.864]} }),
                new Record({id: 2, team_name: "Green team", tags: 'friend\'s house, tag1', worm_count: 8, project_id: 2, overlay_type: "record" }),
                new Record({id: 3, team_name: "Red team", tags: 'coffee shop', worm_count: 2, project_id: 2, overlay_type: "record" })
            ], { 'url': 'dummy/url' });
            this.layers = new Layers([
                new Layer({id: 1, name: "worms", overlay_type: "layer", symbols: [
                    { color: "#7075FF", width: 30, rule: "worms > 0", title: "At least 1 worm" },
                    { color: "#F011D9", width: 30, rule: "worms = 0", title: "No worms" }
                ]}),
                new Layer({id: 2, name: "pets", overlay_type: "layer", symbols: [
                    { color: "#F00", width: 20, rule: "tags contains cat", title: "Cats" },
                    { color: "#0F0", width: 20, rule: "tags contains dog", title: "Dogs" }
                ]}),
                new Layer({id: 3, name: "frogs", overlay_type: "layer", symbols: [
                    { color: "#00F", width: 20, rule: "tags contains frog", title: "Frogs" }
                ]})
            ]);

            this.dataDictionary = {
                records: this.records,
                photos: this.photos,
                audio: this.audio,
                map_images: this.map_images,
                markers: this.markers
            };

            this.projectsLite = new Projects([
                new Project({ id: 1, name: "Project 1", overlay_type: "project" }),
                new Project({ id: 2, name: "Project 2", overlay_type: "project" }),
                new Project({ id: 3, name: "Project 3", overlay_type: "project" }),
                new Project({ id: 4, name: "Project 4", overlay_type: "project" }),
                new Project({ id: 5, name: "Project 5", overlay_type: "project" })
            ]);

            this.projects = new Projects([
                new Project({ id: 1, name: "Project 1", tags: 'tag1, tag2', overlay_type: "project",
                    children: {
                        photos: {
                            name: "Photos",
                            id: "photos",
                            overlay_type: "photo",
                            data: this.photos.toJSON()
                        },
                        audio: {
                            name: "Audio",
                            id: "audio",
                            overlay_type: "audio",
                            data: this.audio.toJSON()
                        },
                        map_images: {
                            name: "Map-Images",
                            id: "map-images",
                            overlay_type: "map-image",
                            data: this.map_images.toJSON()
                        }
                    }}),
                new Project({ id: 2, name: "Project 2", tags: 'tag3, tag2', overlay_type: "project",
                    children: {
                        form_1: {
                            name: "Soil Form",
                            id: "form_1",
                            overlay_type: "record",
                            data: this.records.toJSON()
                        },
                        markers: {
                            name: "Markers",
                            id: "markers",
                            overlay_type: "marker",
                            data: this.markers.toJSON()
                        }
                    }})
            ]);
            this.tilesets = [
                {"sourceName": "mapbox", "max": 19, "is_printable": true, "providerID": "lg.i1p5alka", "id": 1, "typeID": 1, "name": "Mapnik", "min": 1, "url": "", "sourceID": 1, "type": "Base Tileset"},
                {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "roadmap", "id": 2, "typeID": 1, "name": "Roadmap", "min": 1, "url": "//maps.google.com/maps/api/staticmap?sensor=false&maptype=roadmap&style=feature:poi.school|element:geometry|saturation:-79|lightness:75", "sourceID": 5, "type": "Base Tileset"},
                {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "hybrid", "id": 3, "typeID": 1, "name": "Hybrid", "min": 1, "url": "//maps.google.com/maps/api/staticmap?sensor=false&maptype=hybrid", "sourceID": 5, "type": "Base Tileset"},
                {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "terrain", "id": 4, "typeID": 1, "name": "Terrain", "min": 1, "url": "//maps.google.com/maps/api/staticmap?sensor=false&maptype=terrain", "sourceID": 5, "type": "Base Tileset"},
                {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "satellite", "id": 9, "typeID": 1, "name": "Satellite", "min": 1, "url": "//maps.google.com/maps/api/staticmap?sensor=false&maptype=satellite", "sourceID": 5, "type": "Base Tileset"},
                {"sourceName": "mapbox", "max": 19, "is_printable": true, "providerID": "lg.i1p2e2cf", "id": 12, "typeID": 1, "name": "Grayscale", "min": 1, "url": "", "sourceID": 1, "type": "Base Tileset"},
                {"sourceName": "stamen", "max": 20, "is_printable": false, "providerID": "watercolor", "id": 20, "typeID": 1, "name": "Watercolor", "min": 1, "url": "", "sourceID": 6, "type": "Base Tileset"}
            ];
            this.mapEditorInitializationParams = {
                defaultLocation: {
                    center: new google.maps.LatLng(21.698265, 14.765625),
                    zoom: 11
                },
                mapContainerID: "map_canvas",
				includeSearchControl: true,
				includeGeolocationControl: true,
                includeAudioControl: true,
				activeMapTypeID: 12,
				tilesets: this.tilesets
            };

            this.snapshot = {
                access: "Public (everyone)",
                basemap: 12,
                center: { type: "Point", coordinates: [-122, 37] },
                caption: "This is a cool caption for cool, humble people",
                entities: [ { ids: [ 19 ], overlay_type: "photo" } ],
                children: {
                    photos: {
                        overlay_type: "photo",
                        data: [
                            {
                                id: 19,
                                name: "Tree with Bird",
                                caption: "",
                                overlay_type: "photo",
                                tags: "tree, napali coast",
                                project_id: 1,
                                geometry: { type: "Point", coordinates: [-122, 37] }
                            }
                        ],
                        id: "photos",
                        name: "Photos"
                    }
                },
                id: 3,
                name: "Napali Coast",
                overlay_type: "view",
                owner: "vanwars",
                slug: "Njk3OTQyNTI3LjI0Mzg2NzU-",
                tags: "",
                url: "/api/0/views/1/",
                zoom: 18
            };

            //initialize this.app:
            this.app = _.extend({}, appUtilities);
            this.map = {
                fitBounds: function () {},
                setCenter: function () {}
            };
            _.extend(this.app, {
                vent: _.extend({}, Backbone.Events),
                activeProjectID: this.projects.models[0].id,
                map: this.map, //a light stand-in for a Google Map, to speed it up; save our API calls.
                getMap: function () {
                    return this.map;
                }
            });

            this.spreadsheetApp = {
                router: null,
                activeTableID: null
            };

            //initialize dataManager:
            this.dataManager = new DataManager({
                app: this.app,
                availableProjects: this.projectsLite
            });
            //give the app a reference to the dataManager (for convenience);
            _.extend(this.app, { dataManager: this.dataManager });
        });
    }
);

