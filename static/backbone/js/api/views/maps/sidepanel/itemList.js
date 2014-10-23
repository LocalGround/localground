/**
 * Created by zmmachar on 10/15/14.
 */
define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/sidepanel/collectionHeader.html",
        "views/maps/sidepanel/items/item",
        "config"
    ],
    function (Marionette, _, $, collectionHeader, Item, Config) {
        "use strict";


        var ItemList = Marionette.CompositeView.extend({

            template: _.template(collectionHeader),


            childView: Item,

            childViewContainer: ".collection-data",

            events: {
                'click .show-hide': 'toggleShow',
                'click .check-all': 'toggleShowAll',
                'click .zoom-to-extent': 'zoomToExtent'
            },
            //Until models are added, a given list is hidden
            className: "hidden",

            hidden: true,

            isExpanded: false,

            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.collection = opts.collection;
                if (this.collection.key) {
                    var configKey = this.collection.key.split("_")[0];
                    this.childView = Config[configKey].ItemView;
                    this.childViewOptions = $.extend(opts, {template: _.template(Config[configKey].ItemTemplate)});
                }
                this.listenTo(this.app.vent, 'toggle-project', this.toggleProjectData);
            },

            templateHelpers: function () {
                return {
                    name: this.opts.collection.name,
                    key: this.opts.collection.key,
                    isVisible: this.isVisible(),
                    isExpanded: this.isExpanded
                };
            },

            zoomToExtent: function () {
                this.app.vent.trigger('zoom-to-extent', { key: this.opts.collection.key });
            },

            isVisible: function () {
                return !this.hidden && this.opts.collection.length > 0;
            },

            onAddChild: function () {
                if (this.hidden) {
                    this.$el.removeClass('hidden');
                    this.hidden = false;
                }
            },

            onRemoveChild: function () {
                if (this.collection.length === 0 && !this.hidden) {
                    this.hidden = true;
                    this.$el.addClass('hidden');
                }
            },

            toggleShow: function () {
                this.$el.find(this.childViewContainer).toggleClass('hidden');
                if (this.isExpanded) {
                    this.$el.find('.show-hide').removeClass('fa-caret-down').addClass('fa-caret-right');
                } else {
                    this.$el.find('.show-hide').removeClass('fa-caret-right').addClass('fa-caret-down');
                }
                this.isExpanded = !this.isExpanded;
            },

            toggleShowAll: function () {
                if (this.$el.find('.check-all').is(':checked')) {
                    this.children.each(function (child) {
                        child.checkItem();
                    });
                } else {
                    this.children.each(function (child) {
                        child.uncheckItem();
                    });
                }

            },

            toggleProjectData: function (id, visible) {
                this.collection.each(function (model) {
                    if (model.get('project_id') === Number(id)) {
                        model.set('isVisible', visible);
                    }
                });
                this.hidden = !this.collection.any(function (model) { return model.get('isVisible'); });
                if (this.hidden) {
                    this.$el.addClass('hidden');

                } else {
                    this.$el.removeClass('hidden');
                    //this.toggleShowAll();
                }
            }





        });

        return ItemList;
    });