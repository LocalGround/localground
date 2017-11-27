define(["marionette",
        "handlebars",
        "collections/maps",
        "text!../../templates/left/skin.html"
    ],
    function (Marionette, Handlebars, Maps, SkinTemplate) {
        'use strict';

        var SelectSkinView = Marionette.ItemView.extend(_.extend({}, {
            stateKey: 'skin',
            isShowing: false,
            template: Handlebars.compile(SkinTemplate),

            initialize: function (opts) {
                this.app = opts.app;

                // here is some fake data until the
                // /api/0/maps/ API Endpoint gets built:
                this.collection = new Maps([
                    { id: 1, name: "Greyscale" },
                    { id: 2, name: "Default" },
                    { id: 3, name: "Dark" } ], {projectID: this.app.getProjectID()});
            }
        }));
        return SelectSkinView;
    });
