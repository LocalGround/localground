define(["jquery",
        "marionette",
        "underscore",
        "handlebars",
        "collections/photos",
        "collections/audio",
        "lib/maps/icon-lookup",
        "lib/maps/marker-overlays",
        "text!../templates/list-detail.html",
        "text!../templates/list.html"],
    function ($, Marionette, _, Handlebars, Photos, Audio, IconLookup, OverlayListView, ItemTemplate, ListTemplate) {
        'use strict';
        var MarkerListing = Marionette.CompositeView.extend({

            //view that controls what each gallery item looks like:
            overlays: null,
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                    },
                    template: Handlebars.compile(ItemTemplate),
                    events: {
                        'click a': 'highlight'
                    },
                    modelEvents: {
                        'saved': 'render'
                    },
                    tagName: "li",
                    templateHelpers: function () {
                        return {
                            dataType: this.app.dataType,
                            icon: IconLookup.getIconPaths('plus')
                        };
                    },
                    highlight: function (e) {
                        $("a").removeClass("highlight");
                        var $elem = $(e.target).addClass("highlight");
                    }
                });
            },
            childViewContainer: ".marker-container",
            events: {
                'click .zoom-to-extents': 'zoomToExtents',
                'click .hide': 'hidePanel',
                'click .show': 'showPanel'
            },
            initialize: function (opts) {
                _.extend(this, opts);

                // call Marionette's default functionality (similar to "super")
                Marionette.CompositeView.prototype.initialize.call(this);

                this.displayMedia();

                // when the fetch completes, call Backbone's "render" method
                // to create the gallery template and bind the data:
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.collection, 'reset', this.renderOverlays);
                this.listenTo(this.collection, 'reset', this.hideLoadingMessage);

                //listen to events that fire from other parts of the application:
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
            },
            zoomToExtents: function () {
                this.collection.trigger('zoom-to-extents');
            },
            hidePanel: function (e) {
                $(e.target).removeClass("hide").addClass("show");
                console.log("about to hide...");
                this.app.vent.trigger('hide-list');
                e.preventDefault();
            },
            showPanel: function (e) {
                $(e.target).removeClass("show").addClass("hide");
                console.log("about to show...");
                this.app.vent.trigger('unhide-list');
                e.preventDefault();
            },

            childViewOptions: function () {
                return { app: this.app };
            },

            hideLoadingMessage: function () {
                this.$el.find(this.childViewContainer).empty();
            },

            template: function () {
                return Handlebars.compile(ListTemplate);
            },

            remove: function () {
                Marionette.CompositeView.prototype.initialize.call(this);
                if (this.overlays) {
                    this.overlays.destroy();
                }
            },

            renderOverlays: function () {
                this.overlays = new OverlayListView({
                    collection: this.collection,
                    app: this.app
                });
            },

            getDefaultQueryString: function () {
                return "WHERE project = " + this.app.getProjectID();
            },

            doSearch: function (query) {
                query = "WHERE " + query + " AND project = " + this.app.getProjectID();
                this.collection.query = query;
                this.collection.fetch({ reset: true });
            },

            clearSearch: function () {
                this.collection.query = this.getDefaultQueryString();
                this.collection.fetch({ reset: true });
            },

            displayMedia: function () {
                //fetch data from server:
                if (this.app.dataType == "photos") {
                    this.collection = new Photos();
                } else if (this.app.dataType ==  "audio") {
                    this.collection = new Audio();
                } else {
                    alert("Type not accounted for.");
                    return;
                }
                this.collection.query = this.getDefaultQueryString();
                this.collection.fetch({ reset: true });
            }

        });
        return MarkerListing;
    });