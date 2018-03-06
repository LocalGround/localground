define([
    "jquery",
    "marionette",
    "backbone",
    "apps/main/controller"
], function ($, Marionette, Backbone, Controller) {
    "use strict";
    var Router = Marionette.AppRouter.extend({
        appRoutes: {
            '': 'defaultMap',
            ':mapId': 'displayMap',
            ':mapId/layers/new':'newLayer',
            ':mapId/layers/:layerId': 'displayLayer'
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
