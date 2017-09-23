define([
    "jquery",
    "marionette",
    "backbone",
    "apps/style/controller"
], function ($, Marionette, Backbone, Controller) {
    "use strict";
    var Router = Marionette.AppRouter.extend({
        appRoutes: {
            'new': 'newMap',
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


/*
/:mapID/new—> create new map
/:mapID —> switch to that map (done)
/:mapID/layers/:LayerID —> open that layer on the right
/:mapID/layers/:new—> create layer


*/
