define(["marionette",
        "handlebars",
        "collections/maps",
        "apps/style/visibility-mixin",
        "text!../../templates/left/skin.html"
    ],
    function (Marionette, Handlebars, Maps, PanelVisibilityExtensions, SkinTemplate) {
        'use strict';

        var SelectSkinView = Marionette.ItemView.extend(_.extend({}, PanelVisibilityExtensions, {
            stateKey: 'skin',
            isShowing: false,
            template: Handlebars.compile(SkinTemplate),

            initialize: function (opts) {
                this.app = opts.app;
                this.restoreState();

                // here is some fake data until the
                // /api/0/maps/ API Endpoint gets built:
                this.collection = new Maps([
                    { id: 1, name: "Greyscale", project_id: 4 },
                    { id: 2, name: "Default", project_id: 4 },
                    { id: 3, name: "Dark", project_id: 4 }                ]);
            }
        }));
        return SelectSkinView;
    });