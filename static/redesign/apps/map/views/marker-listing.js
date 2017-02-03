define(["jquery",
        "marionette",
        "underscore",
        "handlebars",
        "lib/maps/icon-lookup",
        "lib/maps/marker-overlays",
        "text!../templates/list-detail.html",
        "text!../templates/list.html"],
    function ($, Marionette, _, Handlebars, IconLookup, OverlayListView, ItemTemplate, ListTemplate) {
        'use strict';
        var MarkerListing = Marionette.CompositeView.extend({

            //view that controls what each gallery item looks like:
            overlays: null,
            fields: null, //for custom data types
            title: null,
            templateHelpers: function () {
                var d = {
                    title: this.title,
                    typePlural: this.typePlural
                };
                console.log(d);
                return d;
            },

            childViewOptions: function () {
                return {
                    app: this.app,
                    fields: this.fields
                };
            },
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                        if (this.fields) {
                            this.model.set("fields", this.fields.toJSON());
                        }
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
                        var key = this.model.get("overlay_type"),
                            icon;
                        if (this.model.get("overlay_type").indexOf("form_") != -1) {
                            key = "marker";
                        }
                        icon = IconLookup.getIconPaths(key);
                        return {
                            dataType: this.app.dataType,
                            icon: icon,
                            width: 15 * icon.scale,
                            height: 15 * icon.scale,
                            name: this.model.get("name") || this.model.get("display_name")
                        };
                    },
                    highlight: function () {
                        $("li").removeClass("highlight");
                        this.$el.addClass("highlight");
                    }
                });
            },
            childViewContainer: ".marker-container",
            events: {
                'click .zoom-to-extents': 'zoomToExtents',
                'click .add-photos': 'addMedia',
                'click .add-audio': 'addMedia',
                'click .hide': 'hidePanel',
                'click .show': 'showPanel'
            },
            initialize: function (opts) {
                _.extend(this, opts);
                Marionette.CompositeView.prototype.initialize.call(this);

                this.template = Handlebars.compile(ListTemplate);
                this.displayMedia();
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
                //this.listenTo(this.collection, 'add', this.displayMedia);
            },
            addMedia: function (e) {
                this.app.vent.trigger('add-media');
                e.preventDefault();
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

            hideLoadingMessage: function () {
                this.$el.find(this.childViewContainer).empty();
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

            doSearch: function (term) {
                this.collection.doSearch(term, this.app.getProjectID());
            },

            clearSearch: function () {
                this.collection.clearSearch();
            },

            displayMedia: function () {
                //fetch data from server:
                var data = this.app.dataManager.getData(this.app.dataType);

                // set important data variables:
                this.collection = data.collection;
                this.fields = data.fields;
                this.title = data.name;
                this.typePlural = data.id;
                _.bindAll(this, 'render');

                // redraw CompositeView:
                this.render();
                this.renderOverlays();
                this.hideLoadingMessage();
                this.zoomToExtents();
            }

        });
        return MarkerListing;
    });