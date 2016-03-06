define(["marionette",
        "views/profile/editItemView",
        "text!../../../templates/profile/list.html"
    ],
    function (Marionette, EditItemView, ListTemplate) {
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
            events:{
                "click #saveChanges": "saveData",
                "click #deleteChanges": "deleteData",
                "click #viewEdit": "viewEdit",
                "click #viewStatic": "viewStatic",
                "click #checked": "updateChecked"
            },

            initialize: function (opts) {
                _.extend(this, opts);
            },

            onShow: function () {
                this.collection.fetch({ reset: true });
            },

            updateChecked: function(e){
                var id = $(e.currentTarget).data("id");
                var item = this.collection.get(id);
                if ($(e.currentTarget).is(':checked')) {
                    item.set({checked : true});
                } else {
                    item.set({checked : false});
                }
            },

            saveData: function(){
                this.collection.each(function (photo) {
                    photo.trigger("save-if-edited");
                });
            },

            deleteData: function(){
                var that = this;
                this.collection.forEach(function(photo){
                    if (photo.get("checked")) {
                        photo.destroy({
                            success: function () {
                                that.collection.fetch({ reset: true });
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
                e.preventDefault();
            },

            viewStatic: function (e) {
                //no need to replace entire view...just toggle the mode and re-render
                this.app.mode = "view";
                this.render();
                e.preventDefault();
            }
        });
        return ListEditView;
    });
