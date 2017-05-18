define(["marionette",
        "handlebars",
        "lib/maps/basemap",
        "views/print-options",
        "lib/maps/marker-overlays",
        "lib/maps/overlays/icon",
        "text!../templates/print-layout.html"
    ],
    function (Marionette, Handlebars, Basemap, PrintOptions, MarkerOverlays, Icon, PrintLayoutTemplate) {
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

            onShow: function () {
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

            showPrintOptions: function () {
                this.printOptions = new PrintOptions({
                    app: this.app,
                    parent: this
                });
                this.regionLeft.show(this.printOptions);
            },
            showStyles: function () {
                console.log("show styles");
            },
            showMarkerOverlays: function () {
                var i,
                    overlays,
                    key,
                    entry,
                    dm = this.app.dataManager,
                    dataSources = dm.getDataSources();
                for (i = 0; i < dataSources.length; i++) {
                    key = dataSources[i].value;
                    entry = dm.getData(key);
                    if (entry.collection.length === 0) { continue; }
                    overlays = new MarkerOverlays({
                        collection: entry.collection,
                        app: this.app,
                        map: this.basemapView.map,
                        dataType: entry.collection.key,
                        isShowing: true,
                        startVisible: true,
                        _icon: new Icon({ shape: entry.collection.key })
                    });
                }
                console.log("show overlays");
            },

            showBasemap: function () {
                var that = this;
                // Used timeout to delay map rendering until modal completely 
                // opens. Otherwise, the map doesn't center correctly.
                setTimeout(function () {
                    that.basemapView = new Basemap({
                        app: that.app,
                        showSearchControl: false, // added for rosa parks pilot
                        mapID: "print_map",
                        disableStateMemory: true
                    });
                    that.regionRight.show(that.basemapView);
                    that.showMarkerOverlays();

                    setTimeout(function () {
                        google.maps.event.trigger(that.app.map, 'resize');
                    }, 100);
                }, 100);
            },

            callMakePrint: function () {
                this.printOptions.makePrint();
            },

            displayLoad: function () {
                this.$el.find(".load-message").show();
            },

            hideLoad: function () {
                this.$el.find(".load-message").hide();
            }

        });
        return GeneratePrintLayout;
    });
