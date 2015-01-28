/**
 * Created by zmmachar on 10/15/14.
 */
define(["marionette",
        "underscore",
        "jquery",
        "views/maps/sidepanel/itemList"
    ],
    function (Marionette, _, $, ItemList) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var ItemListManager = Marionette.LayoutView.extend({
            tagName: 'div',
            id: 'item-list',
            template: _.template(""),
            collections: [],
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.listenTo(this.app.vent, 'new-collection-created', this.addItemList);
                this.app.vent.trigger("adjust-layout");
            },

            addItemList: function (data) {
                var collection = data.collection,
                    selector =  collection.key + '-list';
                this.$el.append($('<div id="' + selector + '"></div>'));
                this.addRegion(collection.key, '#' + selector);
                this[collection.key].show(new ItemList(_.extend({collection: collection}, _.clone(this.opts))));
                this.collections.push(collection);
            },

            //Dispatch calls to each child to load a set of items
            loadSnapshot: function (snapshot) {
                _.each(this.regionManager.getRegions(), function (region) {
                    region.currentView.hideAll();
                });
                _.each(snapshot.children, function (collection, key) {
                    this[key].currentView.loadItems(_.pluck(collection.data, 'id'));
                }.bind(this));
            }
        });

        return ItemListManager;

    });