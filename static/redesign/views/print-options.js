define(["jquery",
        "marionette",
        "handlebars",
        "lib/modals/modal",
        "lib/maps/basemap",
        "text!../templates/print-layout.html"
    ],
    function ($, Marionette, Handlebars, Modal,
              Basemap, PrintLayoutTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var PrintOptions = Marionette.LayoutView.extend({
            template: Handlebars.compile(PrintLayoutTemplate),

            basemapView: null,

            initialize: function (opts) {
                /*This Layout View relies on a Map model which gets set from the change-map event,
                which is triggered from the select-map-view.js */
                this.app = opts.app;
                this.render();
                //this.showBasemap();
            }
        });
        return PrintOptions;
    });
