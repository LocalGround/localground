define(["marionette",
        "handlebars",
        "apps/map/views/marker-listing-manager",
        "lib/maps/basemap",
        "apps/gallery/views/data-detail",
        "text!../templates/map-layout.html"
    ],
    function (Marionette, Handlebars, MarkerListingManager, Basemap, DataDetail, MapLayoutTemplate)  {
        'use strict';
        var MapLayout = Marionette.LayoutView.extend({
            //className: 'main-panel',
            showLeft: true,
            showRight: false,
            regions: {
                leftRegion: '#left-panel',
                mapRegion: '#map-panel',
                rightRegion: '#right-panel'
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.template = Handlebars.compile(MapLayoutTemplate);
                this.render();
                this.showBasemap();
            },
            onRender: function () {
                //this.showBasemap();
                //this.showMarkerListManager();
            },
            showBasemap: function () {
                this.basemapView = new Basemap({
                    app: this.app,
                    showSearchControl: true, // added for rosa parks pilot
                    mapID: "map",
                    minZoom: 1 // added for rosa parks pilot
                });
            },
            onShow: function () {
                this.mapRegion.show(this.basemapView);
                this.showMarkerListManager();
            },

            showMarkerListManager: function () {
                this.showLeft = true;
                this.updateDisplay();
                this.markerListManager = new MarkerListingManager({
                    app: this.app
                });
                this.leftRegion.show(this.markerListManager);
            },

            updateDisplay: function () {
                var className = "none";
                if (this.showLeft && this.showRight) {
                    className = "both";
                } else if (this.showLeft) {
                    className = "left";
                } else if (this.showRight) {
                    className = "right";
                }
                $('.main-panel').removeClass("left right none both");
                $('.main-panel').addClass(className);
                //wait 'til CSS animation completes before redrawing map
                //setTimeout(this.basemapView.redraw, 220);
            }

        });
        return MapLayout;
    });
