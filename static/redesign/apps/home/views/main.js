define(["marionette",
        "underscore",
        "handlebars",
        "apps/home/views/projectItemView",
        "collections/projects",
        "models/project",
        "text!../templates/project-list.html",
        "text!../templates/share-form.html",],
    function (Marionette, _, Handlebars, ProjectItemView,
      Projects, Project, ListTemplate, ShareForm) {
        'use strict';
        var ProjectListView = Marionette.CompositeView.extend({

            //moved to projectItemView.js
            childView: ProjectItemView,
            searchTerm: null,
            childViewContainer: "#gallery-main",
            events: {
                'click .close': 'hideModal',
                'click #add-project': 'showModal',
                'click #search': 'doSearch',
                'click #confirm-add': 'confirmAdd'
            },
            childViewOptions: function () {
                return { app: this.app };
            },
            hideModal: function () {
                var modal = this.$el.find('#share-modal').get(0);
                modal.style.display = "none";
            },
            showModal: function () {
                this.app.vent.trigger('share-project', { model: null });
            },
            /*
              This function will eventually be ceased due to integration
              with the share-form html and share-form js files
            */
            confirmAdd: function () {
                var that = this;

                var newProject = new Project();
                newProject.set("name", this.$el.find("#name").val());
                newProject.set("caption", this.$el.find("#caption").val());
                newProject.set("tags", this.$el.find("#tags").val());
                newProject.set("slug", this.$el.find("#slug").val());
                newProject.set("access_authority",
                               this.$el.find("#access_authority").val());
                newProject.save();

                this.listenTo(newProject,'sync', this.displayProjects);
                //console.log(newProject);

                //close the modal window
                var modal = document.getElementById('share-modal');
                modal.style.display = "none";
            },

            template: Handlebars.compile(ListTemplate),

            initialize: function (opts) {
                _.extend(this, opts);

                Marionette.CompositeView.prototype.initialize.call(this);

                this.displayProjects();

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

                // Make sure the event below stays inside so that
                // the projects are always added in
                // without manually refreshing the page

                // when the fetch completes, call Backbone's "render" method
                // to create the gallery template and bind the data:
                this.listenTo(this.collection, 'reset', this.render);
            }

        });
        return ProjectListView;
    });
