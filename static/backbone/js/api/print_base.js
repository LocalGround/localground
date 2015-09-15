/**
 * Created by zmmachar on 12/11/14.
 */
define(["underscore",
        "base-mapplication",
        "lib/printLoader",
        "collections/projects",
        "views/maps/topBar",
        "views/prints/print",
        "jquery.bootstrap"
    ],
    function (_, BaseMapplication, PrintLoader, Projects, TopBar, Print) {
        "use strict";

        var PrintBase = BaseMapplication;

        PrintBase.addRegions({
            topBarRegion: "#topbar",
            printRegion: "#print-container"

        });

        PrintBase.addInitializer(function (options) {
            options.availableProjects = new Projects();
            options.app = this;
            var printLoader = new PrintLoader(options),
                topBar = new TopBar(options),
                print = new Print(options);


            PrintBase.topBarRegion.show(topBar);
            PrintBase.printRegion.show(print);


            this.initAJAX(options);
        });

        return PrintBase;
});
