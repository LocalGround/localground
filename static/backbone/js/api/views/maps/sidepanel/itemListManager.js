/**
 * Created by zmmachar on 10/15/14.
 */
define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/sidepanel/itemListManager.html",
        "views/maps/sidepanel/itemList"
    ],
    function (Marionette, _, $, itemListManagerTemplate, ItemList) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var ItemListManager = Marionette.LayoutView.extend({
            tagName: 'div',
            id: 'item-list',
            template: _.template(itemListManagerTemplate),

            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.listenTo(this.app.vent, 'new-collection-created', this.addItemList);
            },

            addItemList: function (data) {
                var collection = data.collection;
                var selector =  collection.key + '-list';
                this.$el.append($('<div id="' + selector + '"></div>'));
                this.addRegion(collection.key, '#' + selector);
                this[collection.key].show(new ItemList(_.extend({collection: collection}, _.clone(this.opts))));
            }
        });

        return ItemListManager;

    });