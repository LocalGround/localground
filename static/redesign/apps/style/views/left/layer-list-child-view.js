define(["marionette",
        "handlebars",
        "collections/layers",
        "text!../../templates/left/layer-item.html"
    ],
    function (Marionette, Handlebars, Layers, LayerItemTemplate) {
        'use strict';
        var LayerListChild =  Marionette.ItemView.extend({
            initialize: function (opts) {
                _.extend(this, opts);
            // this.listenTo(this.app.vent, 'update-title', this.updateTitle);
            this.listenTo(this.model, "change", this.render);
            },
            template: Handlebars.compile(LayerItemTemplate),
            modelEvents: {},
            events: {
                //edit event here, pass the this.model to the right panel
                "click .edit" : "sendCollection"
                },
            tagName: "div",
            className: "column",
            templateHelpers: function () {
                return {
                    test: "123"
                };
            },

            sendCollection: function() {
                this.app.vent.trigger("edit-layer", this.model);
                console.log(this.model);
            },


            updateTitle: function (title) {
                this.model.set("title", title);
                console.log("should work");
                this.render();
            }
        });
        return LayerListChild;
    });