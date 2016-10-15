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

                this.displayMedia();
                // when the fetch completes, call Backbone's "render" method
                // to create the gallery template and bind the data:
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.collection, 'reset', this.hideLoadingMessage);

                // call Marionette's default functionality (similar to "super")
                Marionette.CompositeView.prototype.initialize.call(this);

                //listen for events
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
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
            doSearch: function (term) {
                alert("TODO: search for: " + term);
            },
            displayMedia: function () {
                //fetch data from server:
                switch (this.app.dataType) {
                    case "photo":
                        this.collection = new Photos();
                        break;
                    case "audio":
                        this.collection = new Audio();
                        break;
                }
                this.collection.query = "WHERE project = 4";
                this.collection.fetch({ reset: true });
            }

        });
        return ThumbView;
    });