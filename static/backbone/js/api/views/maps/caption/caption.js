/**
 * Created by zmmachar on 2/17/15.
 */
define(["../../../../external/backbone.marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/caption.html"
    ],
    function (Marionette, _, $, captionTemplate) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var CaptionManager = Marionette.ItemView.extend({

            upArrow: 'fa fa-chevron-up',
            downArrow: 'fa fa-chevron-down',

            id: "caption-container",
            /**
             * @lends localground.maps.views.DataPanel#
             */
            template: function (model) {
                if (model.caption) {
                    return _.template(captionTemplate, model);
                }
            },

            events: {
                'click #caption-toggle': 'toggleCaption'
            },
            /**
             * Initializes the dataPanel
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.container = opts.container;
                this.app = opts.app;
                this.opts = opts;
                this.model = opts.snapshot;
                if (this.model) {
                    this.setCaption();
                }
            },

            setCaption: function () {
                this.render();
                $('#' + this.container).append(this.$el);
                if (this.model) {
                    $('#caption-container').show();
                }
            },

            toggleCaption: function () {
                $('#caption').slideToggle();
                var toggle = $('#caption-toggle');
                toggle.attr('class', (toggle.attr('class') === this.upArrow) ? this.downArrow : this.upArrow);
            }

        });
        return CaptionManager;
    });
