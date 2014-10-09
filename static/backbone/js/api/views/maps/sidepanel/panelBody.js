/**
 * Created by zmmachar on 9/30/14.
 */
define(["marionette",
        "underscore"
    ],
    function (Marionette, _) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var PanelBody = Marionette.LayoutView.extend({
            /**
             * @lends localground.maps.views.DataPanel#
             */
            events: {
            },
            regions: {
            }
        });
        return PanelBody;
    });
