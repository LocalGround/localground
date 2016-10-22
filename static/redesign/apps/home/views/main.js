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
                        alert("Show create project text box");
                    }
                });
            },
            /****************************************/
            /*          End Child View Code         */
            /****************************************/

            searchTerm: null,
            childViewContainer: "#gallery-main",
            events: {
                'click #search': 'doSearch',
                'click #clear': 'clearSearch'
            },
            template: Handlebars.compile(ListTemplate),
            templateHelpers: function () {
                return {
                    searchTerm: this.searchTerm
                };
            },
            initialize: function (opts) {
                _.extend(this, opts);

                // call Marionette's default functionality (similar to "super")
                Marionette.CompositeView.prototype.initialize.call(this);

                this.displayProjects();

                // when the fetch completes, call Backbone's "render" method
                // to create the gallery template and bind the data:
                this.listenTo(this.collection, 'reset', this.render);
            },
            hideLoadingMessage: function () {
                this.$el.find(this.childViewContainer).empty();
            },

            getSearchString: function () {
                this.searchTerm = this.$el.find("#project-search").val();
                return "name like %" + this.searchTerm +
                        "% OR caption like %" + this.searchTerm +
                        "%";
            },

            doSearch: function (e) {
                this.collection.query = "WHERE " + this.getSearchString();
                this.collection.fetch({ reset: true });
                e.preventDefault();
            },

            clearSearch: function (e) {
                this.searchTerm = null;
                this.collection.query = "";
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