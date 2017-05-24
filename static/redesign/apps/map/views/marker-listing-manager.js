define(["marionette",
        "underscore",
        "handlebars",
        "jquery",
        "apps/map/views/marker-listing"
    ],
    function (Marionette, _, Handlebars, $, MarkerListing) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var ItemListManager = Marionette.LayoutView.extend({
            tagName: 'div',
            template: Handlebars.compile('<div class="show-hide hide"></div>'),
            collections: [],
            overlayViews: [],
            initialize: function (opts) {
                _.extend(this, opts);
            },
            events: {
                'click .hide': 'hidePanel',
                'click .show': 'showPanel'
            },

            addMarkerListingsToUI: function () {
                var formColors = ['#60C7CC', '#CF2045', '#A3A737', '#F27CA5'],
                    colorCounter = 0,
                    i = 0,
                    fillColor,
                    key,
                    data,
                    selector,
                    overlayView,
                    dm = this.app.dataManager,
                    dataSources = dm.getDataSources();
                for (i = 0; i < dataSources.length; i++) {
                    fillColor = null;
                    key = dataSources[i].value;
                    data =  dm.getData(key);
                    if (key.indexOf("form_") != -1) {
                        fillColor = formColors[colorCounter];
                        ++colorCounter;
                    }
                    overlayView = new MarkerListing({
                        data: data,
                        app: this.app,
                        title: dataSources[i].name,
                        fillColor: fillColor
                    });
                    this.overlayViews.push(overlayView);
                    selector = key + '-list';
                    this.$el.append($('<div id="' + selector + '"></div>'));
                    this.addRegion(key, '#' + selector);
                    this[key].show(overlayView);
                }
                this.zoomToExtents();
            },
            zoomToExtents: function () {
                var bounds = new google.maps.LatLngBounds(),
                    i;
                for (i = 0; i < this.overlayViews.length; i++) {
                    bounds.union(this.overlayViews[i].overlays.getBounds());
                }
                //console.log(bounds.isEmpty());
                if (!bounds.isEmpty()) {
                    this.app.map.fitBounds(bounds);
                }
            },
            onShow: function () {
                this.addMarkerListingsToUI();
            },
            hidePanel: function (e) {
                $(e.target).removeClass("hide").addClass("show");
                this.app.vent.trigger('hide-list');
                e.preventDefault();
            },
            showPanel: function (e) {
                $(e.target).removeClass("show").addClass("hide");
                this.app.vent.trigger('unhide-list');
                e.preventDefault();
            }
        });

        return ItemListManager;

    });