define(["marionette",
        "underscore",
        "handlebars",
        "jquery",
        "./marker-listing"
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
                var that = this,
                    data,
                    selector,
                    overlayView,
                    dm = this.app.dataManager;
                dm.each((collection) => {
                    overlayView = new MarkerListing({
                        collection: collection,
                        fields: collection.getFields(),
                        app: this.app,
                        title: collection.getTitle()
                    });
                    this.overlayViews.push(overlayView);
                    selector = collection.getDataType() + '-list';
                    this.$el.append($('<div id="' + selector + '"></div>'));
                    this.addRegion( collection.getDataType(), '#' + selector);
                    this[ collection.getDataType()].show(overlayView);
                });
                this.zoomToExtents();
            },
            zoomToExtents: function () {
                var bounds = new google.maps.LatLngBounds(),
                    i;
                for (i = 0; i < this.overlayViews.length; i++) {
                    bounds.union(this.overlayViews[i].overlays.getBounds());
                }
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
