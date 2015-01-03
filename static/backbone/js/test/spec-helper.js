define(
    [
        "collections/photos",
        "collections/audio",
        "collections/mapimages",
        "collections/markers",
        "collections/records",
        "models/photo",
        "models/marker",
        "models/audio",
        "models/record",
        "models/mapimage"
    ],
    function (Photos, AudioFiles, MapImages, Markers, Records, Photo, Marker, Audio, Record, MapImage) {
        'use strict';
        beforeEach(function () {
            /**
             * Adding some dummy data for testing convenience.
             * Availabe to all of the tests.
             */
            this.photos = new Photos([
                new Photo({ id: 1, name: "Cat", tags: 'animal, cat, cute'}),
                new Photo({id: 2, name: "Dog", tags: 'animal, dog'}),
                new Photo({id: 3, name: "Frog", tags: 'animal, amphibian, cute'})
            ]);
            this.audio = new AudioFiles([
                new Audio({ id: 1, name: "Nirvana", tags: '90s, grunge'}),
                new Audio({id: 2, name: "Duran Duran", tags: '80s, amazing'}),
                new Audio({id: 3, name: "Flo Rida", tags: 'florida, hip hop'})
            ]);
            this.map_images = new MapImages([
                new MapImage({ id: 1, name: "Map 1", tags: 'parks, oakland'}),
                new MapImage({id: 2, name: "Map 2", tags: 'parks, berkeley'}),
                new MapImage({id: 3, name: "Map 3", tags: 'emeryville'})
            ]);
            this.markers = new Markers([
                new Marker({ id: 1, name: "POI 1", tags: 'my house'}),
                new Marker({id: 2, name: "POI 2", tags: 'friend\'s house'}),
                new Marker({id: 3, name: "POI 3", tags: 'coffee shop'})
            ]);
            this.records = new Records([
                new Record({ id: 1, team_name: "Blue team", tags: 'my house', worm_count: 4 }),
                new Record({id: 2, team_name: "Green team", tags: 'friend\'s house', worm_count: 8 }),
                new Record({id: 3, team_name: "Red team", tags: 'coffee shop', worm_count: 2 })
            ], { 'url': 'dummy/url' });

            this.dataDictionary = {
                records: this.records,
                photos: this.photos,
                audio: this.audio,
                map_images: this.map_images,
                markers: this.markers
            };
        });
    }
);