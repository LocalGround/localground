define(["jquery",
        "marionette",
        "handlebars",
        "lib/modals/modal",
        "lib/maps/basemap",
        "views/print-options",
        "models/print",
        "text!../templates/print-layout.html"
    ],
    function ($, Marionette, Handlebars, Modal,
              Basemap, PrintOptions, Print, PrintLayoutTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var GeneratePrintLayout = Marionette.LayoutView.extend({
            template: Handlebars.compile(PrintLayoutTemplate),

            className: "grey-bg",

            basemapView: null,
            printOptions: null,

            initialize: function (opts) {
                /*This Layout View relies on a Map model which gets set from the change-map event,
                which is triggered from the select-map-view.js */
                this.app = opts.app;
                this.render();
                this.listenTo(this.app.vent, "show-print-generate-message", this.displayLoad);
                this.listenTo(this.app.vent, "hide-print-generate-message", this.hideLoad);
            },

            onShow: function(){
                //console.log("Showing");
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

            callMakePrint: function(){
                this.printOptions.makePrint();
            },
            
            displayLoad: function(){
                this.$el.find(".load-message").show();
            },

            hideLoad: function(){
                this.$el.find(".load-message").hide();
            }

        });
        return GeneratePrintLayout;
    });
