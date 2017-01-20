define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "collections/photos",
    "collections/audio",
    "text!../templates/thumb.html",
    "text!../templates/thumb-list.html"],
    function ($, _, Marionette, Handlebars, Photos, Audio,
              ThumbTemplate, ListTemplate){
        'use strict';

        /*

        */
        var BrowserView = Marionette.CompositeView.extend({

            //view that controls what each gallery item looks like:
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                    },
                    template: Handlebars.compile(ThumbTemplate),
                    modelEvents: {
                        'saved': 'render'
                    },
                    events: {
                        "click .card-img-preview" : "selectedClass",
                        "click .card-site-field" : "selectedClass"
                    },
                    selectedClass : function () {
                        $(".column").removeClass("selected-card");
                        this.$el.toggleClass("selected-card");
                    },
                    tagName: "div",
                    className: "column",
                    templateHelpers: function () {
                        var context = {
                                dataType: this.app.dataType
                            },
                            that = this;

                        return context;
                    }
                });
            },
            childViewContainer: "#gallery-main",
            initialize: function (opts) {
                _.extend(this, opts);

                // call Marionette's default functionality (similar to "super")
                Marionette.CompositeView.prototype.initialize.call(this);

                this.app.dataType = "photos";
                this.displayMedia();

                // when the fetch completes, call Backbone's "render" method
                // to create the gallery template and bind the data:
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.collection, 'reset', this.hideLoadingMessage);

                //listen to events that fire from other parts of the application:
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
            },

            childViewOptions: function () {
                return {
                    app: this.app,
                    fields: this.fields
                };
            },

            hideLoadingMessage: function () {
                this.$el.find(this.childViewContainer).empty();
            },

            template: function () {
                return Handlebars.compile(ListTemplate);
            },

            getDefaultQueryString: function () {
                return "WHERE project = " + this.app.selectedProject.id;
            },

            doSearch: function (term) {
                // query = "WHERE " + query + " AND project = " + this.app.selectedProject.id;
                //
                //
                this.collection.doSearch(term, this.app.selectedProject.id);
                //this.collection.fetch({ reset: true });
            },

            clearSearch: function () {
                //this.collection.query = this.getDefaultQueryString();
                //this.collection.fetch({ reset: true });
                this.collection.clearSearch();
            },

            displayMedia: function () {
                //fetch data from server:
                var that = this,
                    id;
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
        return BrowserView;

});
