define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "collections/photos",
    "collections/audio",
    "lib/audio/audio-player",
    "text!../templates/table.html",
    "text!../templates/thumb.html",
    "text!../templates/media-list-add.html"],
    function ($, _, Marionette, Handlebars, Photos, Audio,
              AudioPlayer, TableTemplate, ThumbTemplate, ParentTemplate) {
        'use strict';

        /*

        */
        var BrowserView = Marionette.CompositeView.extend({

            //view that controls what each gallery item looks like:
            currentMedia: "photos",
            lastSelectedModel: null,
           // template: function () {
           //     return Handlebars.compile(ParentTemplate);
           // },
            viewMode: "thumb",

            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                   //     if (this.parent.viewMode == "thumb") {
                   //         this.className = "column";
                   //     } else if (this.parent.viewMode == "table") {
                   //        this.className = "table";       
                   //     }
                        this.render();
                    },
                    getTemplate: function () {
                        
                        if (this.parent.viewMode == "thumb") {
                            return Handlebars.compile(ThumbTemplate);
                        } else if (this.parent.viewMode == "table") {
                           return Handlebars.compile(TableTemplate);       
                        }
                    },
                    modelEvents: {
                        'saved': 'render'
                    },
                    events: {
                        'click .card-img-preview' : 'selectedClass',
                        'click .audio-simple' : 'selectedClass',
                        'click td' : "selectedTableRow"
                    },

                    doSelection: function (e) {
                        console.log(e.target.tagName);
                        if(e.target.tagName == "TR") {
                            this.selectedTableRow(e);
                        } else if ($(e.target).hasClass("table")) {
                            this.selectedClass(e);
                        }
                    },

                    selectedClass: function (e) {

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
                        console.log("select class");
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

                    selectedTableRow : function (e) {
                        console.log("row selected");

                        if (!e.metaKey && !e.shiftKey){
                            $(".table").removeClass("selected-card");
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
                                var rows = this.$el.parent().children(".table");

                                //*
                                for (var i = startIndex+1; i < endIndex; ++i){
                                    var currModel = this.model.collection.models[i];
                                    var currColumn = rows.eq(i);
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
                        console.log("select class");
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
                        this.getTemplate();
                        if (this.currentMedia == "audio") {
                            var player = new AudioPlayer({
                                model: this.model,
                                audioMode: "simple",
                                app: this.app
                            });
                            this.$el.find(".player-container").append(player.$el);
                        }
                        //set the proper class for child tag
                     //   if (this.parent.viewMode == "thumb") {
                     //       this.$el.addClass("column");
                     //   } else if (this.parent.viewMode == "table") {
                     //       this.$el.addClass("table"); 
                     //   }
                    },
                    
               /*     tagName: function () {
                        if (this.parent.viewMode == "thumb") {
                            return "div";
                        } else if (this.parent.viewMode == "table") {
                            return "tr";
                        }
                    }, */
                 //   tagName: "tr",
                 //   className: function () {
                 //       console.log(this.parent);
                 //       if (this.parent.viewMode == "thumb") {
                 //           return "column";
                 //       } else if (this.parent.viewMode == "table") {
                 //          return "table";       
                 //       }
                 //   },  
                    
                 //   className: "column",
                    templateHelpers: function () {
                        return {
                            dataType: this.currentMedia,

                        };
                    }
                });
            },
            childViewContainer: "#gallery-main",
            initialize: function (opts) {
                _.extend(this, opts);

                // call Marionette's default functionality (similar to "super")
                Marionette.CompositeView.prototype.initialize.call(this);
                this.template = Handlebars.compile(ParentTemplate);
                //this.render();
                //this.collection = this.app.dataManager.getCollection(this.currentMedia);
                this.displayMedia();
            },

            templateHelpers: function () {
                console.log(this.viewMode);
                return {
                    viewMode: this.viewMode
                };
                
            },

            childViewOptions: function () {
                //console.log(this.viewMode);
                //console.log(this.determineChildViewTag);
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
                } else if (vm == "table") {
                    return "tr";
                }
            },

            determineChildViewClassName: function (vm) {
                if (vm == "thumb") {
                    return "column";
                } else if (vm == "table") {
                    return "table";
                }
            },

            events: {
                "click #media-audio" : "changeToAudio",
                "click #media-photos" : "changeToPhotos",
                'click #card-view-button-modal' : 'displayCards',
                'click #table-view-button-modal' : 'displayTable',
            },
            
            displayCards: function() {
                console.log("thumb view?");
                this.viewMode = "thumb";
                this.render();
              
            /*  
                $(".button-secondary").removeClass("active");
                $("#card-view-button-modal").addClass("active");
                this.getChildView();
            */
            },
            
            displayTable: function() {
                console.log("table view?");
                this.viewMode = "table";
                console.log(this.viewMode);
                this.render();
           /*
                $(".button-secondary").removeClass("active");
                $("#table-view-button-modal").addClass("active");
                this.getChildView();
            */
            },

            hideLoadingMessage: function () {
                this.$el.find("#loading-animation").empty();
                
            },

            displayMedia: function () {
                if (this.currentMedia == 'photos') {
                    this.collection = new Photos();
                } else {
                    this.collection = new Audio();
                }
                this.collection.fetch({reset: true});
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.collection, 'reset', this.hideLoadingMessage);
                /*
                this.collection = this.app.dataManager.getCollection(this.currentMedia);
                //this.collection.fetch({reset: true});
                this.render();
                this.hideLoadingMessage();
                */
            },
            changeToAudio: function () {
                this.currentMedia = "audio";
                this.collection = this.app.dataManager.getCollection(this.currentMedia);
                this.displayMedia();
            },

            changeToPhotos: function(){
                this.currentMedia = "photos";
                this.collection = this.app.dataManager.getCollection(this.currentMedia);
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
