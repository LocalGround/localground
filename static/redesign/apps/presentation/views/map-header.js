define(["underscore",
        "marionette",
        "handlebars"
    ],
    function (_, Marionette, Handlebars) {
        'use strict';
        var MapHeader = Marionette.ItemView.extend({

            template: Handlebars.compile("<h1>{{name}}</h1><h2>{{caption}}</h2>"),

            initialize: function (opts) {
                _.extend(this, opts);
                this.render();
                //console.log(this.$el);
            }
        });
        return MapHeader;
    });