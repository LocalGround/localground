define([
    "jquery",
    "marionette",
    "backbone",
    "apps/dataviewer/controller"
], function ($, Marionette, Backbone, Controller) {
    "use strict";
    var Router = Marionette.AppRouter.extend({
        appRoutes: {
            '': 'showMap',
            ':mode/:dataType': 'dataList',

            'map': 'showMap',
            'map/:dataType': 'dataList',
            'map/:dataType/:id': 'dataDetail',
            'map/:dataType/new': 'addRow',

            'table': 'showTable',
            'table/:dataType/:id': 'dataDetail',
            'table/:dataType/new': 'addRow',

            'gallery': 'showGallery',
            'gallery/:dataType': 'dataList',
            'gallery/:dataType/:id': 'dataDetail',
            'gallery/:dataType/new': 'addRow'
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
