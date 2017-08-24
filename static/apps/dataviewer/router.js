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
            //':dataType/:id': 'dataDetail',
            ':mode/:dataType': 'dataList',

            'map': 'showMap',
            'map/:dataType': 'dataList',
            'map/:dataType/new': 'addRow',
            'map/:dataType/:id': 'dataDetail',

            'table': 'showTable',
            'table/:dataType/new': 'addRow',
            'table/:dataType/:id': 'dataDetail',

            'gallery': 'showGallery',
            'gallery/:dataType': 'dataList',
            'gallery/:dataType/new': 'addRow',
            'gallery/:dataType/:id': 'dataDetail'
        },
        initialize: function (options) {
            //add additional regex routes on initialize
            //this.route(/^markers\/2$/, "dataDetail");
            //this.route(/^(\w+)\/^(\w+)$/, "dataList");
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
