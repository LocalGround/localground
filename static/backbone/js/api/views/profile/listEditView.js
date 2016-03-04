define(["marionette",
        "collections/photos",
        "views/profile/editItemView",
        "text!../../../templates/profile/list.html"
    ],
    function (Marionette, Photos, EditItemView, ListTemplate) {
        'use strict';
        var ListEditView = Marionette.CompositeView.extend({

            childViewOptions: function (model, index) {
                return {
                    updateMetadata: this.photoMetadata
                };
            },
            childView: EditItemView, //moved model-level edit functionality to its own view
            events:{
                "click #saveChanges": "saveData",
                "click #deleteChanges": "deleteData",
                "click #viewEdit": "viewEdit",
                "click #viewStatic": "viewStatic",
                "click #checked": "updateChecked"
            },

            initialize: function (opts) {
                _.extend(this, opts);

                //fetch photo data:
                // this.collection = new Photos();
                this.collection = this.options.collection;
                this.listenTo(this.collection, 'reset', this.render);
                this.collection.fetch({ reset: true });

                //add event listeners:
                this.app.vent.on("apply-filter", this.doSomething, this);
                this.app.vent.on("clear-filter", this.doSomething, this);
            },

            updateChecked: function(e){

              var id = $(e.currentTarget).data("id");

              var item = this.collection.get(id);

              if($(e.currentTarget).is(':checked'))
              {
                 var name = item.set({checked : true});
              }
              else
              {
                 var name = item.set({checked : false});
              }
            },
            saveData: function(){
                this.collection.each(function (photo) {
                    photo.trigger("save-if-edited");
                });
            },
            deleteData: function(){
                this.collection.forEach(function(photo){
                    if (photo.get("checked")) {
                        photo.destroy({
                            success: function () {
                                this.collection.fetch({ reset: true });
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

            doSomething: function (term) {

                var parameters = [{name : "name", value : term}];
                console.log(parameters);
                this.collection.modifyUrl(parameters);
                this.collection.fetch({ reset: true });
            },
            viewEdit: function (e) {
                this.app.vent.trigger("show-edit-view",this.options);
            },
            viewStatic: function (e) {
                this.app.vent.trigger("show-static-view", this.options);
            }

        });
        return ListEditView;
    });
