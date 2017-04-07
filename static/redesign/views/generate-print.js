define(["jquery",
        "marionette",
        "handlebars",
        "lib/modals/modal",
        "text!../templates/print-layout.html"
    ],
    function ($, Marionette, Handlebars, Modal, PrintLayoutTemplate) {
        'use strict';
        // More info here: http://marionettejs.com/docs/v2.4.4/marionette.layoutview.html
        var GeneratePrintLayout = Marionette.LayoutView.extend({
            template: Handlebars.compile(PrintLayoutTemplate),

            initialize: function (opts) {
                /*This Layout View relies on a Map model which gets set from the change-map event,
                which is triggered from the select-map-view.js */
                this.app = opts.app;
                this.render();
            },

            events: {
                'click .print-button': "showModal"
            },

            regions: {
                regionLeft: ".region_left",
                regionRight: ".region_right"
            },
            onRender: function () {
                // only load views after the LayoutView has
                // been rendered to the screen:

                /*
                var sv, lv, skv, ps;
                sv = new SelectMapView({ app: this.app });
                this.menu.show(sv);

                lv = new LayerListView({ app: this.app });
                this.layers.show(lv);

                skv = new SkinView({ app: this.app });
                this.skins.show(skv);

                ps = new PanelStylesView({ app: this.app });
                this.styles.show(ps);
                */
            }
        });
        return GeneratePrintLayout;
    });
