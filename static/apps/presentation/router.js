define([
    "jquery",
    "marionette",
    "backbone",
    "apps/presentation/controller"
], function ($, Marionette, Backbone, Controller) {
    "use strict";
    var Router = Marionette.AppRouter.extend({
        appRoutes: {
            ':dataType/:id': 'dataDetail',
            //'/^[\w-]+/': 'fetchMap'//,
            //new RegExp('^([\w-]+)'): 'fetchMap',
            ':slug': 'fetchMap'
        },
        initialize: function (options) {
            this.controller = new Controller({
                app: options.app
            });
            Marionette.AppRouter.prototype.initialize.apply(this, [options]);
            this.applyRoutingHacks();
            ///^[a-zA-Z0-9-_]+$/
            //this.route(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/, 'fetchMap');
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
