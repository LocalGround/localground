define(["jquery",
        "marionette",
        "handlebars",
        "lib/modals/modal",
        "lib/maps/basemap",
        "models/print",
        "views/generate-print",
        "text!../templates/print-options.html"
    ],
    function ($, Marionette, Handlebars, Modal,
              BaseMap, Print, GeneratePrint, PrintOptionsTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var PrintOptions = Marionette.ItemView.extend({
            template: Handlebars.compile(PrintOptionsTemplate),

            basemapView: null,

            initialize: function (opts) {
                /*This Layout View relies on a Map model which gets set from the change-map event,
                which is triggered from the select-map-view.js */
                this.app = opts.app;
                this.model = new Print();
                this.render();
                this.basemapView = this.app.basemapView; // Let's try this for now....
                //this.showBasemap();
            },

            makePrint: function(){
                alert("Call Generate Print");
                // Todo: Make the new map based on the current data stored on the map.
                //basemapView.setZoom();
                //basemapView.setCenter();
                //basemapView.setMapTypeId();

                // Let's test this rough draft
                // Will be tweaked later
                var printMap = new Print();
                printMap.set("center", this.basemapView.getCenter());
                printMap.set("zoom", this.basemapView.getZoom());
                printMap.set("mapTypeId", this.basemapView.getMapTypeId());
                printMap.save();

            }
        });
        return PrintOptions;
});
