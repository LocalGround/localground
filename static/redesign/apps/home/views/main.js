define(["marionette",
        "underscore",
        "handlebars",
        "collections/projects",
        "text!../templates/project-item.html",
        "text!../templates/project-list.html"],
    function (Marionette, _, Handlebars, Projects, ItemTemplate, ListTemplate) {
        'use strict';
        var ProjectListView = Marionette.CompositeView.extend({

            /****************************************/
            /*         Begin Child View Code        */
            /****************************************/
            getChildView: function () {
                return Marionette.ItemView.extend({
                    initialize: function (opts) {
                        _.extend(this, opts);
                    },
                    template: Handlebars.compile(ItemTemplate),
                    events: {
                        'click .action': 'showModal'
                    },
                    showModal: function () {
                        alert("Show share project modal form");
                    }
                });
            },
            /****************************************/
            /*          End Child View Code         */
            /****************************************/

            searchTerm: null,
            childViewContainer: "#gallery-main",
            events: {
                'click #add-project': 'addProject',
                'click #search': 'doSearch'
            },
            addProject: function () {
                alert("Show create project modal form");
            },
            template: Handlebars.compile(ListTemplate),

            initialize: function (opts) {
                _.extend(this, opts);

                Marionette.CompositeView.prototype.initialize.call(this);

                this.displayProjects();

                // when the fetch completes, call Backbone's "render" method
                // to create the gallery template and bind the data:
                this.listenTo(this.collection, 'reset', this.render);

                //listen to events that fire from other parts of the application:
                this.listenTo(this.app.vent, 'search-requested', this.doSearch);
                this.listenTo(this.app.vent, 'clear-search', this.clearSearch);
            },
            hideLoadingMessage: function () {
                this.$el.find(this.childViewContainer).empty();
            },

            getDefaultQueryString: function () {
                return "WHERE project = " + this.app.selectedProject.id;
            },
            templateHelpers: function () {
                return {
                    searchTerm: this.searchTerm
                };
            },
            doSearch: function (e) {
                e.preventDefault();
                var term = this.$el.find("#searchTerm").val(),
                    query = "WHERE name like %" + term +
                            "% OR caption like %" + term +
                            "% OR owner like %" + term +
                            "% OR tags contains (" + term + ")";
                this.searchTerm = term;
                this.collection.query = query;
                this.collection.fetch({ reset: true });
            },

            clearSearch: function (e) {
                this.collection.query = this.getDefaultQueryString();
                this.collection.fetch({ reset: true });
                e.preventDefault();
            },

            displayProjects: function () {
                //fetch data from server:
                this.collection = new Projects();
                this.collection.fetch({ reset: true });
            }

        });
        return ProjectListView;
    });