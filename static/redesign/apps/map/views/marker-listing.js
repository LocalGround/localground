define(["marionette",
        "underscore",
        "handlebars",
        "collections/photos",
        "collections/audio",
        "apps/map/views/marker-overlays",
        "text!../templates/list-detail.html",
        "text!../templates/list.html"],
    function (Marionette, _, Handlebars, Photos, Audio, OverlayListView, ItemTemplate, ListTemplate) {
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
                    modelEvents: {
                        'saved': 'render'
                    },
                    tagName: "li",
                    templateHelpers: function () {
                        return { dataType: this.app.dataType };
                    }
                });
            },
            childViewContainer: ".marker-container",
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
                return "WHERE project = " + this.app.selectedProject.id;
            },

            doSearch: function (query) {
                query = "WHERE " + query + " AND project = " + this.app.selectedProject.id;
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