define(
    [
        "backbone",
        "lib/appUtilities",
        "lib/maps/data/dataManager",
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
    function (Backbone, appUtilities, DataManager,
              Projects, Photos, AudioFiles, MapImages, Markers, Records, Layers,
              Project, Photo, Marker, Audio, Record, MapImage, Layer) {
        'use strict';
        beforeEach(function () {
            /**
             * Adds some dummy data for testing convenience.
             * Availabe to all of the tests.
             */
            this.photos = new Photos([
                new Photo({ id: 1, name: "Cat", tags: 'animal, cat, cute, tag1', project_id: 1 }),
                new Photo({id: 2, name: "Dog", tags: 'animal, dog', project_id: 1 }),
                new Photo({id: 3, name: "Frog", tags: 'animal, amphibian, cute, frog', project_id: 1 })
            ]);
            this.audio = new AudioFiles([
                new Audio({ id: 1, name: "Nirvana", tags: '90s, grunge', project_id: 1 }),
                new Audio({id: 2, name: "Duran Duran", tags: '80s, amazing, tag1', project_id: 1 }),
                new Audio({id: 3, name: "Flo Rida", tags: 'florida, hip hop', project_id: 1 })
            ]);
            this.map_images = new MapImages([
                new MapImage({ id: 1, name: "Map 1", tags: 'parks, oakland', project_id: 3 }),
                new MapImage({id: 2, name: "Map 2", tags: 'parks, berkeley, tag1', project_id: 3 }),
                new MapImage({id: 3, name: "Map 3", tags: 'emeryville', project_id: 3 })
            ]);
            this.markers = new Markers([
                new Marker({ id: 1, name: "POI 1", tags: 'my house', project_id: 2 }),
                new Marker({id: 2, name: "POI 2", tags: 'friend\'s house, tag1', project_id: 2 }),
                new Marker({id: 3, name: "POI 3", tags: 'coffee shop, tag1', project_id: 2 })
            ]);
            this.records = new Records([
                new Record({ id: 1, team_name: "Blue team", tags: 'my house', worm_count: 4, project_id: 2  }),
                new Record({id: 2, team_name: "Green team", tags: 'friend\'s house, tag1', worm_count: 8, project_id: 2  }),
                new Record({id: 3, team_name: "Red team", tags: 'coffee shop', worm_count: 2, project_id: 2  })
            ], { 'url': 'dummy/url' });
            this.layers = new Layers([
                new Layer({id: 1, name: "worms", symbols: [
                    { color: "#7075FF", width: 30, rule: "worms > 0", title: "At least 1 worm" },
                    { color: "#F011D9", width: 30, rule: "worms = 0", title: "No worms" }
                ]}),
                new Layer({id: 2, name: "pets", symbols: [
                    { color: "#F00", width: 20, rule: "tags contains cat", title: "Cats" },
                    { color: "#0F0", width: 20, rule: "tags contains dog", title: "Dogs" }
                ]}),
                new Layer({id: 3, name: "frogs", symbols: [
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
                new Project({ id: 1, name: "Project 1" }),
                new Project({ id: 2, name: "Project 2" }),
                new Project({ id: 3, name: "Project 3" }),
                new Project({ id: 4, name: "Project 4" }),
                new Project({ id: 5, name: "Project 5" })
            ]);

            this.projects = new Projects([
                new Project({ id: 1, name: "Project 1", tags: 'tag1, tag2',
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
                        }
                    }}),
                new Project({ id: 2, name: "Project 2", tags: 'tag3, tag2',
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

            this.mapEditorInitializationParams = {
                defaultLocation: {
                    center: new google.maps.LatLng(21.698265, 14.765625),
                    zoom: 11
                },
                mapContainerID: "map_canvas",
				includeSearchControl: true,
				includeGeolocationControl: false,
                includeAudioControl: true,
				activeMapTypeID: 12,
				tilesets: [
                    {"sourceName": "mapbox", "max": 19, "is_printable": true, "providerID": "lg.i1p5alka", "id": 1, "typeID": 1, "name": "Mapnik", "min": 1, "url": "", "sourceID": 1, "type": "Base Tileset"},
                    {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "roadmap", "id": 2, "typeID": 1, "name": "Roadmap", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=roadmap&style=feature:poi.school|element:geometry|saturation:-79|lightness:75", "sourceID": 5, "type": "Base Tileset"},
                    {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "hybrid", "id": 3, "typeID": 1, "name": "Hybrid", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=hybrid", "sourceID": 5, "type": "Base Tileset"},
                    {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "terrain", "id": 4, "typeID": 1, "name": "Terrain", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=terrain", "sourceID": 5, "type": "Base Tileset"},
                    {"sourceName": "google", "max": 20, "is_printable": true, "providerID": "satellite", "id": 9, "typeID": 1, "name": "Satellite", "min": 1, "url": "http://maps.google.com/maps/api/staticmap?sensor=false&maptype=satellite", "sourceID": 5, "type": "Base Tileset"},
                    {"sourceName": "mapbox", "max": 19, "is_printable": true, "providerID": "lg.i1p2e2cf", "id": 12, "typeID": 1, "name": "Grayscale", "min": 1, "url": "", "sourceID": 1, "type": "Base Tileset"},
                    {"sourceName": "stamen", "max": 20, "is_printable": false, "providerID": "watercolor", "id": 20, "typeID": 1, "name": "Watercolor", "min": 1, "url": "", "sourceID": 6, "type": "Base Tileset"}
                ]
            };

            this.app = _.extend({}, appUtilities);
            _.extend(this.app, {
                vent: _.extend({}, Backbone.Events)
            });

            this.dataManager = new DataManager({
                app: this.app,
                availableProjects: this.projectsLite
            });
        });
    }
);