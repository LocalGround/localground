define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "collections/photos",
    "collections/audio",
    "lib/audio/audio-player",
    "text!templates/thumb.html",
    "text!templates/media-list.html"],
    function ($, _, Marionette, Handlebars, Photos, Audio,
              AudioPlayer, ThumbTemplate, ListTemplate) {
        'use strict';

        /*

        */
        var Uploader = Marionette.CompositeView.extend({

            //view that controls what each gallery item looks like:
            currentMedia: "photos",
            lastSelectedModel: null,
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
                        "click" : "selectedClass"
                    },
                    selectedClass : function (e) {

                        if (!e.metaKey && !e.shiftKey){
                            $(".column").removeClass("selected-card");
                            this.model.collection.each(function(model){
                                model.set("isSelected", false);
                            })
                        }

                        if (e.shiftKey){
                            var hasPrevModel = true;
                            if (this.parent.lastSelectedModel == null){
                                hasPrevModel = false;
                            }

                            if (hasPrevModel){
                                var previousModel, currentModel,
                                    startIndex, endIndex;

                                previousModel = this.parent.lastSelectedModel;
                                currentModel = this.model;
                                if (this.model.collection.indexOf(previousModel) <
                                    this.model.collection.indexOf(currentModel)){
                                    startIndex = this.model.collection.indexOf(previousModel);
                                    endIndex = this.model.collection.indexOf(currentModel);
                                }
                                else {
                                    endIndex = this.model.collection.indexOf(previousModel);
                                    startIndex = this.model.collection.indexOf(currentModel);
                                }
                                var columns = this.$el.parent().children(".column");

                                //*
                                for (var i = startIndex+1; i < endIndex; ++i){
                                    var currModel = this.model.collection.models[i];
                                    var currColumn = columns.eq(i);
                                    if (!currColumn.hasClass("selected-card"))
                                    {
                                        currColumn.addClass("selected-card");
                                        currModel.set("isSelected", true);
                                    } else {
                                        currColumn.removeClass("selected-card");
                                        currModel.set("isSelected", false);

                                    }
                                }
                                //*/

                            }

                        }
                        if (this.$el.hasClass("selected-card")) {
                            this.$el.removeClass("selected-card");
                            this.model.set("isSelected", false);
                        } else {
                            this.$el.addClass("selected-card");
                            this.model.set("isSelected", true);
                            this.parent.lastSelectedModel = this.model;
                        }
                        e.preventDefault();

                    },

                    onRender: function(){
                        if (this.currentMedia == "audio") {
                            var player = new AudioPlayer({
                                model: this.model,
                                audioMode: "simple",
                                app: this.app
                            });
                            this.$el.find(".player-container").append(player.$el);
                        }
                    },

                    tagName: "div",
                    className: "column",
                    templateHelpers: function () {
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
                    currentMedia: this.currentMedia,
                    lastSelectedModel: this.lastSelectedColumn,
                    parent: this
                };
            },

            events: {
                "click #media-audio" : "changeToAudio",
                "click #media-photos" : "changeToPhotos",
            },

            hideLoadingMessage: function () {
                this.$el.find("#loading-animation").empty();
            },

            template: function () {
                return Handlebars.compile(ListTemplate);
            },

            displayMedia: function () {
                if (this.currentMedia == "photos") {
                    this.collection = new Photos();
                }
                else if (this.currentMedia == "audio") {
                    this.collection = new Audio();

                    // There must be a for loop to handle creation of the
                    // audio players
                }
                // after you re-initialize the collection, you have to
                // attach all of the Marionette default event handlers
                // in order for this to work:
                this._initialEvents();
                this.collection.fetch({ reset: true });
            },
            changeToAudio: function () {
                this.currentMedia = "audio";
                this.displayMedia();
            },

            changeToPhotos: function(){
                this.currentMedia = "photos";
                this.displayMedia();
            },

            addModels: function () {
                console.log('uploader: addModels');
                var selectedModels = [];
                this.collection.each(function (model) {
                    if (model.get("isSelected")) {
                        selectedModels.push(model);
                    }
                });
                this.app.vent.trigger('add-models-to-marker', selectedModels);
            }

        });
        return Uploader;

    }
);
