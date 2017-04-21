define(["marionette",
        "handlebars",
        "collections/maps",
        "text!../../templates/left/skin.html"
    ],
    function (Marionette, Handlebars, Maps, SkinTemplate) {
        'use strict';

        var SelectSkinView = Marionette.ItemView.extend({

            template: Handlebars.compile(SkinTemplate),

            initialize: function (opts) {
                this.app = opts.app;

                // here is some fake data until the
                // /api/0/maps/ API Endpoint gets built:
                this.collection = new Maps([
                    { id: 1, name: "Greyscale", project_id: 4 },
                    { id: 2, name: "Default", project_id: 4 },
                    { id: 3, name: "Dark", project_id: 4 }                ]);
            }, 

            events: {
                'click .hide-panel': 'hideSection',
                'click .show-panel': 'showSection'
            },

            hideSection: function (e) {
                this.$el.find("#skin-select").hide();
                $(e.target).removeClass("hide-panel fa-caret-down");
                $(e.target).addClass("show-panel fa-caret-right");
            },
            showSection: function (e) {
                this.$el.find("#skin-select").show();
                $(e.target).removeClass("show-panel fa-caret-right");
                $(e.target).addClass("hide-panel fa-caret-down");
            }

        });
        return SelectSkinView;
    });