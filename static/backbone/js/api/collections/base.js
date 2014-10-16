define(["backbone", "jquery"],
    function (Backbone, $) {
        "use strict";
        /**
         * An "abstract" Backbone Collection; the root of all of the other
         * localground.collections.* classes. Has some helper methods that help
         * Backbone.Collection objects more easily interat with the Local Ground
         * Data API.
         * @class localground.collections.Base
         */
        var Base = Backbone.Collection.extend({
            key: null,
            defaults: {
                isVisible: true
            },
            initialize: function (model, opts) {
                opts = opts || {};
                $.extend(this, opts);
            },
            parse: function (response) {
                return response.results;
            }

        });

        return Base;
    });
