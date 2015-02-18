/**
 * Created by zmmachar on 12/11/14.
 */
define(["underscore",
        "base-mapplication",
        "views/maps/basemap",
        "views/maps/caption/caption",
        "lib/maps/data/snapshotLoader",
        "collections/projects",
        "jquery.bootstrap"
    ],
    function (_, BaseMapplication, BaseMap, CaptionManager, SnapshotLoader, Projects) {
        "use strict";

        var Mapplication = BaseMapplication;

        Mapplication.addRegions({
            mapRegion: "#map_canvas"
        });

        Mapplication.addInitializer(function (options) {
            options.projects = new Projects();
            options.app = this;
            var snapshotLoader = new SnapshotLoader(options),
                basemap = new BaseMap(_.defaults({snapshot: snapshotLoader.snapshot}, options));
            this.map = basemap.map;
            Mapplication.mapRegion.show(basemap);

            this.initAJAX(options);
        });

        return Mapplication;
    });