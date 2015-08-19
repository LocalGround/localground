define(["marionette",
        "underscore",
        "jquery",
        "text!" + templateDir + "/prints/printForm.html"
    ],
    function (Marionette,
              _,
              $,
              printFormTemplate) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * print form
         * @class PrintForm
         */
        var PrintForm = Marionette.CompositeView.extend({
            /**
             * @lends localground.maps.views.PrintForm#
             */
            template: function () {
                return _.template(printFormTemplate);
            },

            tagName: 'div',
            id: 'print-form',

            events: {
                
            },
            regions: {
            },
            childViewContainer: "#project-selector",

            childView: Marionette.ItemView.extend({
                tagName: 'option',
                onRender: function() {
                    if (this.model) {
                        this.$el.val(this.model.get('id'));
                    }
                },
                template: _.template('<%= name %>'),
                modelEvents: {'change': 'render'}
            }),
            /**
             * Initializes the printForm
             * @param {Object} opts
             */
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                this.collection = opts.projects;
            },

            onShow: function () {
            }

        });
        return PrintForm;
    });
