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
                "click .fetch-btn" : "toggleMedia",
                'click #card-view-button-modal' : 'displayCards',
                'click #table-view-button-modal' : 'displayTable',
                'click #toolbar-search': 'doSearch'
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.collection = this.app.dataManager.getCollection(this.currentMedia);
                Marionette.CompositeView.prototype.initialize.call(this);
                this.template = Handlebars.compile(ParentTemplate);

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
                return (vm === "thumb") ? "div" : "tr";
            },

            determineChildViewClassName: function (vm) {
                return (vm === "thumb") ? "column" : "table";
            },

            displayCards: function () {
                this.viewMode = "thumb";
                this.render();
            },

            displayTable: function () {
                this.viewMode = "table";
                this.render();
            },

            doSearch: function (e) {
                this.searchTerm = this.$el.find("#searchTerm").val();
                this.collection.doSearch(this.searchTerm, this.app.getProjectID());
                e.preventDefault();
            },

            clearSearch: function () {
                this.collection.clearSearch(this.app.getProjectID());
            },

            toggleMedia: function (e) {
                this.currentMedia = $(e.target).attr('data-value');
                this.collection = this.app.dataManager.getCollection(this.currentMedia);
                this.render();
                e.preventDefault();
            },

            addModels: function () {
                var selectedModels = [];
                this.collection.each(function (model) {
                    if (model.get("isSelected")) {
                        selectedModels.push(model);
                    }
                });
                //for gallery:
                this.parentModel.trigger('add-models-to-marker', selectedModels);
                //for spreadsheet:
                this.app.vent.trigger('add-models-to-marker', selectedModels);
            }

        });
        return BrowserView;

    });
