define(["marionette",
        "underscore",
        "jquery",
        "apps/map/views/marker-listing"
    ],
    function (Marionette, _, $, OverlayListView) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var ItemListManager = Marionette.LayoutView.extend({
            tagName: 'div',
            //id: 'item-list',
            template: _.template(""),
            collections: [],
            initialize: function (opts) {
                _.extend(this, opts);
            },

            addMarkerListingsToUI: function () {
                var i = 0,
                    key,
                    selector,
                    overlayView,
                    //collection,
                    dm = this.app.dataManager,
                    dataSources = dm.getDataSources();
                console.log(dataSources);
                for (i = 0; i < dataSources.length; i++) {
                    key = dataSources[i].value;
                    //collection = dm.getData(key).collection;
                    //console.log(collection);
                    overlayView = new OverlayListView({
                        data: dm.getData(key),
                        app: this.app,
                        title: dataSources[i].name
                    });
                    selector = key + '-list';
                    console.log(key, selector);
                    this.$el.append($('<div id="' + selector + '"></div>'));
                    this.addRegion(key, '#' + selector);
                    this[key].show(overlayView);
                }
                //console.log(this.$el.html());
                //this.render();
            },
            onShow: function () {
                this.addMarkerListingsToUI();
            }
        });

        return ItemListManager;

    });