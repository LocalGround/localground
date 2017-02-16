define(["jquery",
        "marionette",
        "underscore",
        "handlebars",
        "lib/maps/icon-lookup",
        "lib/maps/marker-overlays",
        "text!../templates/list-detail.html",
        "text!../templates/list.html"],
    function ($, Marionette, _, Handlebars, Icon, OverlayListView, ItemTemplate, ListTemplate) {
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
                return d;
            },
            getEmptyView: function () {
                console.log("empty", this.title);
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                    },
                    tagName: "li",
                    className: "empty",
                    template: Handlebars.compile('No "{{ title }}" found'),
                    templateHelpers: function () {
                        return {
                            title: this.title.toLowerCase()
                        };
                    }
                });
            },

            childViewOptions: function () {
                return {
                    app: this.app,
                    dataType: this.typePlural,
                    fields: this.fields,
                    title: this.title
                };
            },
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                        this.model.set("dataType", this.dataType);
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
                        icon = new Icon(key);
                        return {
                            dataType: this.dataType,
                            icon: icon,
                            width: 15 * icon.getScale(),
                            height: 15 * icon.getScale(),
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
                'click .hide-panel': 'hidePanel',
                'click .show-panel': 'showPanel'
            },
            hidePanel: function (e) {
                this.$el.find(".marker-container").hide();
                $(e.target).removeClass("hide-panel fa-caret-down");
                $(e.target).addClass("show-panel fa-caret-right");
            },
            showPanel: function (e) {
                this.$el.find(".marker-container").show();
                $(e.target).removeClass("show-panel fa-caret-right");
                $(e.target).addClass("hide-panel fa-caret-down");
            },
            initialize: function (opts) {
                _.extend(this, opts);
                Marionette.CompositeView.prototype.initialize.call(this);

                this.template = Handlebars.compile(ListTemplate);
                this.displayMedia();
                this.listenTo(this.app.vent, 'show-uploader', this.addMedia);
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
            },
            zoomToExtents: function () {
                this.collection.trigger('zoom-to-extents');
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
                    app: this.app,
                    dataType: this.typePlural
                });
            },

            doSearch: function (term) {
                this.collection.doSearch(term, this.app.getProjectID(), this.fields);
            },

            clearSearch: function () {
                this.collection.clearSearch(this.app.getProjectID());
            },

            displayMedia: function () {
                //fetch data from server:
                //var data = this.app.dataManager.getData(this.app.dataType);

                // set important data variables:
                this.collection = this.data.collection;
                this.fields = this.data.fields;
                this.title = this.data.name;
                this.typePlural = this.data.id;
                _.bindAll(this, 'render');

                // redraw CompositeView:
                this.render();
                this.renderOverlays();
                this.hideLoadingMessage();
            }

        });
        return MarkerListing;
    });
