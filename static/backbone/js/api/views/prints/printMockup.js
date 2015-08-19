define(["marionette",
        "underscore",
        "jquery",
        "views/maps/basemap",
        "text!" + templateDir + "/prints/printMockup.html"
    ],
    function (Marionette,
              _,
              $,
              BaseMap,
              printMockupTemplate) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * print mockup
         * @class PrintMockup
         */ 
        var PrintMockup = Marionette.LayoutView.extend({
            /**
             * @lends localground.prints.views.PrintMockup#
             */
            template: function () {
                return _.template(printMockupTemplate);
            },

            tagName: 'div',
            id: 'print-mockup',

            events: {
                
            },
            regions: {
                mapRegion: "#print-map-canvas",
            },
            /**
             * Initializes the printMockup
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.collection = opts.projects;
            },

            onShow: function () {
                var basemap = new BaseMap(this.opts);
                this.app.map = basemap.map;
                this.mapRegion.show(basemap);
            }
                
        });
        return PrintMockup;
    });
