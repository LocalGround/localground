define(["jquery",
        "marionette",
        "views/profile/editItemView",
        "text!../../../templates/profile/list.html",
        "backgrid",
        "backgrid-paginator"
    ],
    function ($, Marionette, EditItemView, ListTemplate, Backgrid) {
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
                "click #viewEdit": "viewEdit",
                "click #viewStatic": "viewStatic",
                "click #checked": "updateChecked"
            },

            initialize: function (opts) {
                _.extend(this, opts);
                this.listenTo(this.collection, "filter-form-updated", this.relay);
            },

            onShow: function () {
                this.collection.fetch({ reset: true });
                this.collection.fetchFilterMetadata();
                var title = this.app.objectType.charAt(0).toUpperCase() + this.app.objectType.slice(1);
                this.$el.find('#headerTag').html(title);
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

            viewEdit: function (e) {
                //no need to replace entire view...just toggle the mode and re-render
                this.app.mode = "edit";
                this.render();
                this.refreshPaginator();
                e.preventDefault();
            },

            viewStatic: function (e) {
                //no need to replace entire view...just toggle the mode and re-render
                this.app.mode = "view";
                this.render();
                this.refreshPaginator();
                e.preventDefault();
            },

            refreshPaginator: function () {
                this.paginator = new Backgrid.Extension.Paginator({
                    collection: this.collection,
                    goBackFirstOnSort: false
                });
                this.$el.find('.container-footer').html(this.paginator.render().el);
            }

        });
        return ListEditView;
    });
