/**
 * Created by zmmachar on 2/11/15.
 */
define(["marionette",
        "backbone",
        "underscore",
        "lib/appUtilities",
        "jquery.bootstrap"
    ],
    function (Marionette, Backbone, _, appUtilities) {
        "use strict";

        var BaseMapplication = new Marionette.Application();
        _.extend(BaseMapplication, appUtilities);
        BaseMapplication.setMode('view');


        BaseMapplication.navigate = function (route, options) {
            options = options || {};
            Backbone.history.navigate(route, options);
        };

        BaseMapplication.getCurrentRoute = function () {
            return Backbone.history.fragment;
        };

        BaseMapplication.on("start", function () {
            if (Backbone.history) {
                Backbone.history.start();
            }
        });


        return BaseMapplication;
    });