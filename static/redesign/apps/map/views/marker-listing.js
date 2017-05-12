define(["jquery",
        "marionette",
        "underscore",
        "handlebars",
        "lib/maps/overlays/icon",
        "lib/maps/marker-overlays",
        "text!../templates/list-detail.html",
        "text!../templates/list.html"],
    function ($, Marionette, _, Handlebars, Icon, MarkerOverlays, ItemTemplate, ListTemplate) {
        'use strict';
        var MarkerListing = Marionette.CompositeView.extend({

            //view that controls what each gallery item looks like:
            overlays: null,
            fields: null, //for custom data types
            title: null,
            templateHelpers: function () {
                var d = {
                    title: this.title,
                    typePlural: this.typePlural,
                    key: this.collection.key
                };
                return d;
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
                    icon: this.icon
                };
            },
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                        this.model.set("dataType", this.dataType);
                        this.listenTo(this.model, 'do-hover', this.hoverHighlight);
                        this.listenTo(this.model, 'clear-hover', this.clearHoverHighlight);
                    },
                    template: Handlebars.compile(ItemTemplate),
                    modelEvents: {
                        'saved': 'render',
                        'change:active': 'render',
                        'change:geometry': 'render'
                    },
                    tagName: "li",
                    templateHelpers: function () {
                        return {
                            dataType: this.dataType,
                            icon: this.icon,
                            width: 15 * this.icon.getScale(),
                            height: 15 * this.icon.getScale(),
                            name: this.model.get("name") || this.model.get("display_name")
                        };
                    },
                    hoverHighlight: function () {
                        this.clearHoverHighlight();
                        if (!this.$el.hasClass('highlight')) {
                            this.$el.addClass("hover-highlight");
                        }
                    },
                    clearHoverHighlight: function () {
                        $("li").removeClass("hover-highlight");
                    }
                });
            },
            childViewContainer: ".marker-container",
            events: {
                'click .zoom-to-extents': 'zoomToExtents',
                'click .hide-panel': 'hidePanel',
                'click .show-panel': 'showPanel',
                'click .add-new': 'triggerAddNewMap'
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
                this.icon = new Icon({
                    shape: opts.data.collection.key
                });
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
                this.overlays = new MarkerOverlays({
                    collection: this.collection,
                    app: this.app,
                    dataType: this.typePlural,
                    _icon: this.icon,
                    isShowing: true
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
            }/*,
            onRender: function () {
                console.log("rendering...");
            }*/

        });
        return MarkerListing;
    });
