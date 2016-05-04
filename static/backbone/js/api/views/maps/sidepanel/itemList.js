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

            /** tracks # of times this view is rendered (important for restoring state) */
            numRenderings: 0,

            state: {},

            events: {
                'click .show-hide': 'toggleShow',
                'click .check-all': 'toggleShowAll',
                'click .zoom-to-extent': 'zoomToExtent'
            },
            //Until models are added, a given list is hidden
            className: "hidden",

            hidden: true,
            doNotRender: false,


            initialize: function (opts) {
                this.app = opts.app;
                this.id = 'sidebar-header' + opts.collection.key;
                this.opts = opts;
                this.collection = opts.collection;
                if (this.collection.key) {
                    var configKey = this.collection.key;
                    if (configKey.indexOf("form_") != -1) {
                        configKey = configKey.split("_")[0];
                    }
                    this.childView = Config[configKey].ItemView;
                    this.childViewOptions = $.extend(opts, {template: _.template(Config[configKey].ItemTemplate)});
                }
                this.restoreState();
                this.listenTo(this.app.vent, 'toggle-project', this.toggleProjectData);
                this.listenTo(this.collection, "filtered", this.renderFiltered);
            },

            templateHelpers: function () {
                return {
                    name: this.collection.name,
                    key: this.collection.key,
                    isVisible: this.isVisible(),
                    doNotRender: this.doNotRender,
                    isExpanded: this.isExpanded(),
                    numRenderings: this.numRenderings
                };
            },

            zoomToExtent: function () {
                this.collection.trigger('zoom-to-extent');
            },

            /**
             * Determines whether or not the itemList should be shown at all.
             */
            isVisible: function () {
                var isVisible = !this.hidden && this.opts.collection.length > 0 &&
                    this.$el.find('.check-all').is(':checked');
                // ensures that localStorage flag is only honored on initialization.
                if (this.isFirstRendering()) {
                    isVisible = isVisible || this.state.isVisible;
                }
                return isVisible;
            },

            isExpanded: function () {
                var isExpanded = this.$el.find('.show-hide').hasClass('fa-caret-down');
                // ensures that localStorage flag is only honored on initialization.
                if (this.isFirstRendering()) {
                    isExpanded = isExpanded || this.state.isExpanded;
                }
                return isExpanded;
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
                if (this.isExpanded()) {
                    this.$el.find('.show-hide').removeClass('fa-caret-down').addClass('fa-caret-right');
                } else {
                    this.$el.find('.show-hide').removeClass('fa-caret-right').addClass('fa-caret-down');
                }
                this.saveState();
            },

            toggleShowAll: function () {
                if (this.$el.find('.check-all').is(':checked')) {
                    this.showAll();
                } else {
                    this.hideAll();
                }
                this.saveState();

            },

            showAll: function () {
                this.children.each(function (child) {
                    child.checkItem();
                });
            },

            hideAll: function () {
                this.children.each(function (child) {
                    child.uncheckItem();
                });
            },

            onRender: function () {
                ++this.numRenderings;
            },

            isFirstRendering: function () {
                return this.numRenderings < 1;
            },

            renderFiltered: function (opts) {
                if (opts) {
                    this.doNotRender = opts.doNotRender;
                }
                this.render();
            },

            saveState: function () {
                //only save state if visible:
                if (this.doNotRender) {
                    return;
                }
                this.app.saveState(
                    this.id,
                    {
                        isVisible: this.isVisible(),
                        isExpanded: this.isExpanded()
                    },
                    false
                );
            },

            restoreState: function () {
                this.state = this.app.restoreState(this.id);
                if (!this.state) {
                    this.state = {
                        isVisible: false,
                        isExpanded: false
                    };
                }
            },

            loadItems: function (itemIds) {
                _.each(this.children.filter(function (child) {return _.contains(itemIds, child.model.attributes.id); }),
                    function (child) {
                        child.showItem();
                    });

            }

        });

        return ItemList;
    });