define(["marionette",
        "collections/photos",
        "views/profile/itemView",
        "text!../../../templates/profile/list.html"],
    function (Marionette, Photos, ItemView, ListTemplate) {
        'use strict';
        var ListView = Marionette.CompositeView.extend({
            childView: ItemView,
            events: {
                "click #viewEdit": "viewEdit",
                "click #viewStatic": "viewStatic"
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
            }

        });
        return ListView;
    });
