define(["marionette",
        "underscore",
        "handlebars",
        "collections/projects",
        "models/project",
        "text!../templates/project-item.html",
        "text!../templates/project-list.html"],
    function (Marionette, _, Handlebars, Projects, Project, ItemTemplate, ListTemplate) {
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
                        alert("child method");
                    }
                });
            },
            /****************************************/
            /*          End Child View Code         */
            /****************************************/

            searchTerm: null,
            childViewContainer: "#gallery-main",
            events: {
                'click #add-project': 'showModal',
                'click #search': 'doSearch',
                'click #confirm-add': 'confirmAdd'
            },
            showModal: function () {
                //alert("Show share project modal form");

                // Get the modal
                var modal = document.getElementById('myModal');

                // Get the button that opens the modal
                var btn = document.getElementById("add-project");

                // Get the <span> element that closes the modal
                var span = document.getElementsByClassName("close")[0];

                // When the user clicks the button, open the modal
                btn.onclick = function() {
                    modal.style.display = "block";
                }

                // When the user clicks on <span> (x), close the modal
                span.onclick = function() {
                    modal.style.display = "none";
                }

                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
            },
            confirmAdd: function () {
                var that = this;
                alert("Add!");
                console.log(this.collection.models); // Print out projects
                //create a new project model:
                var newProject = new Project();
                newProject.set("name", this.$el.find("#name").val());
                newProject.set("caption", this.$el.find("#caption").val());
                newProject.set("tags", this.$el.find("#tags").val());
                newProject.set("slug", this.$el.find("#slug").val());
                newProject.set("access_authority",
                               this.$el.find("#access_authority").val());
                newProject.save();

                //todo: once project has  been posted to database,
                //figure out how to call the displayProjects method again
                //and also close the modal. This code below isn't working:
                this.listenTo(newProject,'sync', this.displayProjects);
                console.log(newProject);

                //close the modal window
                var modal = document.getElementById('myModal');
                modal.style.display = "none";
            },

            // A 'dummy' function that was used for Add Project Button
            addProject: function () {
                alert("Show create project modal form");


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
