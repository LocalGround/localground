define(["marionette",
        "underscore",
        "handlebars",
        "lib/maps/overlays/icon",
        "lib/maps/marker-overlays",
        "apps/style/visibility-mixin",
        "./marker-listing-detail",
        "text!../templates/list.html"],
    function (Marionette, _, Handlebars, Icon, MarkerOverlays, PanelVisibilityExtensions, MarkerListingDetail, ListTemplate) {
        'use strict';
        var MarkerListing = Marionette.CompositeView.extend(_.extend({}, PanelVisibilityExtensions, {
            isShowing: true,
            displayOverlays: true, // initialize all overlays as hidden. ChildView will override.
            overlays: null,
            fields: null, //for custom data types
            title: null,
            collectionEvents: {
                'show-marker': 'removeHideIcon',
                'hide-marker': 'showHideIcon',
                'click .add-new': 'triggerAddNew'
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.stateKey = this.app.selectedProjectID + '-marker-listing-';
                this.title = this.title || this.collection.getTitle();
                this.typePlural = this.collection.getDataType();
                this.initDisplayFlags();
                this.template = Handlebars.compile(ListTemplate);

                Marionette.CompositeView.prototype.initialize.call(this);
                if (!this.isMapImageCollection()) {
                    this.icon = new Icon({
                        shape: this.collection.getDataType(),
                        fillColor: this.collection.fillColor,
                        width: this.collection.size,
                        height: this.collection.size
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
                if (this.typePlural === "photos" || this.typePlural === "audio" ||
                        this.typePlural === "map_images") {
                    this.displayOverlays = false;
                    this.isShowing = false;
                } else {
                    this.displayOverlays = true;
                    this.isShowing = true;
                }
                this.stateKey += this.collection.getDataType();
                this.restoreState();
            },
            templateHelpers: function () {
                return {
                    title: this.title,
                    typePlural: this.typePlural,
                    key: this.collection.key,
                    isShowing: this.isShowing,
                    dataType: this.collection.key,
                    screenType: this.app.screenType,
                    displayOverlays: this.displayOverlays
                };
            },
            getEmptyView: function () {
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

            triggerAddNew: function (e) {
                var dataType = this.collection.key;
                var screenType = this.app.screenType;
                this.app.vent.trigger("show-create-new", screenType, dataType);
                e.preventDefault();
            },

            childViewOptions: function () {
                var opts = {
                    app: this.app,
                    title: this.title,
                    icon: this.icon,
                    parent: this
                };
                return opts;
            },
            childView: MarkerListingDetail,
            childViewContainer: ".marker-container",
            events: function () {
                return _.extend({
                    'click .zoom-to-extents': 'zoomToExtents',
                    'click .list-header > .fa-eye': 'hideMarkers',
                    'click .list-header > .fa-eye-slash': 'showMarkers',
                    'click .add-new': 'route',
                    'click .add-new': 'triggerAddNew'
                }, PanelVisibilityExtensions.events);
            },

            removeHideIcon: function () {
                this.$el.find('.list-header > .fa-eye-slash').removeClass('fa-eye-slash').addClass('fa-eye');
            },
            route: function (e) {
                this.app.vent.trigger('route', e);
                e.preventDefault();
            },

            showHideIcon: function () {
                var invisibilityCount = 0,
                    that = this;
                this.children.each(function (view) {
                    if (!view.displayOverlay) {
                        ++invisibilityCount;
                        that.displayOverlays = false;
                    }
                });
                if (invisibilityCount === this.children.length) {
                    this.$el.find('.list-header > .fa-eye').removeClass('fa-eye').addClass('fa-eye-slash');
                }
                this.saveState();
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
                    displayOverlays: this.displayOverlays
                });
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
                if (state && typeof state.isShowing !== 'undefined') {
                    this.isShowing = state.isShowing;
                }
                if (state && typeof state.displayOverlays !== 'undefined') {
                    this.displayOverlays = state.displayOverlays;
                }
            }

        }));
        return MarkerListing;
    });
