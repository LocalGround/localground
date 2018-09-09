define([
    "jquery",
    "marionette",
    "backbone",
    "apps/project_detail/controller"
], function ($, Marionette, Backbone, Controller) {
    "use strict";
    var Router = Marionette.AppRouter.extend({
        appRoutes: {
            '': 'defaultMap'//,
            // ':mapId': 'displayMap',
            // ':mapId/layers/new':'newLayer',
            // ':mapId/layers/:layerId': 'displayLayer',
            // ':mapId/layers/:layerId/:dataSource/:markerId': 'displayDataDetail'

        },
        initialize: function (options) {
            this.controller = new Controller({
                app: options.app
            });
            Marionette.AppRouter.prototype.initialize.apply(this, [options]);
            this.applyRoutingHacks();
        },
        applyRoutingHacks: function () {
            $('a').click(function () {
                if ('#/' + Backbone.history.fragment == $(this).attr('href')) {
                    Backbone.history.loadUrl(Backbone.history.fragment);
                }
            });
        }
    });
    return Router;
});
