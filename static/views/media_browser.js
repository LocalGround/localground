define([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "collections/photos",
    "collections/audio",
    "collections/videos",
    "views/media-browser-child-view",
    "text!../templates/media-list-add.html"],
    function ($, _, Marionette, Handlebars, Photos, Audio, Videos,
            MediaBrowserChildView, ParentTemplate) {
        'use strict';
        var BrowserView = Marionette.CompositeView.extend({
            currentMedia: "photos",
            lastSelectedModel: null,
            viewMode: "thumb",
            childView: MediaBrowserChildView,
            childViewContainer: "#gallery-main",
            searchTerm: null,
            events: {
                "click .fetch-btn" : "fetchMedia",
                'click #card-view-button-modal' : 'displayCards',
                'click #table-view-button-modal' : 'displayTable',
                'click #toolbar-search': 'doSearch'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                Marionette.CompositeView.prototype.initialize.call(this);
                this.template = Handlebars.compile(ParentTemplate);
                this.displayMedia();

                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
            },

            templateHelpers: function () {
                return {
                    viewMode: this.viewMode,
                    searchTerm: this.searchTerm
                };
            },

            childViewOptions: function () {
                return {
                    app: this.app,
                    currentMedia: this.currentMedia,
                    lastSelectedModel: this.lastSelectedColumn,
                    parent: this,
                    tagName: this.determineChildViewTagName(this.viewMode),
                    className: this.determineChildViewClassName(this.viewMode)
                };
            },

            determineChildViewTagName: function (vm) {
                if (vm == "thumb") {
                    return "div";
                }
                return "tr";
            },

            determineChildViewClassName: function (vm) {
                if (vm == "thumb") {
                    return "column";
                }
                return "table";
            },

            displayCards: function () {
                this.viewMode = "thumb";
                this.render();
                this.hideLoadingMessage();
            },

            displayTable: function () {
                this.viewMode = "table";
                this.render();
                this.hideLoadingMessage();
            },

            hideLoadingMessage: function () {
                this.$el.find("#loading-animation").empty();
            },

            displayMedia: function () {
                if (this.currentMedia == 'photos') {
                    this.collection = new Photos();
                } else if (this.currentMedia == 'audio') {
                    this.collection = new Audio();
                } else {
                    this.collection = new Videos();
                }
                this.collection.setServerQuery("WHERE project = " + this.app.getProjectID());
                this.collection.fetch({reset: true});
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.collection, 'reset', this.hideLoadingMessage);
            },

            doSearch: function (e) {
                this.searchTerm = this.$el.find("#searchTerm").val();
                this.collection.doSearch(this.searchTerm, this.app.getProjectID());
                e.preventDefault();
            },

            clearSearch: function () {
                this.collection.clearSearch(this.app.getProjectID());
            },

            fetchMedia: function (e) {
                this.currentMedia = $(e.target).attr('data-value');
                this.collection = this.app.dataManager.getCollection(this.currentMedia);
                this.displayMedia();
                e.preventDefault();
            },

            addModels: function () {
                var selectedModels = [];
                this.collection.each(function (model) {
                    if (model.get("isSelected")) {
                        selectedModels.push(model);
                    }
                });
                this.parentModel.trigger('add-models-to-marker', selectedModels);
            }

        });
        return BrowserView;

    });
