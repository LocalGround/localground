define(["marionette",
        "underscore",
        "handlebars",
        "collections/projects",
        "text!../templates/project-item.html",
        "text!../templates/project-list.html"],
    function (Marionette, _, Handlebars, Projects, ItemTemplate, ListTemplate) {
        'use strict';
        var ProjectListView = Marionette.CompositeView.extend({

            //view that controls what each gallery item looks like:
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                    },
                    template: Handlebars.compile(ItemTemplate),
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

                this.displayProjects();

                // when the fetch completes, call Backbone's "render" method
                // to create the gallery template and bind the data:
                this.listenTo(this.collection, 'reset', this.render);
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
                query = "WHERE " + query;
                this.collection.query = query;
                this.collection.fetch({ reset: true });
            },

            clearSearch: function () {
                this.collection.query = "";
                this.collection.fetch({ reset: true });
            },

            displayProjects: function () {
                //fetch data from server:
                this.collection = new Projects();
                this.collection.fetch({ reset: true });
            }

        });
        return ProjectListView;
    });