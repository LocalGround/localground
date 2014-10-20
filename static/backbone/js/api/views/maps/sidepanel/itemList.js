/**
 * Created by zmmachar on 10/15/14.
 */
define(["backbone",
        "marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/sidepanel/collectionHeader.html",
        "views/maps/sidepanel/items/item",
        "config"
    ],
    function (Backbone, Marionette, _, $, collectionHeader, Item, Config) {
        "use strict";


        var ItemList = Marionette.CompositeView.extend({

            template: _.template(collectionHeader),


            childView: Item,

            childViewContainer: ".collection-data",

            events: {
                'click .show-hide': 'toggleShow'
            },


            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.collection = opts.collection;
                this.model = new Backbone.Model({
                    name: opts.collection.name,
                    key: opts.collection.key,
                    isVisible: opts.collection.length > 0,
                    isExpanded: opts.collection.length > 0
                });
                if (this.collection.key) {
                    var configKey = this.collection.key.split("_")[0];
                    this.childView = Config[configKey].ItemView;
                    this.childViewOptions = $.extend(opts, {template: _.template(Config[configKey].ItemTemplate)});
                }
            },

            onAddChild: function () {
                if (!this.model.get('isVisible')) {
                    this.$el.children().first().removeClass('hidden');
                    this.model.set('isVisible', true);
                }
            },

            onRemoveChild: function () {
                if (this.collection.length === 0 && this.model.get('isVisible')) {
                    this.model.set('isVisible', false);
                    this.$el.children().first().addClass('hidden');
                }
            },

            toggleShow: function () {
                this.$el.find(this.childViewContainer).toggleClass('hidden');
                if (this.model.get('isExpanded')) {
                    this.$el.find('.show-hide').removeClass('fa-caret-down').addClass('fa-caret-right');
                } else {
                    this.$el.find('.show-hide').removeClass('fa-caret-right').addClass('fa-caret-down');
                }
                this.model.set('isExpanded', !this.model.get('isExpanded'));
            }



        });

        return ItemList;
    });