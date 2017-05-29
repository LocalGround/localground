define(["marionette",
        "underscore",
        "handlebars",
        "lib/maps/overlays/icon",
        "lib/maps/marker-overlays",
        "apps/style/visibility-mixin",
        "apps/map/views/marker-listing-detail",
        "text!../templates/list.html"],
    function (Marionette, _, Handlebars, Icon, MarkerOverlays, PanelVisibilityExtensions, MarkerListingDetail, ListTemplate) {
        'use strict';
        var MarkerListing = Marionette.CompositeView.extend(_.extend({}, PanelVisibilityExtensions, {
            stateKey: 'marker-listing-',
            isShowing: true,
            displayOverlays: true,
            overlays: null,
            fields: null, //for custom data types
            title: null,
            initialize: function (opts) {
                _.extend(this, opts);
                this.collection = this.data.collection;
                this.fields = this.data.fields;
                this.title = this.title || this.data.name;
                this.typePlural = this.data.id.replace("-", "_");

                Marionette.CompositeView.prototype.initialize.call(this);
                this.initDisplayFlags();
                this.template = Handlebars.compile(ListTemplate);

                if (!this.isMapImageCollection()) {
                    this.icon = new Icon({
                        shape: opts.data.collection.key,
                        fillColor: opts.fillColor
                    });
                }
                this.displayMedia();

                this.listenTo(this.app.vent, 'show-uploader', this.addMedia);
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
            },
            isMapImageCollection: function () {
                return this.collection.key === "map_images";
            },
            initDisplayFlags: function () {
                if (this.isMapImageCollection()) {
                    this.isShowing = false;
                    this.displayOverlays = false;
                }
                this.stateKey += "_" + this.collection.key;
                this.restoreState();
            },
            templateHelpers: function () {
                return {
                    title: this.title,
                    typePlural: this.typePlural,
                    key: this.collection.key,
                    isShowing: this.isShowing,
                    displayOverlays: this.displayOverlays
                };
            },
            getEmptyView: function () {
                //console.log("empty", this.title);
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
                    title: this.title,
                    icon: this.icon,
                    displayOverlay: this.displayOverlays
                };
            },
            childView: MarkerListingDetail,
            childViewContainer: ".marker-container",
            events: function () {
                return _.extend({
                    'click .zoom-to-extents': 'zoomToExtents',
                    'click .list-header > .fa-eye': 'hideMarkers',
                    'click .list-header > .fa-eye-slash': 'showMarkers',
                    'click .add-new': 'triggerAddNewMap'
                }, PanelVisibilityExtensions.events);
            },

            zoomToExtents: function () {
                this.collection.trigger('zoom-to-extents');
            },
            hideMarkers: function () {
                this.displayOverlays = false;
                this.collection.trigger('hide-markers');
                this.saveState();
                this.render();
            },
            showMarkers: function () {
                this.displayOverlays = true;
                this.collection.trigger('show-markers');
                this.saveState();
                this.render();
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
                this.overlays = new MarkerOverlays({
                    collection: this.collection,
                    app: this.app,
                    dataType: this.typePlural,
                    _icon: this.icon,
                    isShowing: false // initialize all overlays as hidden
                });
            },

            // The commneted code caused an undefined error
            // it has to be solve with some way to get the trigger
            // to be sent to toolbar-dataview.js under addNewMap function.

            //*
            triggerAddNewMap: function (e) {
                var target = this.$el.find('.add-new');
                this.app.vent.trigger('add-new-item-to-map', {
                    target: target,
                    preventDefault: function () {}
                });
                e.preventDefault();
            },

            doSearch: function (term) {
                this.collection.doSearch(term, this.app.getProjectID(), this.fields);
            },

            clearSearch: function () {
                this.collection.clearSearch(this.app.getProjectID());
            },

            displayMedia: function () {
                _.bindAll(this, 'render');

                // redraw CompositeView:
                this.render();
                this.renderOverlays();
                this.hideLoadingMessage();
            },
            saveState: function () {
                this.app.saveState(this.stateKey, {
                    isShowing: this.isShowing,
                    displayOverlays: this.displayOverlays
                });
            },
            restoreState: function () {
                var state = this.app.restoreState(this.stateKey);
                if (state) {
                    this.isShowing = state.isShowing;
                    this.displayOverlays = state.displayOverlays;
                }
            }

        }));
        return MarkerListing;
    });
