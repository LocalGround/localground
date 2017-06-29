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
                this.listenTo(this.app.vent, "show-print-generated-message", this.displayConfirmation);
                this.listenTo(this.app.vent, "hide-print-generated-message", this.hideConfirmation);
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
                var formColors = ['#60C7CC', '#CF2045', '#A3A737', '#F27CA5'],
                    colorCounter = 0,
                    i,
                    fillColor,
                    overlays,
                    key,
                    entry,
                    dm = this.app.dataManager,
                    dataSources = dm.getDataSources();
                for (i = 0; i < dataSources.length; i++) {
                    fillColor = null;
                    key = dataSources[i].value;
                    entry = dm.getData(key);
                    if (key.indexOf("form_") != -1) {
                        fillColor = formColors[colorCounter];
                        ++colorCounter;
                    }
                    if (entry.collection.length === 0) { continue; }
                    overlays = new MarkerOverlays({
                        collection: entry.collection,
                        app: this.app,
                        map: this.basemapView.map,
                        dataType: entry.collection.key,
                        isShowing: true,
                        _icon: new Icon({
                            shape: entry.collection.key,
                            //fillColor: fillColor,
                            fillColor: entry.collection.fillColor,
                            width: entry.collection.size,
                            height: entry.collection.size
                        })
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
            },

            displayConfirmation: function (response) {
                var $container = this.$el.find(".confirmation-message"),
                    $others = this.$el.find(".load-message, .print-layout-right, .print-layout-left");
                this.app.vent.trigger('update-modal-save-button', {
                    display: 'none'
                });
                $others.hide();
                $container.find('.link').attr('href', response.pdf);
                $container.find('.thumb').attr('src', response.thumb);
                $container.show();
            },

            hideConfirmation: function () {
                this.app.vent.trigger('update-modal-save-button', {
                    display: 'block'
                });
                this.$el.find(".print-layout-right, .print-layout-left").show();
                this.$el.find(".confirmation-message").hide();
            }

        });
        return GeneratePrintLayout;
    });
