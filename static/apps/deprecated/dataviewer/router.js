define([
    "jquery",
    "marionette",
    "backbone",
    "apps/dataviewer/controller"
], function ($, Marionette, Backbone, Controller) {
    "use strict";
    var Router = Marionette.AppRouter.extend({
        appRoutes: {
            //'': 'showMap',
            'map': 'showMap',
            'table': 'showTable',
            'gallery': 'showGallery'
        },
        initialize: function (options) {
            this.controller = new Controller({
                app: options.app
            });
            Marionette.AppRouter.prototype.initialize.apply(this, [options]);

            //Add regex expressions
            this.route.apply(this, [
                //e.g. #/table/photos
                /^(\w+)\/([a-z]+_*[0-9]*[a-z]*)$/,
                'dataList',
                this.controller.dataList.bind(this.controller)
            ]);
            this.route.apply(this, [
                //e.g. #/table/photos/23
                ///^(\w+)\/([0-9]+)$/,
                /^(\w+)\/([a-z]+_*[0-9]*[a-z]*)\/([0-9]+)$/,
                'dataDetail',
                this.controller.dataDetail.bind(this.controller)
            ]);
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
