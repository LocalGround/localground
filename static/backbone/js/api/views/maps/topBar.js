define(["marionette",
        "jquery",
        'text!/static/backbone/js/templates/mapTopbar.html',
    ],
    function (Marionette, $, MapNavbar) {
        'use strict';

        var TopBar = Marionette.View.extend({

            /**
             * @lends localground.maps.views.TopBar#
             */
            //id: "topbar",
            template: function () {
                return _.template(MapNavbar);
            },
            events: {
                "click .fa-close": "hide"
            },
            hide: function () {
                this.$el.find("#error_message").hide();
            },
            initialize: function (opts) {
                opts = opts || {};
                $.extend(this, opts);
                this.$el.html(this.template());
                this.app.vent.on('database-error', this.displayError.bind(this));
            },
            displayError: function (opts) {
                this.$el.find("#error_message").find("span").html(opts.message);
                this.$el.find("#error_message").show();
            }
        });

        return TopBar;
    });