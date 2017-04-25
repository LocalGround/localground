define(["marionette",
        "handlebars",
        "collections/maps",
        "text!../../templates/left/skin.html"
    ],
    function (Marionette, Handlebars, Maps, SkinTemplate) {
        'use strict';

        var SelectSkinView = Marionette.ItemView.extend({
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
            }, 

            events: {
                'click .hide-panel': 'hideSection',
                'click .show-panel': 'showSection'
            },

            templateHelpers:  function () {
                return {
                    isShowing: this.isShowing
                };
            },

            hideSection: function (e) {
                this.isShowing = false;
                this.saveState();
                this.render();
            },
            showSection: function (e) {
                this.isShowing = true;
                this.saveState();
                this.render();
            },
            saveState: function () {
                this.app.saveState("skin", {
                    isShowing: this.isShowing
                });
            },
            restoreState: function () {
                var state = this.app.restoreState("skin");
                if (state) {
                    this.isShowing = state.isShowing;
                }
            }

        });
        return SelectSkinView;
    });