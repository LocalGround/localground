/**
 * Created by zmmachar on 10/15/14.
 */
define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/sidepanel/collectionHeader.html",
        "views/maps/sidepanel/item",
        "config"
    ],
    function (Marionette, _, $, collectionHeader, Item, Config) {
        "use strict";


        var ItemList = Marionette.CompositeView.extend({

            template: _.template(collectionHeader),

            childView: Item,


            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.collection = opts.collection;
            }
        });

        return ItemList;
    });