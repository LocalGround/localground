define(["underscore",
        "marionette",
        "handlebars",
        "text!../templates/title-card.html"
    ],
    function (_, Marionette, Handlebars, TitleCard) {
        'use strict';
        var TitleCard = Marionette.ItemView.extend({

            template: Handlebars.compile(TitleCard),

            initialize: function (opts) {
                _.extend(this, opts);
                //this.render();
            },
            templateHelpers: function () {
            },
            onRender: function () {
                
            }
        });
        return TitleCard;
    });