define(["jquery",
        "underscore",
        "marionette",
        "handlebars",
        "lib/audio/audio-player",
        "text!../templates/thumb.html",
        "text!../templates/thumb-list.html"],
    function ($, _, Marionette, Handlebars, AudioPlayer, ThumbTemplate, ListTemplate) {
        'use strict';
        var ThumbView = Marionette.CompositeView.extend({

            //view that controls what each gallery item looks like:
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                        if (this.fields) {
                            this.model.set("fields", this.fields.toJSON());
                        }
                    },
                    template: Handlebars.compile(ThumbTemplate),
                    modelEvents: {
                        'saved': 'render',
                        'change': 'render'
                    },
                    events: {
                        "click .card-img-preview" : "selectedClass",
                        "click .card-site-field" : "selectedClass",
                        "click #audio-card" : "selectedClass"
                    },
                    selectedClass : function () {
                        $(".column").removeClass("selected-card");
                        this.$el.toggleClass("selected-card");
                    },

                    selectedClassMod : function () {
                        console.log("should trugger");
                        $(".column").addClass("selected-card");
                    },
                    onRender: function () {
                        if (this.app.dataType == "audio") {
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
                        var context = {
                                dataType: this.app.dataType
                            },
                            that = this;
                        /*  If this is a dynamic form, then set each field's val to
                            the model's field value. Then, in the template, loop through
                            the fields and output the alias and the val
                        */
                        if (this.fields) {
                            this.fields.each(function (field) {
                                field.set("val", that.model.get(field.get("col_name")));
                            });
                            context.fields = this.fields.toJSON();
                        }
                        if (this.model.get("geometry")) {
                            context.coords = this.model.printLatLng(3);
                        }
                        return context;
                    }
                });
            },
            childViewContainer: "#gallery-main",
            initialize: function (opts) {
                _.extend(this, opts);
                Marionette.CompositeView.prototype.initialize.call(this);

                this.render();
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
            },

            childViewOptions: function () {
                return {
                    app: this.app,
                    fields: this.fields
                };
            },


            getEmptyView: function () {
                console.log("empty", this.title);
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                    },
                    tagName: "p",
                    className: "empty",
                    template: Handlebars.compile('No "{{ title }}" found'),
                    templateHelpers: function () {
                        return {
                            title: this.app.dataType
                        };
                    }
                });
            },

            onRender: function () {
                this.$el.find("#loading-animation").empty();
            },

            template: function () {
                return Handlebars.compile(ListTemplate);
            },

            doSearch: function (term) {
                this.collection.doSearch(term, this.app.getProjectID(), this.fields);
            },

            clearSearch: function () {
                this.collection.clearSearch(this.app.getProjectID());
            }

        });
        return ThumbView;
    });
