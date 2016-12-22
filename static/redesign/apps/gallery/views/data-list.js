define(["marionette",
        "underscore",
        "handlebars",
        "collections/photos",
        "collections/audio",
        "collections/records",
        "collections/fields",
        "text!../templates/thumb.html",
        "text!../templates/thumb-list.html"],
    function (Marionette, _, Handlebars, Photos, Audio, Records, Fields, ThumbTemplate, ListTemplate) {
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
                        'saved': 'render'
                    },
                    events: {
                        "click .card-img-preview" : "selectedClass"
                    },
                    selectedClass : function () {
                        console.log("selected");
                        $( ".column" ).children("h1").toggleClass( "selected-card" );
                        $( ".column" ).children("h2").toggleClass( "selected-card" );
                        $( ".column" ).children("i").toggleClass( "selected-icon" );
                        
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
                        return context;
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

            doSearch: function (query) {
                query = "WHERE " + query + " AND project = " + this.app.selectedProject.id;
                this.collection.query = query;
                this.collection.fetch({ reset: true });
            },

            clearSearch: function () {
                this.collection.query = this.getDefaultQueryString();
                this.collection.fetch({ reset: true });
            },

            displayMedia: function () {
                //fetch data from server:
                var that = this,
                    id;
                if (this.app.dataType == "photos") {
                    this.collection = new Photos();
                } else if (this.app.dataType ==  "audio") {
                    this.collection = new Audio();
                } else if (this.app.dataType.indexOf("form_") != -1) {
                    id = this.app.dataType.split("_")[1];
                    // column names:
                    this.fields = new Fields(null, {
                        id: id
                    });
                    this.collection = new Records(null, {
                        url: '/api/0/forms/' + id + '/data/'
                    });
                    this.fields.fetch({
                        success: function () {
                            that.collection.fetch({ reset: true });
                        }
                    });
                } else {
                    alert("Type not accounted for.");
                    return;
                }
                this.collection.query = this.getDefaultQueryString();
                this.collection.fetch({ reset: true });
            }

        });
        return ThumbView;
    });