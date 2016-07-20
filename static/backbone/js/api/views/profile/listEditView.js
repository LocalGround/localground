define(["jquery",
        "marionette",
        "views/profile/editItemView",
        "views/profile/createProjectView",
        "text!../../../templates/profile/list.html",
        "backgrid",
        "backgrid-paginator",
        "backbone-bootstrap-modal"
    ],
    function ($, Marionette, EditItemView, CreateProjectView, ListTemplate, Backgrid) {
        'use strict';
        var ListEditView = Marionette.CompositeView.extend({

            childViewOptions: function (model, index) {
                return {
                    updateMetadata: this.metadata,
                    EditItemTemplate: this.EditItemTemplate,
                    ItemTemplate: this.ItemTemplate,
                    mode: this.app.mode
                };
            },
            childView: EditItemView,
            childViewContainer : "#listContainer",
            paginator: null,
            events: {
                "click #saveChanges": "saveData",
                "click #deleteChanges": "deleteData",
                "click #createProject": "createProject",
                "click #edit-mode": "switchToEditMode",
                "click #list-mode": "switchToListMode",
                "click #thumbnail-mode": "switchToThumbnailMode",
                "click #checked": "updateChecked"
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.listenTo(this.collection, "filter-form-updated", this.relay);
            },

            onShow: function () {
                this.collection.fetch({ reset: true });
                this.collection.fetchFilterMetadata();
                this.toggleHeaderOptions();
                this.refreshPaginator();
            },
            relay: function (schema) {
                this.app.vent.trigger("filter-form-updated", schema);
            },

            updateChecked: function (e) {
                var id = $(e.currentTarget).data("id"),
                    item = this.collection.get(id);
                if ($(e.currentTarget).is(':checked')) {
                    item.set({checked : true});
                } else {
                    item.set({checked : false});
                }
            },

            saveData: function () {
                this.collection.each(function (item) {
                    item.trigger("save-if-edited");
                });
            },

            deleteData: function () {
                var that = this;
                this.collection.each(function (item) {
                    if (item.get("checked")) {
                        item.destroy({
                            success: function () {
                                that.collection.fetch({ reset: true });
                                this.refreshPaginator();
                            },
                            error: function(){
                                console.error('error');
                            }
                        });
                    }
                });
            },

            template: function () {
                return _.template(ListTemplate);
            },

            switchToEditMode: function (e) {
                //no need to replace entire view...just toggle the mode and re-render
                this.app.mode = "edit";
                this.render();
                this.toggleHeaderOptions();
                this.refreshPaginator();
                e.preventDefault();
            },

            switchToThumbnailMode: function (e) {
                //no need to replace entire view...just toggle the mode and re-render
                this.app.mode = "thumb";
                this.render();
                this.toggleHeaderOptions();
                this.refreshPaginator();
                e.preventDefault();
            },
            switchToListMode: function (e) {
                //no need to replace entire view...just toggle the mode and re-render
                this.app.mode = "list";
                this.render();
                this.toggleHeaderOptions();
                this.refreshPaginator();
                e.preventDefault();
            },

            refreshPaginator: function () {
                this.paginator = new Backgrid.Extension.Paginator({
                    collection: this.collection,
                    goBackFirstOnSort: false
                });
                this.$el.find('.container-footer').html(this.paginator.render().el);
            },

            toggleHeaderOptions: function () {
                var title = this.app.objectType.charAt(0).toUpperCase() + this.app.objectType.slice(1);
                this.$el.find('#headerTag').html(title);
                switch (this.app.mode) {
                    case "thumb":
                    case "list":
                        this.$el.find('#saveChanges').css("visibility" , "hidden");
                        this.$el.find('#deleteChanges').css("visibility" , "hidden");
                        this.$el.find('#createProject').css("visibility" , "hidden");
                        break;
                    default:
                        this.$el.find('#saveChanges').css("visibility" , "visible");
                        this.$el.find('#deleteChanges').css("visibility" , "visible");
                        if (this.app.objectType == "projects") {
                          this.$el.find('#createProject').css("visibility" , "visible");
                        }
                        else {
                          this.$el.find('#createProject').css("visibility" , "hidden");
                        }
                    break;
                }
            },

            createProject: function(){

              var view = new CreateProjectView(this.app.options);
              var modal = new Backbone.BootstrapModal({ content: view, okText : "Create Project", title : "Create New Project" });
              var that = this;

              modal.on('ok', function() {
                //Do some validation etc.
                modal.preventClose();
                that.app.vent.trigger("submit-create-project", modal);
                that.listenTo(that.app.vent, "project-saved", that.projectSaved);
              });
              modal.open();
            },

            projectSaved: function()
            {
              console.log("saved");
              this.collection.fetch({ reset: true });
              this.refreshPaginator();
            }

        });
        return ListEditView;
    });
