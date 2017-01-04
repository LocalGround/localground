define(["marionette",
        "handlebars",
        "text!../templates/left-panel-layout.html"
    ],
    function (Marionette, Handlebars, LeftPanelLayoutTemplate) {
        'use strict';
        /**
         * A class that handles the basic Google Maps functionality,
         * including tiles, search, and setting the default location.
         * @class Basemap
         */
        var LeftPanelLayout = Marionette.LayoutView.extend({
            template: Handlebars.compile(LeftPanelLayoutTemplate),
            initialize: function (opts) {
                this.app = opts.app;
            },
            regions: {
                menu: "#map_dropdown_region",
                layers: "#layers_region",
                skins: "#map_skin_region",
                styles: "#global_style_region"
            }

        });
        return LeftPanelLayout;
    });