define([
    "jquery",
    "marionette",
    "backbone",
    "apps/dataviewer/controller"
], function ($, Marionette, Backbone, Controller) {
    "use strict";
    var Router = Marionette.AppRouter.extend({
        appRoutes: {
            'table': 'showTable',
            'gallery': 'showGallery',
            ':dataType': 'dataList',
            ':dataType/new': 'addRow'
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
