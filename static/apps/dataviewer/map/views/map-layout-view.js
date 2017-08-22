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
                this.listenTo(this.app.vent, 'show-detail', this.showDetail);
                this.listenTo(this.app.vent, 'hide-detail', this.hideDetail);
                this.listenTo(this.app.vent, 'unhide-detail', this.unhideDetail);
                this.listenTo(this.app.vent, 'unhide-list', this.unhideList);
                this.listenTo(this.app.vent, 'hide-list', this.hideList);
            },
            hideList: function () {
                this.showLeft = false;
                this.updateDisplay();
            },
            unhideList: function () {
                this.showLeft = true;
                this.updateDisplay();
            },
            showBasemap: function () {
                this.basemapView = new Basemap({
                    app: this.app,
                    showSearchControl: true, // added for rosa parks pilot
                    mapID: "map",
                    minZoom: 1 // added for rosa parks pilot
                });
            },
            showDetail: function (view) {
                this.rightRegion.show(view);
                this.unhideDetail();
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
            },

            hideDetail: function () {
                this.showRight = false;
                this.updateDisplay();
            },

            unhideDetail: function () {
                this.showRight = true;
                this.updateDisplay();
            }

        });
        return MapLayout;
    });
