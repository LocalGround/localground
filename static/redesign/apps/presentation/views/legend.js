define(["marionette",
        "handlebars",
        "text!../templates/legend.html"
    ],
    function (Marionette, Handlebars, LegendTemplate) {
        'use strict';

        var LegendView = Marionette.ItemView.extend({

            template: Handlebars.compile(LegendTemplate),

            initialize: function (opts) {
                this.app = opts.app;
            }

        });
        return LegendView;
    });