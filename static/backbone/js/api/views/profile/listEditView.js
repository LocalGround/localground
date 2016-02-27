define(["marionette",
        "collections/photos",
        "text!../../../templates/profile/item.html",
        "text!../../../templates/profile/list.html"],
    function (Marionette, Photos, ItemTemplate, ListTemplate) {
        'use strict';
        var ListEditView = Marionette.CompositeView.extend({

            childView: Marionette.ItemView.extend({
                template: _.template(ItemTemplate),
                tagName: "div",
                modelEvents: {'change': 'render'}
            }),
            events:{
              "click #saveChanges": "saveData",
              "click #deleteChanges": "deleteData",
              "change #name" : "updateName",
              "change #description" : "updateDescription",
              "change #project" : "updateProject",
              "change #tags" : "updateTags",
              "change #creator" : "updateCreator",
              "click #viewEdit": "viewEdit",
              "click #viewStatic": "viewStatic",
              "click #checked": "updateChecked"
            },

            initialize: function (opts) {
                _.extend(this, opts);

                //fetch photo data:
                this.collection = new Photos();
                this.listenTo(this.collection, 'reset', this.render);
                this.collection.fetch({ reset: true });

                //add event listeners:
                this.app.vent.on("apply-filter", this.doSomething, this);
                this.app.vent.on("clear-filter", this.doSomething, this);
            },
            updateName: function(e){

              var id = $(e.currentTarget).data("id");
              var tempValue = $(e.currentTarget).val();
              var item = this.collection.get(id);
              var name = item.set({name : tempValue});

            },
            updateDescription: function(e){

              var id = $(e.currentTarget).data("id");
              var tempValue = $(e.currentTarget).val();
              var item = this.collection.get(id);
              var name = item.set({caption : tempValue});

            },
            updateProject: function(e){

              var id = $(e.currentTarget).data("id");
              var tempValue = $(e.currentTarget).val();
              var item = this.collection.get(id);
              var name = item.set({project_id : tempValue});

            },
            updateTags: function(e){

              var id = $(e.currentTarget).data("id");
              var tempValue = $(e.currentTarget).val();
              var item = this.collection.get(id);
              var name = item.set({tags : tempValue});

            },
            updateCreator: function(e){

              var id = $(e.currentTarget).data("id");
              var tempValue = $(e.currentTarget).val();
              var item = this.collection.get(id);
              var name = item.set({owner : tempValue});

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
                this.collection.forEach(function(photo){
                        photo.save({  success: function(model, response){
                                        this.collection.fetch({ reset: true });
                                      },
                                      error: function(){
                                        console.log('error');
                                      }
                                    });
                      });

            },
            deleteData: function(){
                this.collection.forEach(function(photo){
                        if(photo.get("checked"))
                        {
                          photo.destroy({  success: function(){
                                          this.collection.fetch({ reset: true });
                                        },
                                        error: function(){
                                          console.log('error');
                                        }
                                      });

                        }
                      });

            },

            template: function () {
                return _.template(ListTemplate);
            },

            doSomething: function (term) {
                console.log('do something with "' + term + '" term');
            },
            viewEdit: function (e) {
                this.app.vent.trigger("show-edit-view",this.options);
            },
            viewStatic: function (e) {
                this.app.vent.trigger("show-static-view", this.options);
            },

        });
        return ListEditView;
    });
