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
                        /*if (e.shiftKey){
                            // Needs work so that multiple instances can be selected
                            // in either direction

                            if (this.lastSelectedColumn == null){
                                //this.$el.toggleClass("selected-card");
                                if (this.$el.hasClass("selected-card")) {
                                    this.$el.removeClass("selected-card");
                                    this.model.set("isSelected", false);
                                } else {
                                    this.$el.addClass("selected-card");
                                    this.model.set("isSelected", true);
                                }
                            } else {
                                console.log(this.lastSelectedColumn.parent());
                                console.log(this.lastSelectedColumn.parent().children(".column"));
                                var columns = this.lastSelectedColumn.parent().children(".column");
                                var startIndex = columns.index(this.$el);
                                var endIndex = columns.index(this.lastSelectedColumn);
                                console.log("Start index: " + startIndex + "; End Index: " + endIndex);
                                for (var i = startIndex; i < endIndex; ++i){
                                    console.log(columns[i]);
                                    //columns[i].toggleClass("selected-card");
                                }
                            }

                        }
                        */
                        //
                        //
                        //
                        console.log(this.model);
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
                            // Get the previously clicked model first
                            // then get the currently clicked model

                            // afterwards, get index values of the two models
                            // from the collection
                            // to determine start and end points

                            // then use the for loop to highlight
                            // the items ranged between current and previous selected

                            if (hasPrevModel){
                                var previousModel, currentModel,
                                    startIndex, endIndex;

                                previousModel = this.parent.lastSelectedModel;
                                currentModel = this.model;
                                console.log(this.model.collection.indexOf(previousModel));
                                console.log(this.model.collection.indexOf(currentModel));
                                if (this.model.collection.indexOf(previousModel) <
                                    this.model.collection.indexOf(currentModel)){
                                    startIndex = this.model.collection.indexOf(previousModel);
                                    endIndex = this.model.collection.indexOf(currentModel);
                                }
                                else {
                                    endIndex = this.model.collection.indexOf(previousModel);
                                    startIndex = this.model.collection.indexOf(currentModel);
                                }

                                console.log(this.$el.parent());
                                console.log(this.$el.parent().children(".column"));
                                var columns = this.$el.parent().children(".column");

                                //*
                                for (var i = startIndex; i < endIndex; ++i){
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
                        //console.log(this.model.collection);


                        //this.lastSelectedColumn = this.$el;
                        e.preventDefault();

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
                    currentMedia: this.currentMedia,
                    lastSelectedModel: this.lastSelectedColumn,
                    parent: this
                };
            },

            events: {
                "click #media-audio" : "changeToAudio",
                "click #media-photos" : "changeToPhotos",
                'click': "checkForSelection"
            },

            checkForSelection: function (e) {
                if (e.shiftKey) {
                    console.log("Shift + Click");
                } else if (e.metaKey) {
                    console.log("Command + Click");
                } else {
                    console.log("Other Click");
                }
                console.log(this.collection);
                e.preventDefault();
            },

            hideLoadingMessage: function () {
                this.$el.find("#loading-animation").empty();
            },

            template: function () {
                return Handlebars.compile(ListTemplate);
            },

            displayMedia: function () {
                console.log(this.currentMedia);
                if (this.currentMedia == "photos") {
                    this.collection = new Photos();
                }
                else if (this.currentMedia == "audio") {
                    this.collection = new Audio();
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
                var selectedModels = [];
                this.collection.each(function (model) {
                    if (model.get("isSelected")) {
                        selectedModels.push(model);
                    }
                });
                this.app.vent.trigger('add-models-to-marker', selectedModels);
            }

        });
        return BrowserView;

    }
);
