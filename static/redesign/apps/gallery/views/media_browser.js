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
              ThumbTemplate, ListTemplate) {
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
                        return {
                            dataType: "photos"
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
                    app: this.app
                };
            },

            hideLoadingMessage: function () {
                this.$el.find("#loading-animation").empty();
            },

            template: function () {
                return Handlebars.compile(ListTemplate);
            },

            displayMedia: function () {
                this.collection = new Photos();
                this.collection.fetch({ reset: true });
            }

        });
        return BrowserView;

    });
