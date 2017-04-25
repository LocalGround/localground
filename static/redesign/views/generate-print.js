define(["jquery",
        "marionette",
        "handlebars",
        "lib/modals/modal",
        "lib/maps/basemap",
        "views/print-options",
        "text!../templates/print-layout.html"
    ],
    function ($, Marionette, Handlebars, Modal,
              Basemap, PrintOptions, PrintLayoutTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var GeneratePrintLayout = Marionette.LayoutView.extend({
            template: Handlebars.compile(PrintLayoutTemplate),

            basemapView: null,
            printOptions: null,

            initialize: function (opts) {
                /*This Layout View relies on a Map model which gets set from the change-map event,
                which is triggered from the select-map-view.js */
                this.app = opts.app;
                this.render();
                //this.showBasemap();
            },

            onShow: function(){
                console.log("Showing");
                this.showBasemap();
                this.showPrintOptions();
            },

            events: {
                'click .print-button': "showModal"
            },

            regions: {
                regionLeft: ".print-layout-left",
                regionRight: ".print-layout-right"
            },

            showPrintOptions: function(){
                this.printOptions = new PrintOptions({
                    app: this.app
                });
                this.regionLeft.show(this.printOptions);
            },

            showBasemap: function () {
                var that = this;
                this.basemapView = new Basemap({
                    app: this.app,
                    showSearchControl: false, // added for rosa parks pilot
                    minZoom: 13, // added for rosa parks pilot
                    mapID: "print_map"
                });
                this.regionRight.show(this.basemapView);
                setTimeout(function () {
                    google.maps.event.trigger(that.app.map, 'resize');
                }, 100);
            },

            onRender: function () {
                // only load views after the LayoutView has
                // been rendered to the screen:

                /*
                var sv, lv, skv, ps;
                sv = new SelectMapView({ app: this.app });
                this.menu.show(sv);

                lv = new LayerListView({ app: this.app });
                this.layers.show(lv);

                skv = new SkinView({ app: this.app });
                this.skins.show(skv);

                ps = new PanelStylesView({ app: this.app });
                this.styles.show(ps);
                */
            },

            callMakePrint: function(){
                this.printOptions.makePrint();
            }

        });
        return GeneratePrintLayout;
    });
