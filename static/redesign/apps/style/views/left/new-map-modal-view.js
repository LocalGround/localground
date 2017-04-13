define ([
    "jquery",
    "underscore",
    "marionette",
    "handlebars",
    "text!../../templates/left/new-map-modal.html"],
    function ($, _, Marionette, Handlebars, NewMapModalTemplate) {
        'use strict';

        var NewMap = Marionette.ItemView.extend({    
            initialize: function (opts) {
                _.extend(this, opts);

                // call Marionette's default functionality (similar to "super")
             //   Marionette.CompositeView.prototype.initialize.call(this);
               // this.displayMedia();

         
               // this.listenTo(this.collection, 'reset', this.render);
            },

            events: {
             //   "click #media-audio" : "changeToAudio",
            },

            saveMap: function () {
                var mapName = this.$el.find(".map-input").val();
                console.log(mapName);
                this.app.vent.trigger("create-new-map", mapName);
            },
            template: function () {
                return Handlebars.compile(NewMapModalTemplate);
            },

        });
        return NewMap;

    }
);
