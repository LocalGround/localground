define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "collections/photos",
    "collections/audio",
    "text!../templates/thumb.html",
    "text!../templates/media-list.html"],
    function ($, _, Marionette, Handlebars, Photos, Audio,
              ThumbTemplate, ListTemplate) {
        'use strict';

        /*

        */
        var BrowserView = Marionette.CompositeView.extend({

            //view that controls what each gallery item looks like:
            currentMedia: "photos",
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
                        //console.log(this.currentMedia);
                        return {
                            dataType: this.currentMedia
                        };
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
            },

            childViewOptions: function () {
                return {
                    app: this.app,
                    currentMedia: this.currentMedia
                };
            },

            events: {
                "click #media-audio" : "changeToAudio",
                "click #media-photos" : "changeToPhotos"
            },

            hideLoadingMessage: function () {
                this.$el.find("#loading-animation").empty();
            },

            template: function () {
                return Handlebars.compile(ListTemplate);
            },

            displayMedia: function () {
                console.log(this.currentMedia);
                if (this.currentMedia == "photos"){
                    this.collection = new Photos();
                }
                else if (this.currentMedia == "audio"){
                    this.collection = new Audio();
                }
                this.collection.fetch({ reset: true });
            },

            changeToAudio: function(){
                this.currentMedia = "audio";
                this.displayMedia();
            },

            changeToPhotos: function(){
                this.currentMedia = "photos";
                this.displayMedia();
            },

        });
        return BrowserView;

    });
