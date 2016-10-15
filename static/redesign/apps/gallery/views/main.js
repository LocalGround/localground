define(["marionette",
        "underscore",
        "handlebars",
        "collections/Photos",
        "collections/Audio",
        "text!../templates/thumb.html",
        "text!../templates/thumb-list.html"],
    function (Marionette, _, Handlebars, Photos, Audio, ThumbTemplate, ListTemplate) {
        'use strict';
        var ThumbView = Marionette.CompositeView.extend({

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
                    tagName: "div",
                    className: "column",
                    templateHelpers: function () {
                        return { dataType: this.app.dataType };
                    }
                });
            },
            childViewContainer: "#gallery-main",
            initialize: function (opts) {
                _.extend(this, opts);

                // call Marionette's default functionality (similar to "super")
                Marionette.CompositeView.prototype.initialize.call(this);

                this.displayMedia();

                // when the fetch completes, call Backbone's "render" method
                // to create the gallery template and bind the data:
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.collection, 'reset', this.hideLoadingMessage);

                //listen to events that fire from other parts of the application:
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
                this.listenTo(this.app.vent, 'display-photos', this.displayPhotos);
                this.listenTo(this.app.vent, 'display-audio', this.displayAudio);
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

            doSearch: function (query) {
                this.collection.query = query;
                this.collection.fetch({ reset: true });
            },

            clearSearch: function () {
                this.collection.query = "";
                this.collection.fetch({ reset: true });
            },

            displayMedia: function () {
                //fetch data from server:
                if (this.app.dataType == "photo") {
                    this.collection = new Photos();
                } else if (this.app.dataType ==  "audio") {
                    this.collection = new Audio();
                } else {
                    alert("Type not accounted for.");
                    return;
                }
                //this.collection.query = "WHERE project = 4";
                this.collection.fetch({ reset: true });
            }

        });
        return ThumbView;
    });